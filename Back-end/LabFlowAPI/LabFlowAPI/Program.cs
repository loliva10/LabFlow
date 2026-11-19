using System.Text;

using LabFlowAPI.Data;
using LabFlowAPI.Interface;
using LabFlowAPI.Repositories;
using LabFlowAPI.Services.Documentos;
using LabFlowAPI.Services.IA;
using LabFlowAPI.Services.Processamento;
using LabFlowAPI.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<LlamaService>(client =>
{
    var ollamaUrl = builder.Configuration["IA:Ollama:BaseUrl"]
        ?? "http://localhost:11434/";

    client.BaseAddress = new Uri(ollamaUrl);
    client.Timeout = TimeSpan.FromMinutes(3);
});

builder.Services.AddHttpClient<GroqService>(client =>
{
    var groqUrl = builder.Configuration["IA:Groq:BaseUrl"]
        ?? "https://api.groq.com/openai/v1/";

    client.BaseAddress = new Uri(groqUrl);
    client.Timeout = TimeSpan.FromMinutes(3);
});

builder.Services.AddScoped<ILanguageModelService, LhamaIAChatService>();

builder.Services.AddHttpClient<ILhamaIa, LhamaIaService>(client =>
{
    client.Timeout = TimeSpan.FromMinutes(3);
});

builder.Services.AddScoped<ILeitorDocumento, LeitorDocumento>();
builder.Services.AddScoped<IConferenciaExtracao, ConferenciaExtracaoService>();
builder.Services.AddScoped<IProcessadorDocumento, ProcessadorDocumento>();

var connectionString = builder.Configuration.GetConnectionString("LabFlow")
    ?? throw new InvalidOperationException("Connection string 'LabFlow' não configurada em appsettings.json.");

builder.Services.AddDbContext<LabFlowContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IDocumentoRepository, DocumentoRepository>();
builder.Services.AddScoped<IExtracaoRepository, ExtracaoRepository>();
builder.Services.AddScoped<IValidacaoRepository, ValidacaoRepository>();
builder.Services.AddScoped<IHistoricoRepository, HistoricoRepository>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key não configurada em appsettings.json.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = GeradorToken.Emissor,
            ValidateAudience = true,
            ValidAudience = GeradorToken.Destinatario,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
            NameClaimType = "name",
            RoleClaimType = "role"
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = contexto =>
            {
                var idUsuario = contexto.Principal?.GetIdUsuario();

                var repositorio = contexto.HttpContext.RequestServices
                    .GetRequiredService<IUsuarioRepository>();

                var usuario = idUsuario == null ? null : repositorio.BuscarPorId(idUsuario.Value);

                if (usuario == null || usuario.Ativo != true)
                {
                    contexto.Fail("Usuário inativo ou inexistente.");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "LabFlow API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Cole apenas o token retornado por api/Usuario/login."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
});

const string PoliticaCors = "LabFlowCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(PoliticaCors, policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseCors(PoliticaCors);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();