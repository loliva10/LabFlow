import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { UserProvider, useUser } from './context/UserContext';
import MenuGlobal from './components/MenuGlobal/MenuGlobal';
import Login from './pages/desktop/login/Login';
import Dashboard from './pages/desktop/dashboard/dashboard';
import CentralDeDocumentos from './pages/desktop/centralDeDocumentos/centralDeDocumentos';
import CentralDeAtendimentos from './pages/desktop/centralDeAtendimentos/centralDeAtendimentos';
import Atendimento from './pages/desktop/atendimento/atendimento';
import NovoAtendimento from './pages/desktop/novoAtendimento/novoAtendimento';
import AnaliseDeDocumentos from './pages/desktop/analiseDeDocumentos/analiseDeDocumentos';
import ImportarDocumentos from './pages/desktop/importarDocumentos/importarDocumentos';
import CentralDeValidacao from './pages/desktop/centralDeValidacao/centralDeValidacao';
import Integracoes from './pages/desktop/integracoes/integracoes';
import Administracao from './pages/desktop/administracao/administracao';
import CadastroUsuario from './pages/desktop/cadastroUsuario/cadastroUsuario';
import MeuPerfil from './pages/desktop/meuPerfil/meuPerfil';
import { usuariosIniciais, PERFIL_ADMIN } from './pages/desktop/administracao/usuariosMock';
import { logout } from './services/usuarioService';

const PERFIL_ADMIN_API = 'Administrador';

const TELAS_ADMIN = ['administracao', 'cadastroUsuario'];

const TIPO_IMPORTACAO = {
  notaFiscal: 'Nota Fiscal',
  contrato: 'Contrato',
  laudo: 'Laudo',
  recibo: 'Recibo',
  exame: 'Exame',
  receita: 'Receita',
  boleto: 'Boleto',
  outro: 'Outro',
};

function dataHoje() {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

function paraContexto(u) {
  return {
    id: u.id,
    nome: u.nome || '',
    email: u.email || '',
    cargo: u.cargo || u.perfil || '',
    perfil: u.perfil || '',
    instituicao: u.instituicao || 'LabFlow',
    telefone: u.telefone || '',
    avatarUrl: u.avatarUrl || null,
  };
}

function EmBreve({ title, activeMenu, onNavigate }) {
  const { colors, t } = usePreferences();
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.bg }}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 26, color: colors.text }}>{title}</Text>
        <Text style={{ fontFamily: 'Poppins_300Light', fontSize: 15, color: colors.text }}>
          {t('emBreve.subtitulo')}
        </Text>
      </View>
    </View>
  );
}

function AppContent() {
  const { colors } = usePreferences();
  const { user, setUser } = useUser();
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  const [activeMenu, setActiveMenu] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [analysisDoc, setAnalysisDoc] = useState(null);
  const [validationDoc, setValidationDoc] = useState(null);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);
  const [docOverrides, setDocOverrides] = useState({});
  const [documentosImportados, setDocumentosImportados] = useState([]);
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [editingUser, setEditingUser] = useState(null);
  const docsVisited = useRef(false);

  const isAdmin =
    !!usuarioLogado &&
    (usuarioLogado.perfil === PERFIL_ADMIN_API || usuarioLogado.perfil === PERFIL_ADMIN);

  useEffect(() => {
    if (!usuarioLogado || user.id !== usuarioLogado.id) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              nome: user.nome,
              email: user.email,
              cargo: user.cargo,
              instituicao: user.instituicao,
              telefone: user.telefone,
              avatarUrl: user.avatarUrl,
            }
          : u
      )
    );
  }, [user]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (
    activeMenu === 'documentos' ||
    activeMenu === 'analise' ||
    activeMenu === 'importar' ||
    activeMenu === 'validacao'
  ) {
    docsVisited.current = true;
  }

  function handleNavigate(key) {
    if (TELAS_ADMIN.includes(key) && !isAdmin) {
      setActiveMenu('dashboard');
      return;
    }
    setActiveMenu(key);
  }
  function handleOpenProfile() {
    setActiveMenu('perfil');
  }
  function handleOpenNotifications() {
    console.log('Abrir notificações');
  }
  function handleAddAtendimento() {
    setActiveMenu('novoAtendimento');
  }
  function handleSaveAtendimento(dados) {
    console.log('Novo atendimento:', dados);
    setActiveMenu('atendimentos');
  }
  function handleCancelAtendimento() {
    setActiveMenu('atendimentos');
  }
  function handleOpenAtendimento(atendimento) {
    setSelectedAtendimento(atendimento);
    setActiveMenu('atendimento');
  }
  function handleBackAtendimento() {
    setSelectedAtendimento(null);
    setActiveMenu('atendimentos');
  }
  function handleAddDocument() {
    setActiveMenu('importar');
  }

  function handleImport(arquivos, tipo) {
    const lista = Array.isArray(arquivos) ? arquivos : arquivos ? [arquivos] : [];
    const agora = Date.now();

    const novos = lista.map((arq, i) => ({
      id: `imp-${agora}-${i}`,
      nome: arq.name || 'Documento sem nome',
      tipo: TIPO_IMPORTACAO[tipo] || 'Outro',
      status: 'Revisão',
      confianca: 0,
      data: dataHoje(),
      tamanho: arq.size || null,
      uri: arq.uri || null,
      file: arq.file || null,
      importado: true,
    }));

    if (novos.length > 0) {
      setDocumentosImportados((prev) => [...novos, ...prev]);
    }
    setActiveMenu('documentos');
  }

  function handleOpenValidation(doc) {
    setValidationDoc(doc);
    setActiveMenu('validacao');
  }
  function handleSaveValidation(doc, changes) {
    if (doc) {
      setDocOverrides((prev) => ({ ...prev, [doc.id]: { ...(prev[doc.id] || {}), ...changes } }));
    }
    setValidationDoc(null);
    setActiveMenu('documentos');
  }
  function handleDeleteValidation(doc) {
    console.log('Deletar documento:', doc);
    if (doc && doc.importado) {
      setDocumentosImportados((prev) => prev.filter((d) => d.id !== doc.id));
    }
    setValidationDoc(null);
    setActiveMenu('documentos');
  }
  function handleOpenAnalysis(doc) {
    setAnalysisDoc(doc);
    setActiveMenu('analise');
  }
  function handleSaveAnalysis(doc, changes) {
    setDocOverrides((prev) => ({ ...prev, [doc.id]: { ...(prev[doc.id] || {}), ...changes } }));
    setAnalysisDoc(null);
    setActiveMenu('documentos');
  }

  function handleAddUser() {
    if (!isAdmin) return;
    setEditingUser(null);
    setActiveMenu('cadastroUsuario');
  }
  function handleEditUser(usuario) {
    if (!isAdmin) return;
    setEditingUser(usuario);
    setActiveMenu('cadastroUsuario');
  }
  function handleSaveUser(dados) {
    if (!isAdmin) return;
    const email = String(dados.email || '').trim().toLowerCase();

    if (editingUser) {
      const perfilFinal =
        editingUser.perfil === PERFIL_ADMIN
          ? PERFIL_ADMIN
          : dados.perfil === PERFIL_ADMIN
          ? editingUser.perfil
          : dados.perfil || editingUser.perfil;
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...dados, email, perfil: perfilFinal, senha: dados.senha || u.senha }
            : u
        )
      );
    } else {
      const perfilFinal = !dados.perfil || dados.perfil === PERFIL_ADMIN ? 'Operador' : dados.perfil;
      setUsuarios((prev) => [
        {
          id: Date.now(),
          ativo: true,
          nome: '',
          cargo: '',
          ...dados,
          email,
          perfil: perfilFinal,
        },
        ...prev,
      ]);
    }
    setEditingUser(null);
    setActiveMenu('administracao');
  }
  function handleCancelUser() {
    setEditingUser(null);
    setActiveMenu('administracao');
  }
  function handleDeleteUser(id) {
    if (!isAdmin) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id || u.perfil === PERFIL_ADMIN));
  }

  async function handleLogout() {
    await logout();
    docsVisited.current = false;
    setAnalysisDoc(null);
    setValidationDoc(null);
    setSelectedAtendimento(null);
    setEditingUser(null);
    setUsuarioLogado(null);
    setActiveMenu('login');
  }

  function handleLogin(dadosApi) {
    const usuario = {
      id: dadosApi.idUsuario,
      nome: dadosApi.nome,
      email: dadosApi.email,
      cargo: '',
      perfil: dadosApi.perfilAcesso,
      ativo: true,
    };
    setUser(paraContexto(usuario));
    setUsuarioLogado(usuario);
    setActiveMenu('dashboard');
  }

  function renderScreen() {
    if (!usuarioLogado) return <Login onLogin={handleLogin} />;

    const common = { activeMenu, onNavigate: handleNavigate };
    const header = {
      onOpenNotifications: handleOpenNotifications,
      onOpenProfile: handleOpenProfile,
    };

    if (TELAS_ADMIN.includes(activeMenu) && !isAdmin) {
      return (
        <Dashboard
          {...common}
          activeMenu="dashboard"
          {...header}
          onSeeAllActivities={() => handleNavigate('documentos')}
        />
      );
    }

    switch (activeMenu) {
      case 'validacao':
        return (
          <CentralDeValidacao
            key={validationDoc ? validationDoc.id : 'sem-documento'}
            activeMenu="documentos"
            onNavigate={handleNavigate}
            doc={validationDoc}
            onBack={() => handleNavigate('documentos')}
            onSave={handleSaveValidation}
            onDelete={handleDeleteValidation}
          />
        );
      case 'importar':
        return (
          <ImportarDocumentos
            activeMenu="documentos"
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('documentos')}
            onImport={handleImport}
          />
        );
      case 'analise':
        return (
          <AnaliseDeDocumentos
            key={analysisDoc ? analysisDoc.id : 'sem-documento'}
            activeMenu="documentos"
            onNavigate={handleNavigate}
            doc={analysisDoc}
            onBack={() => handleNavigate('documentos')}
            onSaveAnalysis={handleSaveAnalysis}
          />
        );
      case 'atendimentos':
        return (
          <CentralDeAtendimentos
            {...common}
            {...header}
            onAddAtendimento={handleAddAtendimento}
            onOpenAtendimento={handleOpenAtendimento}
          />
        );
      case 'atendimento':
        return (
          <Atendimento
            key={selectedAtendimento ? selectedAtendimento.id : 'sem-atendimento'}
            activeMenu="atendimentos"
            onNavigate={handleNavigate}
            {...header}
            atendimento={selectedAtendimento}
            onBack={handleBackAtendimento}
            onVoltar={handleBackAtendimento}
          />
        );
      case 'novoAtendimento':
        return (
          <NovoAtendimento
            activeMenu="atendimentos"
            onNavigate={handleNavigate}
            onVoltar={handleCancelAtendimento}
            onSalvar={handleSaveAtendimento}
          />
        );
      case 'integracoes':
        return <Integracoes {...common} {...header} />;
      case 'administracao':
        return (
          <Administracao
            {...common}
            {...header}
            usuarios={usuarios}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'cadastroUsuario':
        return (
          <CadastroUsuario
            key={editingUser ? editingUser.id : 'novo-usuario'}
            usuario={editingUser}
            onSubmit={handleSaveUser}
            onCancel={handleCancelUser}
          />
        );
      case 'perfil':
        return (
          <MeuPerfil
            key={usuarioLogado.id}
            {...common}
            perfil={usuarioLogado.perfil}
            onOpenNotifications={handleOpenNotifications}
            onLogout={handleLogout}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            {...common}
            {...header}
            onSeeAllActivities={() => handleNavigate('documentos')}
          />
        );
    }
  }

  return (
    <>
      <StatusBar style={colors.statusBar} />
      {usuarioLogado && docsVisited.current && (
        <View style={{ flex: 1, display: activeMenu === 'documentos' ? 'flex' : 'none' }}>
          <CentralDeDocumentos
            activeMenu="documentos"
            onNavigate={handleNavigate}
            onAddDocument={handleAddDocument}
            onOpenValidation={handleOpenValidation}
            onOpenAnalysis={handleOpenAnalysis}
            onOpenNotifications={handleOpenNotifications}
            onOpenProfile={handleOpenProfile}
            overrides={docOverrides}
            documentosImportados={documentosImportados}
          />
        </View>
      )}
      {(activeMenu !== 'documentos' || !usuarioLogado) && renderScreen()}
    </>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </PreferencesProvider>
  );
}