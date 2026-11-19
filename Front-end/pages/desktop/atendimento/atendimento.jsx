import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import { createStyles } from './atendimentoStyle';

const CATEGORIAS = {
  duvidas: { labelKey: 'novo.cat.duvidas', icon: 'help-circle-outline' },
  validacao: { labelKey: 'novo.cat.validacao', icon: 'shield-checkmark-outline' },
  acesso: { labelKey: 'novo.cat.acesso', icon: 'key-outline' },
  plataforma: { labelKey: 'novo.cat.plataforma', icon: 'desktop-outline' },
};

const ICONES_TIPO = {
  Suporte: 'help-circle-outline',
  'Validação': 'shield-checkmark-outline',
  'Integração': 'git-network-outline',
  'Relatório': 'bar-chart-outline',
  Documento: 'document-text-outline',
};

const CANAIS = {
  email: { labelKey: 'novo.canal.email', icon: 'mail-outline' },
  whatsapp: { labelKey: 'novo.canal.whatsapp', icon: 'logo-whatsapp' },
  telefone: { labelKey: 'novo.canal.telefone', icon: 'call-outline' },
  plataforma: { labelKey: 'novo.canal.plataforma', icon: 'chatbubbles-outline' },
};

const PRIORIDADES = {
  baixa: { labelKey: 'novo.prior.baixa' },
  media: { labelKey: 'novo.prior.media' },
  alta: { labelKey: 'novo.prior.alta' },
};

const STATUS = {
  aberto: { labelKey: 'novo.statusAberto', box: 'statusAberto', texto: 'statusAbertoTexto' },
  andamento: { labelKey: 'atend.status.andamento', box: 'statusAndamento', texto: 'statusAndamentoTexto' },
  concluido: { labelKey: 'atend.status.concluido', box: 'statusConcluido', texto: 'statusConcluidoTexto' },
  cancelado: { labelKey: 'atend.status.cancelado', box: 'statusCancelado', texto: 'statusCanceladoTexto' },
};

const ACOES_CONFIRMACAO = {
  concluir: { status: 'concluido', icon: 'checkmark-circle-outline', tituloKey: 'atend.confConcluirTitulo', textoKey: 'atend.confConcluirTexto' },
  cancelar: { status: 'cancelado', icon: 'close-circle-outline', tituloKey: 'atend.confCancelarTitulo', textoKey: 'atend.confCancelarTexto' },
};

const SAMPLE_ATENDIMENTO = {
  protocolo: 'ATD-2026-18291',
  assunto: 'Divergência no CNPJ extraído da nota fiscal',
  categoria: 'validacao',
  canal: 'email',
  prioridade: 'alta',
  documento: 'NF-18291.pdf',
  descricao:
    'O CNPJ extraído pela IA apresentou baixa confiança e não confere com o documento original. Solicito a revisão manual do campo.',
  solicitante: 'Maria da Silva',
  email: 'maria.silva@email.com',
  responsavel: 'João Pereira',
  status: 'aberto',
  criadoEm: '2026-11-17T09:12:00',
};

const normalizar = (v) =>
  String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function formatarData(valor, locale) {
  if (!valor) return '—';
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return String(valor);
  return d.toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
}

function CampoLinha({ icon, label, valor, ultimo, children }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.campo, !ultimo && styles.campoLinha]}>
      <View style={styles.campoIcone}>
        <Ionicons name={icon} size={22} color={colors.onPrimary} />
      </View>
      <View style={styles.campoTextos}>
        <Text style={styles.campoLabel}>{label}</Text>
        <Text style={styles.campoValor} numberOfLines={1}>{valor}</Text>
      </View>
      {children}
    </View>
  );
}

export default function Atendimento({
  activeMenu = 'atendimentos',
  onNavigate,
  atendimento,
  onBack,
  onUpdate,
}) {
  const { colors, t, language } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = language === 'en' ? 'en-US' : 'pt-BR';
  const base = atendimento || SAMPLE_ATENDIMENTO;

  const [status, setStatus] = useState(base.status || 'aberto');
  const [historico, setHistorico] = useState(() => [
    { chave: 'atend.hist.aberto', data: base.criadoEm || base.data || new Date().toISOString() },
  ]);
  const [confirmar, setConfirmar] = useState(null);

  const categoriaInfo = CATEGORIAS[base.categoria];
  const categoriaIcon = categoriaInfo?.icon || ICONES_TIPO[base.tipo] || 'headset-outline';
  const categoriaTexto = categoriaInfo ? t(categoriaInfo.labelKey) : base.tipo || '—';

  const canal = CANAIS[base.canal];
  const prioridadeKey = normalizar(base.prioridade);
  const prioridade = PRIORIDADES[prioridadeKey] || PRIORIDADES.media;
  const st = STATUS[status] || STATUS.aberto;

  const assunto = base.assunto || base.tipo || t('atend.titulo');
  const solicitante = base.solicitante || base.cliente || '—';
  const criadoEm = base.criadoEm || base.data;

  const corPrioridade = {
    baixa: { cor: colors.success, fundo: colors.successBg },
    media: { cor: colors.warning, fundo: colors.warningBg },
    alta: { cor: colors.danger, fundo: colors.dangerBg },
  }[prioridadeKey] || { cor: colors.warning, fundo: colors.warningBg };

  const finalizado = status === 'concluido' || status === 'cancelado';

  const mudarStatus = (novo, chaveHistorico) => {
    setStatus(novo);
    setHistorico((prev) => [...prev, { chave: chaveHistorico, data: new Date().toISOString() }]);
    if (onUpdate) onUpdate(atendimento, { status: novo });
  };

  const iniciar = () => mudarStatus('andamento', 'atend.hist.andamento');

  const confirmarAcao = () => {
    const acao = ACOES_CONFIRMACAO[confirmar];
    if (!acao) return;
    mudarStatus(
      acao.status,
      acao.status === 'concluido' ? 'atend.hist.concluido' : 'atend.hist.cancelado'
    );
    setConfirmar(null);
  };

  const acaoAtual = confirmar ? ACOES_CONFIRMACAO[confirmar] : null;

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />
      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ hovered }) => [styles.botaoVoltar, hovered && styles.botaoVoltarHover]}
          onPress={onBack}
          accessibilityLabel={t('novo.voltar')}
        >
          <Ionicons name="arrow-back-outline" size={18} color={colors.onPrimary} />
        </Pressable>

        <View style={styles.titleRow}>
          <Ionicons name="headset-outline" size={32} color={colors.text} style={styles.titleIcon} />
          <Text style={styles.title}>{t('atend.titulo')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('atend.subtitulo')}</Text>

        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <Ionicons name={categoriaIcon} size={34} color={colors.text} />
            <View style={styles.cardCabecalhoTextos}>
              <Text style={styles.atendNome} numberOfLines={1}>{assunto}</Text>
              <Text style={styles.atendSub}>
                {`${base.protocolo} • ${formatarData(criadoEm, locale)} • ${solicitante}`}
              </Text>
            </View>
            <View style={[styles.status, styles[st.box]]}>
              <Text style={[styles.statusTexto, styles[st.texto]]}>{t(st.labelKey)}</Text>
            </View>
          </View>

          <View style={styles.corpo}>
            <View style={styles.colunaEsquerda}>
              <Text style={styles.secaoTitulo}>{t('novo.descricao')}</Text>
              <View style={styles.descricaoBox}>
                <Text style={styles.descricaoTexto}>{base.descricao || t('atend.semDescricao')}</Text>
                {!!base.documento && (
                  <View style={styles.documentoLinha}>
                    <Ionicons name="document-text-outline" size={18} color={colors.text} />
                    <Text style={styles.documentoTexto} numberOfLines={1}>{base.documento}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.secaoTitulo}>{t('atend.historico')}</Text>
              <View style={styles.historico}>
                {historico.map((item, i) => (
                  <View key={`${item.chave}-${i}`} style={styles.historicoItem}>
                    <View style={styles.historicoTrilho}>
                      <View style={styles.historicoPonto} />
                      {i < historico.length - 1 && <View style={styles.historicoLinha} />}
                    </View>
                    <View style={styles.historicoTextos}>
                      <Text style={styles.historicoTitulo}>{t(item.chave)}</Text>
                      <Text style={styles.historicoData}>{formatarData(item.data, locale)}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {!finalizado && (
                <View style={styles.acoes}>
                  {status === 'aberto' && (
                    <Pressable onPress={iniciar} style={({ hovered }) => [styles.acao, hovered && styles.acaoAtiva]}>
                      <Ionicons name="play-outline" size={16} color={colors.ctaText} />
                      <Text style={styles.acaoTexto}>{t('atend.iniciar')}</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => setConfirmar('concluir')}
                    style={({ hovered }) => [styles.acao, hovered && styles.acaoAtiva]}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.ctaText} />
                    <Text style={styles.acaoTexto}>{t('atend.concluir')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setConfirmar('cancelar')}
                    style={({ hovered }) => [styles.acao, hovered && styles.acaoAtiva]}
                  >
                    <Ionicons name="close-circle-outline" size={16} color={colors.ctaText} />
                    <Text style={styles.acaoTexto}>{t('atend.cancelar')}</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.painel}>
              <View style={styles.painelTitulo}>
                <Ionicons name="information-circle-outline" size={28} color={colors.onPrimary} />
                <Text style={styles.painelTituloTexto}>{t('atend.dados')}</Text>
              </View>

              <View style={styles.painelLista}>
                <CampoLinha icon="barcode-outline" label={t('novo.protocolo')} valor={base.protocolo} />
                <CampoLinha icon="person-outline" label={t('atend.solicitante')} valor={solicitante} />
                {!!base.email && (
                  <CampoLinha icon="mail-outline" label={t('atend.email')} valor={base.email} />
                )}
                <CampoLinha icon={categoriaIcon} label={t('novo.categoria')} valor={categoriaTexto} />
                {!!canal && (
                  <CampoLinha icon={canal.icon} label={t('novo.canal')} valor={t(canal.labelKey)} />
                )}
                <CampoLinha icon="flag-outline" label={t('novo.prioridade')} valor={t(prioridade.labelKey)}>
                  <View style={[styles.badgePrioridade, { backgroundColor: corPrioridade.fundo }]}>
                    <Text style={[styles.badgePrioridadeTexto, { color: corPrioridade.cor }]}>
                      {t(prioridade.labelKey)}
                    </Text>
                  </View>
                </CampoLinha>
                {!!base.responsavel && (
                  <CampoLinha icon="headset-outline" label={t('novo.responsavel')} valor={base.responsavel} />
                )}
                <CampoLinha icon="calendar-outline" label={t('atend.criadoEm')} valor={formatarData(criadoEm, locale)} ultimo />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!confirmar} transparent animationType="fade" onRequestClose={() => setConfirmar(null)}>
        <Pressable style={styles.overlay} onPress={() => setConfirmar(null)}>
          <Pressable style={styles.confirmacao} onPress={() => {}}>
            {acaoAtual && (
              <>
                <Ionicons name={acaoAtual.icon} size={32} color={colors.ctaText} />
                <Text style={styles.confirmacaoTitulo}>{t(acaoAtual.tituloKey)}</Text>
                <Text style={styles.confirmacaoTexto}>{t(acaoAtual.textoKey)}</Text>
              </>
            )}
            <View style={styles.confirmacaoAcoes}>
              <Pressable style={styles.confirmacaoCancelar} onPress={() => setConfirmar(null)}>
                <Text style={styles.confirmacaoCancelarTexto}>{t('atend.voltar')}</Text>
              </Pressable>
              <Pressable style={styles.confirmacaoConfirmar} onPress={confirmarAcao}>
                <Text style={styles.confirmacaoConfirmarTexto}>{t('atend.confirmar')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}