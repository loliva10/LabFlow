import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import UserHeader from '../../../components/UserHeader/UserHeader';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import { useUser } from '../../../context/UserContext';
import { createStyles } from './dashboardStyle';

const LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

const PERIODS = [
  { value: '7d', label: 'dash.p7' },
  { value: '30d', label: 'dash.p30' },
  { value: '90d', label: 'dash.p90' },
];

const DEFAULT_PERIOD = '30d';
const DEFAULT_RANGE = 6;

const KPIS_BY_PERIOD = {
  '7d': { processed: 312, accuracy: 98.9, saved: 11, inProgress: 24, queue: 8 },
  '30d': { processed: 1248, accuracy: 98.7, saved: 42, inProgress: 24, queue: 8 },
  '90d': { processed: 3610, accuracy: 98.4, saved: 121, inProgress: 24, queue: 8 },
};

const MONTHLY = [
  { mes: 10, valor: 90 },
  { mes: 11, valor: 95 },
  { mes: 0, valor: 80 },
  { mes: 1, valor: 100 },
  { mes: 2, valor: 105 },
  { mes: 3, valor: 110 },
  { mes: 4, valor: 135 },
  { mes: 5, valor: 170 },
  { mes: 6, valor: 230 },
  { mes: 7, valor: 220 },
  { mes: 8, valor: 275 },
  { mes: 9, valor: 340 },
];

const CHART_RANGES = [
  { value: 3, label: 'dash.m3' },
  { value: 6, label: 'dash.m6' },
  { value: 12, label: 'dash.m12' },
];

const RECENT_ACTIVITY = [
  { id: '1', document: 'Laudo_Medico_1007.pdf', type: 'laudo', status: 'concluido', date: new Date(2026, 9, 15, 13, 30), user: 'Mayara' },
  { id: '2', document: 'Exame_Sangue_1014.pdf', type: 'exames', status: 'emProcesso', date: new Date(2026, 9, 15, 14, 25), user: 'Luis' },
  { id: '3', document: 'Pedido_Compra_1021.pdf', type: 'pedido', status: 'concluido', date: new Date(2026, 9, 15, 12, 30), user: 'Felipe' },
  { id: '4', document: 'Relatorio_Vendas_1028.pdf', type: 'relatorio', status: 'concluido', date: new Date(2026, 9, 15, 9, 15), user: 'Henrique' },
];

const REF = 'dash.refAnterior';

const ABAS = [
  { id: 'visao-geral', rotulo: 'dash.visaoGeral', icone: 'grid-outline' },
  { id: 'documentos', rotulo: 'menu.documentos', icone: 'document-text-outline' },
  { id: 'atendimentos', rotulo: 'menu.atendimentos', icone: 'headset-outline' },
  { id: 'integracoes', rotulo: 'menu.integracoes', icone: 'link-outline' },
];

const DADOS = {
  'visao-geral': {
    barras1: { titulo: 'dash.c.processados', filtroMeses: true },
    donut: {
      titulo: 'dash.c.porStatus',
      centro: 'dash.centro.documentos',
      itens: [
        { rotulo: 'dash.i.validados', valor: 842 },
        { rotulo: 'dash.i.emAnalise', valor: 213 },
        { rotulo: 'dash.i.pendentes', valor: 134 },
        { rotulo: 'dash.i.rejeitados', valor: 59 },
      ],
    },
    barras2: { titulo: 'dash.c.vistosDia', valores: [320, 410, 385, 452, 430, 190, 150] },
    ranking: {
      titulo: 'dash.c.precisaoTipo',
      sufixo: '%',
      maximo: 100,
      cor: 'success',
      itens: [
        { rotulo: 'dash.i.laudos', valor: 98.6 },
        { rotulo: 'dash.i.notasFiscais', valor: 97.9 },
        { rotulo: 'dash.i.cadastros', valor: 96.8 },
        { rotulo: 'dash.i.contratos', valor: 95.2 },
      ],
    },
  },

  documentos: {
    kpis: [
      { icone: 'document-text-outline', tom: 'teal', rotulo: 'dash.kpi.totalPeriodo', valor: { n: 1248 }, dica: { v: '+12%', ref: REF }, positiva: true },
      { icone: 'checkmark-circle-outline', tom: 'verde', rotulo: 'dash.i.validados', valor: { n: 842 }, dica: { v: '+9%', ref: REF }, positiva: true },
      { icone: 'hourglass-outline', tom: 'laranja', rotulo: 'dash.i.pendentes', valor: { n: 134 }, dica: { v: '+5%', ref: REF }, positiva: false },
      { icone: 'close-circle-outline', tom: 'vermelho', rotulo: 'dash.i.rejeitados', valor: { n: 59 }, dica: { v: '-14%', ref: REF }, positiva: true },
    ],
    barras1: { titulo: 'dash.c.importadosDia', valores: [158, 192, 177, 214, 203, 94, 70] },
    donut: {
      titulo: 'dash.c.porTipo',
      centro: 'dash.centro.documentos',
      itens: [
        { rotulo: 'dash.i.laudos', valor: 412 },
        { rotulo: 'dash.i.notasFiscais', valor: 318 },
        { rotulo: 'dash.i.cadastros', valor: 256 },
        { rotulo: 'dash.i.contratos', valor: 164 },
        { rotulo: 'dash.i.outros', valor: 98 },
      ],
    },
    barras2: { titulo: 'dash.c.tempoAnalise', sufixo: ' min', valores: [4.8, 4.5, 4.2, 3.9, 4.0, 3.6, 3.4] },
    ranking: {
      titulo: 'dash.c.motivosRejeicao',
      cor: 'danger',
      itens: [
        { rotulo: 'dash.i.assinatura', valor: 21 },
        { rotulo: 'dash.i.ilegivel', valor: 17 },
        { rotulo: 'dash.i.divergentes', valor: 13 },
        { rotulo: 'dash.i.foraPadrao', valor: 8 },
      ],
    },
  },

  atendimentos: {
    kpis: [
      { icone: 'chatbubbles-outline', tom: 'azul', rotulo: 'dash.kpi.abertos', valor: { n: 37 }, dica: { v: '-6', ref: REF }, positiva: true },
      { icone: 'checkmark-circle-outline', tom: 'verde', rotulo: 'dash.kpi.resolvidos', valor: { n: 214 }, dica: { v: '+11%', ref: REF }, positiva: true },
      { icone: 'timer-outline', tom: 'laranja', rotulo: 'dash.kpi.tempoResposta', valor: { n: 12, suf: ' min' }, dica: { v: '-2 min', ref: REF }, positiva: true },
      { icone: 'star-outline', tom: 'teal', rotulo: 'dash.kpi.satisfacao', valor: { n: 4.7, dec: 1, suf: '/5' }, dica: { v: '+0.2', ref: REF }, positiva: true },
    ],
    barras1: { titulo: 'dash.c.atendDia', valores: [37, 44, 41, 52, 46, 18, 13] },
    donut: {
      titulo: 'dash.c.atendCategoria',
      centro: 'dash.centro.atendimentos',
      itens: [
        { rotulo: 'dash.i.duvidas', valor: 94 },
        { rotulo: 'dash.i.falhasValidacao', valor: 70 },
        { rotulo: 'dash.i.acesso', valor: 42 },
        { rotulo: 'menu.integracoes', valor: 28 },
        { rotulo: 'dash.i.outros', valor: 17 },
      ],
    },
    barras2: { titulo: 'dash.c.tempoRespostaDia', sufixo: ' min', valores: [14, 13, 12, 11, 12, 10, 9] },
    ranking: {
      titulo: 'dash.c.atendCanal',
      cor: 'accent',
      itens: [
        { rotulo: 'dash.i.plataforma', valor: 118 },
        { rotulo: 'dash.i.email', valor: 74 },
        { rotulo: 'dash.i.whatsapp', valor: 46 },
        { rotulo: 'dash.i.telefone', valor: 13 },
      ],
    },
  },

  integracoes: {
    kpis: [
      { icone: 'cloud-done-outline', tom: 'verde', rotulo: 'dash.kpi.conectadas', valor: { n: 14, de: 18 }, dica: { v: '+1', ref: REF }, positiva: true },
      { icone: 'sync-outline', tom: 'teal', rotulo: 'dash.kpi.syncHoje', valor: { n: 126 }, dica: { v: '+7%', ref: 'dash.refOntem' }, positiva: true },
      { icone: 'alert-circle-outline', tom: 'vermelho', rotulo: 'dash.kpi.falhasSync', valor: { n: 3 }, dica: { v: '-2', ref: REF }, positiva: true },
      { icone: 'pulse-outline', tom: 'azul', rotulo: 'dash.kpi.disponibilidade', valor: { n: 99.2, dec: 1, suf: '%' }, dica: { v: '+0.3%', ref: REF }, positiva: true },
    ],
    barras1: { titulo: 'dash.c.syncDia', valores: [112, 120, 118, 131, 126, 64, 58] },
    donut: {
      titulo: 'dash.c.syncIntegracao',
      centro: 'dash.centro.sincronizacoes',
      itens: [
        { nome: 'SAP', valor: 38 },
        { nome: 'TOTVS', valor: 31 },
        { nome: 'Microsoft Dynamics 365', valor: 22 },
        { nome: 'Google Drive', valor: 19 },
        { nome: 'Oracle', valor: 16 },
      ],
    },
    barras2: { titulo: 'dash.c.falhasDia', valores: [1, 0, 2, 0, 1, 0, 0] },
    ranking: {
      titulo: 'dash.c.falhasIntegracao',
      cor: 'danger',
      itens: [
        { nome: 'Azure DevOps', valor: 2 },
        { nome: 'Oracle', valor: 1 },
        { nome: 'Gmail', valor: 0 },
        { nome: 'Salesforce', valor: 0 },
      ],
    },
  },
};

const NOTIF_INTERVAL = 8000;
const NOTIF_TICK = 15000;
const NOTIF_MAX = 30;

const NOTIF_KINDS = {
  concluido: { icone: 'checkmark-circle-outline', tom: 'verde' },
  emProcesso: { icone: 'hourglass-outline', tom: 'laranja' },
  erro: { icone: 'close-circle-outline', tom: 'vermelho' },
  sync: { icone: 'sync-outline', tom: 'teal' },
  falha: { icone: 'alert-circle-outline', tom: 'vermelho' },
};

const NOTIF_DOC_PREFIXES = ['Laudo_Medico', 'Exame_Sangue', 'Pedido_Compra', 'Relatorio_Vendas', 'Contrato_Servico', 'Nota_Fiscal'];
const NOTIF_USERS = ['Mayara', 'Luis', 'Felipe', 'Henrique'];
const NOTIF_INTEGRATIONS = ['SAP', 'TOTVS', 'Microsoft Dynamics 365', 'Google Drive', 'Oracle', 'Salesforce'];
const NOTIF_KIND_LIST = Object.keys(NOTIF_KINDS);

const NOTIF_TEXT = {
  pt: {
    titulo: 'Notificações',
    aoVivo: 'Ao vivo',
    marcarLidas: 'Marcar todas como lidas',
    limpar: 'Limpar',
    vazio: 'Nenhuma notificação',
    fechar: 'Fechar',
    agora: 'agora',
    min: 'há {n} min',
    h: 'há {n} h',
    d: 'há {n} d',
    kinds: {
      concluido: { t: 'Documento validado', m: '{s} foi validado por {u}.' },
      emProcesso: { t: 'Documento em análise', m: '{s} está em análise com {u}.' },
      erro: { t: 'Documento rejeitado', m: '{s} foi rejeitado por {u}.' },
      sync: { t: 'Sincronização concluída', m: '{s} sincronizou com sucesso.' },
      falha: { t: 'Falha de sincronização', m: 'A integração {s} não respondeu.' },
    },
  },
  en: {
    titulo: 'Notifications',
    aoVivo: 'Live',
    marcarLidas: 'Mark all as read',
    limpar: 'Clear',
    vazio: 'No notifications',
    fechar: 'Close',
    agora: 'now',
    min: '{n} min ago',
    h: '{n} h ago',
    d: '{n} d ago',
    kinds: {
      concluido: { t: 'Document validated', m: '{s} was validated by {u}.' },
      emProcesso: { t: 'Document under review', m: '{s} is under review by {u}.' },
      erro: { t: 'Document rejected', m: '{s} was rejected by {u}.' },
      sync: { t: 'Sync completed', m: '{s} synced successfully.' },
      falha: { t: 'Sync failure', m: 'The {s} integration did not respond.' },
    },
  },
  es: {
    titulo: 'Notificaciones',
    aoVivo: 'En vivo',
    marcarLidas: 'Marcar todas como leídas',
    limpar: 'Limpiar',
    vazio: 'Sin notificaciones',
    fechar: 'Cerrar',
    agora: 'ahora',
    min: 'hace {n} min',
    h: 'hace {n} h',
    d: 'hace {n} d',
    kinds: {
      concluido: { t: 'Documento validado', m: '{s} fue validado por {u}.' },
      emProcesso: { t: 'Documento en análisis', m: '{s} está en análisis con {u}.' },
      erro: { t: 'Documento rechazado', m: '{s} fue rechazado por {u}.' },
      sync: { t: 'Sincronización completada', m: '{s} se sincronizó con éxito.' },
      falha: { t: 'Fallo de sincronización', m: 'La integración {s} no respondió.' },
    },
  },
};

const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

function criarNotificacao(id, date) {
  const kind = sortear(NOTIF_KIND_LIST);
  const integracao = kind === 'sync' || kind === 'falha';
  const subject = integracao
    ? sortear(NOTIF_INTEGRATIONS)
    : `${sortear(NOTIF_DOC_PREFIXES)}_${1000 + Math.floor(Math.random() * 900)}.pdf`;
  return { id: String(id), kind, subject, user: sortear(NOTIF_USERS), date: date || new Date(), read: false };
}

function notificacoesIniciais() {
  const agora = Date.now();
  return [
    { id: 'seed-1', kind: 'concluido', subject: 'Laudo_Medico_1007.pdf', user: 'Mayara', date: new Date(agora - 2 * 60000), read: false },
    { id: 'seed-2', kind: 'emProcesso', subject: 'Exame_Sangue_1014.pdf', user: 'Luis', date: new Date(agora - 14 * 60000), read: false },
    { id: 'seed-3', kind: 'sync', subject: 'SAP', user: 'Felipe', date: new Date(agora - 65 * 60000), read: true },
  ];
}

function tempoRelativo(date, agora, txt) {
  const seg = Math.max(0, Math.round((agora - date.getTime()) / 1000));
  if (seg < 60) return txt.agora;
  const min = Math.floor(seg / 60);
  if (min < 60) return txt.min.replace('{n}', String(min));
  const horas = Math.floor(min / 60);
  if (horas < 24) return txt.h.replace('{n}', String(horas));
  return txt.d.replace('{n}', String(Math.floor(horas / 24)));
}

function kpisVisaoGeral(k) {
  return [
    { icone: 'document-text-outline', tom: 'verde', rotulo: 'dash.kpi.processados', valor: { n: k.processed }, dica: { v: '+12%', ref: REF }, positiva: true },
    { icone: 'locate-outline', tom: 'teal', rotulo: 'dash.kpi.precisao', valor: { n: k.accuracy, dec: 1, suf: '%' }, dica: { v: '+0.8%', ref: REF }, positiva: true },
    { icone: 'time-outline', tom: 'laranja', rotulo: 'dash.kpi.economizado', valor: { n: k.saved, suf: 'h' }, dica: { v: '+5.2x', ref: 'dash.maisProdutividade' }, positiva: true },
    { icone: 'eye-outline', tom: 'azul', rotulo: 'dash.kpi.emProcessamento', valor: { n: k.inProgress }, dica: { fila: k.queue }, positiva: null },
  ];
}

const cap = (s) => {
  const x = s.replace('.', '');
  return x.charAt(0).toUpperCase() + x.slice(1);
};

const nomeMes = (mes, locale) => cap(new Date(2026, mes, 1).toLocaleDateString(locale, { month: 'short' }));
const nomeDia = (i, locale) => cap(new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' }));

const rotuloItem = (item, t) => (item.nome !== undefined ? item.nome : t(item.rotulo));

function makeTons(c) {
  return {
    verde: { cor: c.success, fundo: c.successBg },
    teal: { cor: c.accent, fundo: c.tealBg },
    laranja: { cor: c.warning, fundo: c.warningBg },
    azul: { cor: c.info, fundo: c.infoBg },
    vermelho: { cor: c.danger, fundo: c.dangerBg },
  };
}

function useLocale() {
  const { language } = usePreferences();
  return LOCALES[language] || 'pt-BR';
}

function formatNumero(n, locale, dec) {
  const opcoes = dec
    ? { minimumFractionDigits: dec, maximumFractionDigits: dec }
    : { maximumFractionDigits: 2 };
  return Number(n).toLocaleString(locale, opcoes);
}

function formatValor(v, locale, t) {
  let out = formatNumero(v.n, locale, v.dec);
  if (v.de) out += ` ${t('dash.de')} ${formatNumero(v.de, locale)}`;
  if (v.suf) out += v.suf;
  return out;
}

function formatDica(d, locale, t) {
  if (d.fila !== undefined) return t('dash.naFila').replace('{n}', String(d.fila));
  const sep = (1.1).toLocaleString(locale).charAt(1);
  return `${d.v.replace('.', sep)} ${t(d.ref)}`;
}

function FilterChip({ label, selected, onPress }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]} accessibilityRole="button">
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function FilterButton({ title, fieldLabel, options, value, defaultValue, onChange, label }) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const activeCount = value !== defaultValue ? 1 : 0;

  function openFilter() {
    setDraft(value);
    setOpen(true);
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  function clear() {
    setDraft(defaultValue);
    onChange(defaultValue);
    setOpen(false);
  }

  return (
    <>
      <Pressable style={styles.filterButton} onPress={openFilter} accessibilityRole="button" accessibilityLabel={label}>
        <Ionicons name="funnel-outline" size={20} color={colors.text} />
        {activeCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeCount}</Text>
          </View>
        )}
      </Pressable>

      {open && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.filterOverlay} onPress={() => setOpen(false)}>
            <Pressable style={styles.filterPanel} onPress={() => {}}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>{title}</Text>
                <Pressable onPress={() => setOpen(false)} accessibilityLabel={t('perfil.fechar')}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </Pressable>
              </View>
              <Text style={styles.filterLabel}>{fieldLabel}</Text>
              <View style={styles.chipsRow}>
                {options.map((o) => (
                  <FilterChip
                    key={String(o.value)}
                    label={t(o.label)}
                    selected={draft === o.value}
                    onPress={() => setDraft(o.value)}
                  />
                ))}
              </View>
              <View style={styles.filterActions}>
                <Pressable style={styles.filterClear} onPress={clear}>
                  <Text style={styles.filterClearText}>{t('dash.limpar')}</Text>
                </Pressable>
                <Pressable style={styles.filterApply} onPress={apply}>
                  <Text style={styles.filterApplyText}>{t('dash.aplicar')}</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

function NotificationItem({ item, agora, txt, onPress }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const kind = NOTIF_KINDS[item.kind];
  const tons = makeTons(colors)[kind.tom];
  const textos = txt.kinds[item.kind];
  const mensagem = textos.m.replace('{s}', item.subject).replace('{u}', item.user);

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ hovered }) => [
        styles.notifItem,
        !item.read && styles.notifItemUnread,
        hovered && styles.rowHover,
      ]}
    >
      <View style={[styles.notifIconWrap, { backgroundColor: tons.fundo }]}>
        <Ionicons name={kind.icone} size={20} color={tons.cor} />
      </View>
      <View style={styles.notifBody}>
        <Text style={styles.notifItemTitle} numberOfLines={1}>{textos.t}</Text>
        <Text style={styles.notifItemMsg} numberOfLines={2}>{mensagem}</Text>
        <Text style={styles.notifTime}>{tempoRelativo(item.date, agora, txt)}</Text>
      </View>
      {!item.read && <View style={styles.notifUnreadDot} />}
    </Pressable>
  );
}

function NotificationsPanel({ visible, onClose, items, agora, onMarkAll, onClear, onItemPress }) {
  const { colors, language } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const txt = NOTIF_TEXT[language] || NOTIF_TEXT.pt;
  const temNaoLidas = items.some((n) => !n.read);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.notifOverlay} onPress={onClose}>
        <Pressable style={styles.notifPanel} onPress={() => {}}>
          <View style={styles.notifHeader}>
            <View style={styles.notifTitleRow}>
              <Text style={styles.notifTitle}>{txt.titulo}</Text>
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>{txt.aoVivo}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} accessibilityLabel={txt.fechar}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.notifActions}>
            <Pressable onPress={onMarkAll} disabled={!temNaoLidas} style={!temNaoLidas && styles.notifActionDisabled}>
              <Text style={styles.notifActionText}>{txt.marcarLidas}</Text>
            </Pressable>
            <Pressable onPress={onClear} disabled={items.length === 0} style={items.length === 0 && styles.notifActionDisabled}>
              <Text style={styles.notifActionText}>{txt.limpar}</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.notifList} showsVerticalScrollIndicator={false}>
            {items.length === 0 ? (
              <Text style={styles.notifEmpty}>{txt.vazio}</Text>
            ) : (
              items.map((n) => (
                <NotificationItem key={n.id} item={n} agora={agora} txt={txt} onPress={onItemPress} />
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function KpiCard({ icone, tom, rotulo, valor, dica, positiva }) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = useLocale();
  const tons = makeTons(colors)[tom];
  const corDica = positiva === null ? colors.text : positiva ? colors.success : colors.danger;
  return (
    <View style={styles.kpiCard}>
      <View style={[styles.kpiIconWrap, { backgroundColor: tons.fundo }]}>
        <Ionicons name={icone} size={26} color={tons.cor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.kpiLabel}>{t(rotulo)}</Text>
        <Text style={styles.kpiValue}>{formatValor(valor, locale, t)}</Text>
        <Text style={[styles.kpiHint, { color: corDica }]}>{formatDica(dica, locale, t)}</Text>
      </View>
    </View>
  );
}

function hexToRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function shade(index, total, claro, escuro) {
  const p = total === 1 ? 1 : index / (total - 1);
  const a = hexToRgb(claro);
  const b = hexToRgb(escuro);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * p)).join(',')})`;
}

function BarChart({ data, sufixo = '' }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = useLocale();
  const fmt = (v) => formatNumero(v, locale);
  const max = Math.max(...data.map((d) => d.valor), 1);

  const bruto = (max * 1.05) / 4;
  const exp = Math.pow(10, Math.floor(Math.log10(bruto)));
  const f = bruto / exp;
  const passo = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp;
  const n = Math.ceil((max * 1.05) / passo);
  const top = n * passo;
  const ticks = Array.from({ length: n + 1 }, (_, i) => Number(((n - i) * passo).toFixed(2)));
  const pct = (i) => `${(i / n) * 100}%`;

  return (
    <View>
      <View style={styles.barsArea}>
        <View style={styles.yAxis}>
          {ticks.map((tick, i) => (
            <Text key={i} style={[styles.yLabel, { top: pct(i) }]}>{fmt(tick)}</Text>
          ))}
        </View>
        <View style={styles.barsPlot}>
          {ticks.map((tick, i) => (
            <View key={i} style={[styles.gridLine, { top: pct(i) }]} />
          ))}
          <View style={styles.barsRow}>
            {data.map((d, i) => (
              <View key={i} style={styles.barColumn}>
                <Text style={styles.barValue}>{`${fmt(d.valor)}${sufixo}`}</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(d.valor / top) * 100}%`,
                      backgroundColor: shade(i, data.length, colors.chartLight, colors.chartDark),
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.xAxis}>
        {data.map((d, i) => (
          <Text key={i} style={styles.xLabel}>{d.rotulo}</Text>
        ))}
      </View>
    </View>
  );
}

function DonutChart({ data, size = 190, stroke = 38, centerValue, centerLabel }) {
  const styles = useThemedStyles(createStyles);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {data.map((d, i) => {
            const length = (d.value / total) * circumference;
            const circle = (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                fill="none"
              />
            );
            offset += length;
            return circle;
          })}
        </G>
      </Svg>
      <View style={styles.donutCenter} pointerEvents="none">
        <Text style={styles.donutCenterValue}>{centerValue}</Text>
        <Text style={styles.donutCenterLabel}>{centerLabel}</Text>
      </View>
    </View>
  );
}

function ListaProgresso({ itens, sufixo = '', maximo, cor }) {
  const { t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = useLocale();
  const teto = maximo || Math.max(...itens.map((i) => i.valor), 1);
  return (
    <View style={styles.rankList}>
      {itens.map((item, i) => (
        <View key={i}>
          <View style={styles.rankTop}>
            <Text style={styles.rankLabel} numberOfLines={1}>{rotuloItem(item, t)}</Text>
            <Text style={styles.rankValue}>{`${formatNumero(item.valor, locale)}${sufixo}`}</Text>
          </View>
          <View style={styles.rankTrack}>
            <View
              style={[
                styles.rankFill,
                { width: `${Math.min((item.valor / teto) * 100, 100)}%`, backgroundColor: cor },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function StatusBadge({ status }) {
  const { t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const variants = {
    concluido: [styles.badgeConclusao, styles.badgeConclusaoText],
    emProcesso: [styles.badgeRevisao, styles.badgeRevisaoText],
    erro: [styles.badgeErro, styles.badgeErroText],
  };
  const [badgeStyle, textStyle] = variants[status] || variants.emProcesso;
  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.badgeText, textStyle]}>{t(`dash.st.${status}`)}</Text>
    </View>
  );
}

function ActivityRow({ activity, onOpen }) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = useLocale();
  const data = `${activity.date.toLocaleDateString(locale)} ${activity.date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
  return (
    <Pressable
      style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
      onPress={() => onOpen && onOpen(activity)}
    >
      <View style={[styles.cell, styles.cellDoc]}>
        <View style={styles.cellDocInner}>
          <Ionicons name="document-text-outline" size={12} color={colors.text} style={styles.fileIcon} />
          <Text style={[styles.cellText, styles.cellDocText]} numberOfLines={1}>{activity.document}</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.cellTipo]}>
        <Text style={styles.cellText}>{t(`dash.atv.${activity.type}`)}</Text>
      </View>
      <View style={[styles.cell, styles.cellStatus]}>
        <StatusBadge status={activity.status} />
      </View>
      <View style={[styles.cell, styles.cellData]}>
        <Text style={styles.cellText}>{data}</Text>
      </View>
      <View style={[styles.cell, styles.cellUser, styles.cellLast]}>
        <Text style={styles.cellText}>{activity.user}</Text>
      </View>
    </Pressable>
  );
}

export default function Dashboard({
  activeMenu = 'dashboard',
  onNavigate,
  activities = RECENT_ACTIVITY,
  onSearch,
  onOpenNotifications,
  onOpenProfile,
  onSeeAllActivities,
  onOpenActivity,
}) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = useLocale();
  const { user } = useUser();

  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [chartRange, setChartRange] = useState(DEFAULT_RANGE);
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notificacoesIniciais);
  const [agora, setAgora] = useState(Date.now());
  const notifCounter = useRef(0);

  useEffect(() => {
    const novas = setInterval(() => {
      notifCounter.current += 1;
      const nova = criarNotificacao(`live-${notifCounter.current}-${Date.now()}`);
      setNotifs((prev) => [nova, ...prev].slice(0, NOTIF_MAX));
      setAgora(Date.now());
    }, NOTIF_INTERVAL);
    const relogio = setInterval(() => setAgora(Date.now()), NOTIF_TICK);
    return () => {
      clearInterval(novas);
      clearInterval(relogio);
    };
  }, []);

  const naoLidas = notifs.filter((n) => !n.read).length;

  function handleOpenNotifications() {
    setAgora(Date.now());
    setNotifOpen(true);
    if (onOpenNotifications) onOpenNotifications();
  }

  function handleMarkAll() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClearNotifs() {
    setNotifs([]);
  }

  function handleNotifPress(id) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const primeiroNome = (user.nome || '').trim().split(/\s+/)[0] || '';

  const dias = useMemo(() => Array.from({ length: 7 }, (_, i) => nomeDia(i, locale)), [locale]);
  const porDia = (valores) => dias.map((rotulo, i) => ({ rotulo, valor: valores[i] }));

  const visaoGeral = abaAtiva === 'visao-geral';
  const dados = DADOS[abaAtiva];
  const kpiValores = KPIS_BY_PERIOD[period];

  const kpis = visaoGeral ? kpisVisaoGeral(kpiValores) : dados.kpis;
  const barras1Dados = dados.barras1.filtroMeses
    ? MONTHLY.slice(-chartRange).map((m) => ({ rotulo: nomeMes(m.mes, locale), valor: m.valor }))
    : porDia(dados.barras1.valores);
  const barras2Dados = porDia(dados.barras2.valores);

  const donutDados = dados.donut.itens.map((item, i) => ({
    label: rotuloItem(item, t),
    value: item.valor,
    color: colors.palette[i % colors.palette.length],
  }));
  const donutTotal = donutDados.reduce((soma, d) => soma + d.value, 0);
  const donutCentro = visaoGeral ? kpiValores.processed : donutTotal;

  function handleNavigate(key) {
    if (onNavigate) onNavigate(key);
  }

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={handleNavigate} />

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{t('dash.ola').replace('{nome}', primeiroNome)}</Text>
            <Text style={styles.subtitle}>{t('dash.resumo')}</Text>
          </View>
          <UserHeader
            onOpenNotifications={handleOpenNotifications}
            onOpenProfile={onOpenProfile}
            notificationCount={naoLidas}
          />
        </View>

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.text} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('dash.pesquisar')}
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => onSearch && onSearch(search)}
              returnKeyType="search"
            />
          </View>
          {visaoGeral ? (
            <View style={styles.toolbarFilter}>
              <FilterButton
                label={t('dash.filtrarPorPeriodo')}
                title={t('dash.filtrarPeriodo')}
                fieldLabel={t('dash.periodo')}
                options={PERIODS}
                value={period}
                defaultValue={DEFAULT_PERIOD}
                onChange={setPeriod}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.tabs}>
          {ABAS.map((aba) => {
            const ativa = aba.id === abaAtiva;
            return (
              <Pressable
                key={aba.id}
                onPress={() => setAbaAtiva(aba.id)}
                accessibilityRole="button"
                style={({ hovered }) => [
                  styles.tab,
                  hovered && !ativa && styles.tabHover,
                  ativa && styles.tabActive,
                ]}
              >
                <Ionicons
                  name={aba.icone}
                  size={16}
                  color={ativa ? colors.onPrimary : colors.text}
                  style={styles.tabIcon}
                />
                <Text style={[styles.tabText, ativa && styles.tabTextActive]}>{t(aba.rotulo)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.kpiRow}>
          {kpis.map((kpi) => (
            <KpiCard key={kpi.rotulo} {...kpi} />
          ))}
        </View>

        <View style={styles.chartsRow}>
          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <Text style={styles.cardTitle}>{t(dados.barras1.titulo)}</Text>
              {dados.barras1.filtroMeses ? (
                <FilterButton
                  label={t('dash.filtrarGraficoMeses')}
                  title={t('dash.filtrarGrafico')}
                  fieldLabel={t('dash.meses')}
                  options={CHART_RANGES}
                  value={chartRange}
                  defaultValue={DEFAULT_RANGE}
                  onChange={setChartRange}
                />
              ) : null}
            </View>
            <BarChart data={barras1Dados} sufixo={dados.barras1.sufixo} />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <Text style={styles.cardTitle}>{t(dados.donut.titulo)}</Text>
            </View>
            <View style={styles.donutBody}>
              <DonutChart
                data={donutDados}
                centerValue={donutCentro.toLocaleString(locale)}
                centerLabel={t(dados.donut.centro)}
              />
              <View style={styles.legend}>
                {donutDados.map((d, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                    <Text style={styles.legendLabel}>{d.label}</Text>
                    <Text style={styles.legendValue}>{Math.round((d.value / donutTotal) * 100)}%</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartsRow}>
          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <Text style={styles.cardTitle}>{t(dados.barras2.titulo)}</Text>
            </View>
            <BarChart data={barras2Dados} sufixo={dados.barras2.sufixo} />
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartCardHeader}>
              <Text style={styles.cardTitle}>{t(dados.ranking.titulo)}</Text>
            </View>
            <ListaProgresso
              itens={dados.ranking.itens}
              sufixo={dados.ranking.sufixo}
              maximo={dados.ranking.maximo}
              cor={colors[dados.ranking.cor]}
            />
          </View>
        </View>

        {visaoGeral ? (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{t('dash.atividadeRecente')}</Text>
              <Pressable onPress={onSeeAllActivities}>
                <Text style={styles.seeAll}>{t('dash.verTodos')}</Text>
              </Pressable>
            </View>

            <View style={styles.tableHeader}>
              <View style={styles.cellDoc}>
                <Text style={[styles.headerText, styles.headerTextSmall]}>{t('dash.col.documento')}</Text>
              </View>
              <View style={styles.cellTipo}>
                <Text style={styles.headerText}>{t('dash.col.tipo')}</Text>
              </View>
              <View style={styles.cellStatus}>
                <Text style={styles.headerText}>{t('dash.col.status')}</Text>
              </View>
              <View style={styles.cellData}>
                <Text style={styles.headerText}>{t('dash.col.data')}</Text>
              </View>
              <View style={styles.cellUser}>
                <Text style={styles.headerText}>{t('dash.col.usuario')}</Text>
              </View>
            </View>

            {activities.length === 0 ? (
              <Text style={styles.emptyText}>{t('dash.nenhumaAtividade')}</Text>
            ) : (
              activities.map((a) => (
                <ActivityRow key={a.id} activity={a} onOpen={onOpenActivity} />
              ))
            )}
          </View>
        ) : null}
      </ScrollView>

      <NotificationsPanel
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={notifs}
        agora={agora}
        onMarkAll={handleMarkAll}
        onClear={handleClearNotifs}
        onItemPress={handleNotifPress}
      />
    </View>
  );
}