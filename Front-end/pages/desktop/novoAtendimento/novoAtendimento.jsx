import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import { useUser } from '../../../context/UserContext';
import { createStyles } from './novoAtendimentoStyle';

const CATEGORIAS = [
  { value: 'duvidas', labelKey: 'novo.cat.duvidas', icon: 'help-circle-outline' },
  { value: 'validacao', labelKey: 'novo.cat.validacao', icon: 'shield-checkmark-outline' },
  { value: 'acesso', labelKey: 'novo.cat.acesso', icon: 'key-outline' },
  { value: 'plataforma', labelKey: 'novo.cat.plataforma', icon: 'desktop-outline' },
];

const CANAIS = [
  { value: 'email', labelKey: 'novo.canal.email', icon: 'mail-outline' },
  { value: 'whatsapp', labelKey: 'novo.canal.whatsapp', icon: 'logo-whatsapp' },
  { value: 'telefone', labelKey: 'novo.canal.telefone', icon: 'call-outline' },
  { value: 'plataforma', labelKey: 'novo.canal.plataforma', icon: 'chatbubbles-outline' },
];

const PRIORIDADES = [
  { value: 'baixa', labelKey: 'novo.prior.baixa', icon: 'arrow-down-outline' },
  { value: 'media', labelKey: 'novo.prior.media', icon: 'remove-outline' },
  { value: 'alta', labelKey: 'novo.prior.alta', icon: 'arrow-up-outline' },
];

const ESTADO_INICIAL = {
  assunto: '',
  categoria: 'duvidas',
  canal: 'email',
  prioridade: 'media',
  documento: '',
  descricao: '',
};

function gerarProtocolo() {
  const ano = new Date().getFullYear();
  const numero = String(Math.floor(Math.random() * 90000) + 10000);
  return `ATD-${ano}-${numero}`;
}

function Campo({ label, opcional, value, onChangeText, multiline, erro, ...rest }) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const [focado, setFocado] = useState(false);
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {opcional ? <Text style={styles.optional}>({t('novo.opcional')})</Text> : null}
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textarea,
          focado && styles.inputFocused,
          !!erro && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {erro ? <Text style={styles.errorText}>{t(erro)}</Text> : null}
    </View>
  );
}

function Chip({ item, ativo, onPress }) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={({ hovered }) => [
        styles.chip,
        hovered && !ativo && styles.chipHover,
        ativo && styles.chipActive,
      ]}
    >
      <Ionicons name={item.icon} size={16} color={ativo ? colors.onPrimary : colors.text} />
      <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{t(item.labelKey)}</Text>
    </Pressable>
  );
}

function GrupoChips({ label, opcoes, valor, onChange }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { marginBottom: 8 }]}>{label}</Text>
      <View style={styles.chipRow}>
        {opcoes.map((op) => (
          <Chip
            key={op.value}
            item={op}
            ativo={op.value === valor}
            onPress={() => onChange(op.value)}
          />
        ))}
      </View>
    </View>
  );
}

function TituloCard({ icone, texto }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.cardTitleRow}>
      <View style={styles.cardTitleIcon}>
        <Ionicons name={icone} size={20} color={colors.accent} />
      </View>
      <Text style={styles.cardTitle}>{texto}</Text>
    </View>
  );
}

function LinhaResumo({ label, children, ultimo }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.summaryRow, ultimo && styles.summaryRowLast]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Mensagem({ msg }) {
  const { t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  if (!msg) return null;
  return <Text style={[styles.message, styles.messageSuccess]}>{t(msg.chave)}</Text>;
}

export default function NovoAtendimento({
  activeMenu = 'atendimentos',
  onNavigate,
  onVoltar,
  onSalvar,
}) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const { user } = useUser();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [msg, setMsg] = useState(null);
  const [protocolo, setProtocolo] = useState(gerarProtocolo);

  function atualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: undefined }));
    if (msg) setMsg(null);
  }

  function voltar() {
    if (onVoltar) onVoltar();
    else if (onNavigate) onNavigate(activeMenu);
  }

  function cancelar() {
    setForm(ESTADO_INICIAL);
    setErros({});
    setMsg(null);
    voltar();
  }

  function registrar() {
    const novosErros = {};
    if (!form.assunto.trim()) novosErros.assunto = 'novo.erroAssunto';
    if (form.descricao.trim().length < 10) novosErros.descricao = 'novo.erroDescricao';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setMsg(null);
      return;
    }

    if (onSalvar) {
      onSalvar({
        ...form,
        solicitante: user?.nome,
        email: user?.email,
        protocolo,
        status: 'aberto',
        responsavel: user?.nome,
        criadoEm: new Date().toISOString(),
      });
    }

    setForm(ESTADO_INICIAL);
    setErros({});
    setProtocolo(gerarProtocolo());
    setMsg({ chave: 'novo.ok' });
  }

  const corPrioridade = {
    baixa: { cor: colors.success, fundo: colors.successBg },
    media: { cor: colors.warning, fundo: colors.warningBg },
    alta: { cor: colors.danger, fundo: colors.dangerBg },
  }[form.prioridade];

  const categoriaAtual = CATEGORIAS.find((c) => c.value === form.categoria);
  const canalAtual = CANAIS.find((c) => c.value === form.canal);
  const prioridadeAtual = PRIORIDADES.find((p) => p.value === form.prioridade);

  const dicas = ['novo.dica1', 'novo.dica2', 'novo.dica3'];

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ hovered }) => [styles.botaoVoltar, hovered && styles.botaoVoltarHover]}
          onPress={voltar}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back-outline" size={18} color={colors.onPrimary} />
        </Pressable>

        <View style={styles.titleRow}>
          <Ionicons name="headset-outline" size={32} color={colors.text} style={styles.titleIcon} />
          <Text style={styles.title}>{t('novo.titulo')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('novo.subtitulo')}</Text>

        <View style={styles.columns}>
          <View style={styles.mainColumn}>
            <View style={styles.card}>
              <TituloCard icone="document-text-outline" texto={t('novo.secaoDetalhes')} />

              <Campo
                label={t('novo.assunto')}
                value={form.assunto}
                onChangeText={(v) => atualizar('assunto', v)}
                placeholder={t('novo.assuntoPh')}
                erro={erros.assunto}
              />

              <GrupoChips
                label={t('novo.categoria')}
                opcoes={CATEGORIAS}
                valor={form.categoria}
                onChange={(v) => atualizar('categoria', v)}
              />
              <GrupoChips
                label={t('novo.canal')}
                opcoes={CANAIS}
                valor={form.canal}
                onChange={(v) => atualizar('canal', v)}
              />
              <GrupoChips
                label={t('novo.prioridade')}
                opcoes={PRIORIDADES}
                valor={form.prioridade}
                onChange={(v) => atualizar('prioridade', v)}
              />

              <Campo
                label={t('novo.documento')}
                opcional
                value={form.documento}
                onChangeText={(v) => atualizar('documento', v)}
                placeholder={t('novo.documentoPh')}
              />
              <Campo
                label={t('novo.descricao')}
                value={form.descricao}
                onChangeText={(v) => atualizar('descricao', v)}
                placeholder={t('novo.descricaoPh')}
                multiline
                erro={erros.descricao}
              />

              <Mensagem msg={msg} />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.secondaryButton} onPress={cancelar} activeOpacity={0.8}>
                  <Ionicons name="close-outline" size={18} color={colors.text} />
                  <Text style={styles.secondaryButtonText}>{t('novo.cancelar')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={registrar} activeOpacity={0.8}>
                  <Ionicons name="checkmark-outline" size={18} color={colors.onPrimary} />
                  <Text style={styles.primaryButtonText}>{t('novo.registrar')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.sideColumn}>
            <View style={styles.card}>
              <TituloCard icone="receipt-outline" texto={t('novo.resumo')} />

              <LinhaResumo label={t('novo.protocolo')}>
                <Text style={styles.summaryValue}>{protocolo}</Text>
              </LinhaResumo>
              <LinhaResumo label={t('novo.status')}>
                <View style={[styles.badge, { backgroundColor: colors.infoBg }]}>
                  <Text style={[styles.badgeText, { color: colors.info }]}>{t('novo.statusAberto')}</Text>
                </View>
              </LinhaResumo>
              <LinhaResumo label={t('novo.categoria')}>
                <Text style={styles.summaryValue}>{t(categoriaAtual.labelKey)}</Text>
              </LinhaResumo>
              <LinhaResumo label={t('novo.canal')}>
                <Text style={styles.summaryValue}>{t(canalAtual.labelKey)}</Text>
              </LinhaResumo>
              <LinhaResumo label={t('novo.prioridade')}>
                <View style={[styles.badge, { backgroundColor: corPrioridade.fundo }]}>
                  <Text style={[styles.badgeText, { color: corPrioridade.cor }]}>{t(prioridadeAtual.labelKey)}</Text>
                </View>
              </LinhaResumo>
              <LinhaResumo label={t('novo.responsavel')} ultimo>
                <Text style={styles.summaryValue}>{user?.nome || '—'}</Text>
              </LinhaResumo>
            </View>

            <View style={styles.card}>
              <TituloCard icone="bulb-outline" texto={t('novo.dicasTitulo')} />
              {dicas.map((chave) => (
                <View key={chave} style={styles.tipRow}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.accent} />
                  <Text style={styles.tipText}>{t(chave)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}