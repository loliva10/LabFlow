import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import { createStyles } from './centralDeDocumentosStyle';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';

const LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

const PAGE_SIZE = 16;
const TOTAL_DOCUMENTS = 48;

const BASE_DOCUMENTS = [
  { prefixo: 'Nota_Fiscal', tipo: 'Nota Fiscal', status: 'Revisão', confianca: 95, data: '22/10/2026' },
  { prefixo: 'Laudo_Medico', tipo: 'Laudo', status: 'Conclusão', confianca: 100, data: '15/10/2026' },
  { prefixo: 'Contrato_Servicos', tipo: 'Contrato', status: 'Erro', confianca: 88, data: '10/07/2026' },
  { prefixo: 'Pedido_Compra', tipo: 'Pedido', status: 'Revisão', confianca: 97, data: '07/03/2026' },
  { prefixo: 'Exame_Sangue', tipo: 'Exame', status: 'Revisão', confianca: 91, data: '13/10/2026' },
  { prefixo: 'Receita_Medica', tipo: 'Receita', status: 'Conclusão', confianca: 100, data: '22/09/2026' },
  { prefixo: 'Boleto_Energia', tipo: 'Boleto', status: 'Erro', confianca: 66, data: '01/10/2026' },
  { prefixo: 'Relatorio_Vendas', tipo: 'Relatório', status: 'Conclusão', confianca: 100, data: '21/08/2026' },
  { prefixo: 'Comprovante_Pagamento', tipo: 'Comprovante', status: 'Revisão', confianca: 99, data: '10/10/2026' },
  { prefixo: 'Apolice_Seguro', tipo: 'Apólice', status: 'Conclusão', confianca: 100, data: '22/10/2026' },
  { prefixo: 'Proposta_Comercial', tipo: 'Proposta', status: 'Revisão', confianca: 75, data: '04/04/2026' },
  { prefixo: 'Certidao_Negativa', tipo: 'Certidão', status: 'Erro', confianca: 42, data: '22/10/2026' },
  { prefixo: 'Recibo_Aluguel', tipo: 'Recibo', status: 'Revisão', confianca: 89, data: '05/03/2026' },
  { prefixo: 'Ficha_Cadastral', tipo: 'Ficha', status: 'Erro', confianca: 58, data: '22/10/2026' },
];

const TIPO_KEYS = {
  'Nota Fiscal': 'notaFiscal',
  Laudo: 'laudo',
  Contrato: 'contrato',
  Pedido: 'pedido',
  Exame: 'exame',
  Receita: 'receita',
  Boleto: 'boleto',
  'Relatório': 'relatorio',
  Comprovante: 'comprovante',
  'Apólice': 'apolice',
  Proposta: 'proposta',
  'Certidão': 'certidao',
  Recibo: 'recibo',
  Ficha: 'ficha',
};

const STATUS_KEYS = {
  'Revisão': 'revisao',
  'Conclusão': 'conclusao',
  Erro: 'erro',
};

const DOCUMENTS = Array.from({ length: TOTAL_DOCUMENTS }, (_, i) => {
  const base = BASE_DOCUMENTS[i % BASE_DOCUMENTS.length];
  return {
    id: i + 1,
    nome: `${base.prefixo}_${1000 + (i + 1) * 7}.pdf`,
    tipo: base.tipo,
    status: base.status,
    confianca: base.confianca,
    data: base.data,
  };
});

const TIPOS = [...new Set(BASE_DOCUMENTS.map((d) => d.tipo)), 'Outro'];
const STATUS = ['Revisão', 'Conclusão', 'Erro'];
const CONFIANCA_OPCOES = [0, 70, 90, 100];
const EMPTY_FILTERS = { tipos: [], status: [], confiancaMin: 0 };
const NO_OVERRIDES = {};
const NO_IMPORTED = [];

function rotulo(prefixo, mapa, valor, t) {
  if (prefixo === 'doc.t' && valor === 'Outro') return t('imp.t.outro');
  const key = mapa[valor];
  return key ? t(`${prefixo}.${key}`) : valor;
}

function formatarData(texto, locale) {
  const partes = String(texto).split('/').map(Number);
  if (partes.length !== 3 || partes.some(Number.isNaN)) return texto;
  const [d, m, y] = partes;
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

function StatusBadge({ status }) {
  const { t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const variants = {
    'Revisão': [styles.badgeRevisao, styles.badgeRevisaoText],
    'Conclusão': [styles.badgeConclusao, styles.badgeConclusaoText],
    Erro: [styles.badgeErro, styles.badgeErroText],
  };
  const [badgeStyle, textStyle] = variants[status] || variants['Revisão'];
  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.badgeText, textStyle]}>{rotulo('doc.s', STATUS_KEYS, status, t)}</Text>
    </View>
  );
}

function ConfidenceRing({ value, size = 15, stroke = 2.5 }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - pct / 100);
  const center = size / 2;
  return (
    <Svg width={size} height={size} style={styles.ring}>
      <Circle cx={center} cy={center} r={radius} stroke={colors.divider} strokeWidth={stroke} fill="none" />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={colors.accent}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation={-90}
        origin={`${center}, ${center}`}
      />
    </Svg>
  );
}

function DocumentRow({ doc, onActions }) {
  const { colors, t, language } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = LOCALES[language] || 'pt-BR';
  return (
    <Pressable style={({ hovered }) => [styles.row, hovered && styles.rowHover]}>
      <View style={[styles.cell, styles.cellDoc]}>
        <View style={styles.cellDocInner}>
          <Ionicons name="document-text-outline" size={12} color={colors.text} style={styles.fileIcon} />
          <Text style={[styles.cellText, styles.cellDocText]} numberOfLines={1}>{doc.nome}</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.cellTipo]}>
        <Text style={styles.cellText}>{rotulo('doc.t', TIPO_KEYS, doc.tipo, t)}</Text>
      </View>
      <View style={[styles.cell, styles.cellStatus]}>
        <StatusBadge status={doc.status} />
      </View>
      <View style={[styles.cell, styles.cellConfianca]}>
        <View style={styles.confidenceRow}>
          <ConfidenceRing value={doc.confianca} />
          <Text style={styles.cellText}>{doc.confianca}%</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.cellData]}>
        <Text style={styles.cellText}>{formatarData(doc.data, locale)}</Text>
      </View>
      <View style={[styles.cell, styles.cellAcoes, styles.cellLast]}>
        <Pressable onPress={(e) => onActions(doc, e.nativeEvent)} accessibilityLabel={t('doc.col.acoes')}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function FilterChip({ label, selected, onPress }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]} accessibilityRole="button">
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function CentralDeDocumentos({
  activeMenu = 'documentos',
  onNavigate,
  onAddDocument,
  onOpenValidation,
  onOpenAnalysis,
  overrides = NO_OVERRIDES,
  documentosImportados = NO_IMPORTED,
}) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  const activeFiltersCount = filters.tipos.length + filters.status.length + (filters.confiancaMin > 0 ? 1 : 0);

  const totalImportados = documentosImportados.length;
  useEffect(() => {
    if (totalImportados === 0) return;
    setSearch('');
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, [totalImportados]);

  const documents = useMemo(
    () =>
      [...documentosImportados, ...DOCUMENTS].map((d) =>
        overrides[d.id] ? { ...d, ...overrides[d.id] } : d
      ),
    [overrides, documentosImportados]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((d) => {
      if (term) {
        const tipoLabel = rotulo('doc.t', TIPO_KEYS, d.tipo, t).toLowerCase();
        const statusLabel = rotulo('doc.s', STATUS_KEYS, d.status, t).toLowerCase();
        if (!(d.nome.toLowerCase().includes(term) || tipoLabel.includes(term) || statusLabel.includes(term))) return false;
      }
      if (filters.tipos.length && !filters.tipos.includes(d.tipo)) return false;
      if (filters.status.length && !filters.status.includes(d.status)) return false;
      if (d.confianca < filters.confiancaMin) return false;
      return true;
    });
  }, [search, filters, documents, t]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleNavigate(key) {
    if (onNavigate) onNavigate(key);
  }

  function handleSearch(text) {
    setSearch(text);
    setPage(1);
  }

  function openFilter() {
    setDraft(filters);
    setFilterOpen(true);
  }

  function toggleDraft(field, value) {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
  }

  function applyFilters() {
    setFilters(draft);
    setPage(1);
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    setFilterOpen(false);
  }

  function openActions(doc, nativeEvent) {
    const { width } = Dimensions.get('window');
    const menuWidth = 200;
    const pageX = nativeEvent?.pageX ?? width / 2;
    const pageY = nativeEvent?.pageY ?? 200;
    const left = Math.max(8, Math.min(pageX - menuWidth, width - menuWidth - 8));
    setActionMenu({ doc, top: pageY + 12, left });
  }

  function closeActions() {
    setActionMenu(null);
  }

  function handleValidation() {
    const doc = actionMenu?.doc;
    closeActions();
    if (onOpenValidation) onOpenValidation(doc);
  }

  function handleAnalysis() {
    const doc = actionMenu?.doc;
    closeActions();
    if (onOpenAnalysis) onOpenAnalysis(doc);
  }

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={handleNavigate} />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Ionicons name="folder-open-outline" size={32} color={colors.text} style={styles.titleIcon} />
          <Text style={styles.title}>{t('doc.titulo')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('doc.subtitulo')}</Text>

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.text} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('doc.pesquisar')}
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={handleSearch}
            />
          </View>

          <Pressable style={styles.filterButton} onPress={openFilter} accessibilityRole="button" accessibilityLabel={t('doc.filtrar')}>
            <Ionicons name="funnel-outline" size={20} color={colors.text} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={onAddDocument}
            accessibilityRole="button"
            accessibilityLabel={t('doc.adicionar')}
            style={({ hovered }) => [styles.addButton, hovered && styles.addButtonHover]}
          >
            <Ionicons name="add" size={24} color={colors.onPrimary} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.tableHeader}>
            <View style={styles.cellDoc}>
              <Text style={[styles.headerText, styles.headerTextSmall]}>{t('doc.col.documento')}</Text>
            </View>
            <View style={styles.cellTipo}>
              <Text style={styles.headerText}>{t('doc.col.tipo')}</Text>
            </View>
            <View style={styles.cellStatus}>
              <Text style={styles.headerText}>{t('doc.col.status')}</Text>
            </View>
            <View style={styles.cellConfianca}>
              <Text style={styles.headerText}>{t('doc.col.confianca')}</Text>
            </View>
            <View style={styles.cellData}>
              <Text style={styles.headerText}>{t('doc.col.data')}</Text>
            </View>
            <View style={styles.cellAcoes}>
              <Text style={styles.headerText}>{t('doc.col.acoes')}</Text>
            </View>
          </View>

          {visible.length === 0 ? (
            <Text style={styles.emptyText}>{t('doc.vazio')}</Text>
          ) : (
            visible.map((doc) => <DocumentRow key={doc.id} doc={doc} onActions={openActions} />)
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('doc.mostrando').replace('{a}', String(visible.length)).replace('{b}', String(filtered.length))}
            </Text>
            <View style={styles.pagination}>
              <Pressable
                onPress={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                accessibilityLabel={t('doc.anterior')}
              >
                <Ionicons name="caret-back" size={11} color={colors.text} />
              </Pressable>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Pressable key={n} onPress={() => setPage(n)} style={[styles.pageButton, n === currentPage && styles.pageButtonActive]}>
                  <Text style={[styles.pageText, n === currentPage && styles.pageTextActive]}>{n}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                accessibilityLabel={t('doc.proxima')}
              >
                <Ionicons name="caret-forward" size={11} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.filterOverlay} onPress={() => setFilterOpen(false)}>
          <Pressable style={styles.filterPanel} onPress={() => {}}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>{t('doc.filtrarTitulo')}</Text>
              <Pressable onPress={() => setFilterOpen(false)} accessibilityLabel={t('perfil.fechar')}>
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.filterLabel}>{t('doc.fTipo')}</Text>
            <View style={styles.chipsRow}>
              {TIPOS.map((tp) => (
                <FilterChip
                  key={tp}
                  label={rotulo('doc.t', TIPO_KEYS, tp, t)}
                  selected={draft.tipos.includes(tp)}
                  onPress={() => toggleDraft('tipos', tp)}
                />
              ))}
            </View>

            <Text style={styles.filterLabel}>{t('doc.fStatus')}</Text>
            <View style={styles.chipsRow}>
              {STATUS.map((s) => (
                <FilterChip
                  key={s}
                  label={rotulo('doc.s', STATUS_KEYS, s, t)}
                  selected={draft.status.includes(s)}
                  onPress={() => toggleDraft('status', s)}
                />
              ))}
            </View>

            <Text style={styles.filterLabel}>{t('doc.fConfianca')}</Text>
            <View style={styles.chipsRow}>
              {CONFIANCA_OPCOES.map((v) => (
                <FilterChip
                  key={v}
                  label={v === 0 ? t('doc.todas') : v === 100 ? '100%' : `${v}%+`}
                  selected={draft.confiancaMin === v}
                  onPress={() => setDraft((prev) => ({ ...prev, confiancaMin: v }))}
                />
              ))}
            </View>

            <View style={styles.filterActions}>
              <Pressable style={styles.filterClear} onPress={clearFilters}>
                <Text style={styles.filterClearText}>{t('dash.limpar')}</Text>
              </Pressable>
              <Pressable style={styles.filterApply} onPress={applyFilters}>
                <Text style={styles.filterApplyText}>{t('dash.aplicar')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={!!actionMenu} transparent animationType="fade" onRequestClose={closeActions}>
        <Pressable style={styles.menuOverlay} onPress={closeActions}>
          {actionMenu && (
            <View style={[styles.actionMenu, { top: actionMenu.top, left: actionMenu.left }]}>
              <Pressable onPress={handleValidation} style={({ hovered }) => [styles.actionItem, hovered && styles.rowHover]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.text} />
                <Text style={styles.actionText}>{t('doc.menuValidacao')}</Text>
              </Pressable>
              <View style={styles.actionDivider} />
              <Pressable onPress={handleAnalysis} style={({ hovered }) => [styles.actionItem, hovered && styles.rowHover]}>
                <Ionicons name="analytics-outline" size={16} color={colors.text} />
                <Text style={styles.actionText}>{t('doc.menuAnalise')}</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}