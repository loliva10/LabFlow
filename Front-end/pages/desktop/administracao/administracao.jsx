import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Dimensions, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../login/LoginStyle';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import { createStyles } from './administracaoStyle';

const Swal = Platform.OS === 'web' ? require('sweetalert2').default : null;

const PAGE_SIZE = 16;
const STATUS_OPCOES = ['Ativo', 'Inativo'];
const EMPTY_FILTERS = { status: [], perfis: [] };
const EMPTY_LIST = [];
const SWAL_STYLE_ID = 'swal-custom-font';

function ensureSwalFont() {
  if (typeof document === 'undefined' || document.getElementById(SWAL_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SWAL_STYLE_ID;
  style.textContent = `
    .swal2-popup,
    .swal2-title,
    .swal2-html-container,
    .swal2-styled {
      font-family: '${fonts.regular}', sans-serif !important;
    }
    .swal2-title {
      font-weight: 400 !important;
    }
    .swal2-styled {
      font-weight: 400 !important;
    }
  `;
  document.head.appendChild(style);
}

function getPageNumbers(current, total) {
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

function FilterChip({ label, selected, onPress }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]} accessibilityRole="button">
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function UserRow({ usuario, onActions }) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable style={({ hovered }) => [styles.row, hovered && styles.rowHover]}>
      <View style={[styles.cell, styles.cellNome]}>
        <View style={styles.cellNomeInner}>
          <View style={[styles.statusDot, usuario.ativo ? styles.dotActive : styles.dotInactive]} />
          <Text style={[styles.cellText, styles.cellNomeText]} numberOfLines={1}>{usuario.nome}</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.cellEmail]}>
        <Text style={styles.cellText} numberOfLines={1}>{usuario.email}</Text>
      </View>
      <View style={[styles.cell, styles.cellPerfil]}>
        <Text style={styles.cellText} numberOfLines={1}>{usuario.perfil}</Text>
      </View>
      <View style={[styles.cell, styles.cellCargo]}>
        <Text style={styles.cellText} numberOfLines={1}>{usuario.cargo}</Text>
      </View>
      <View style={[styles.cell, styles.cellAcoes, styles.cellLast]}>
        <Pressable onPress={(e) => onActions(usuario, e.nativeEvent)} accessibilityLabel="Ações do usuário">
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function Administracao({
  activeMenu = 'administracao',
  onNavigate,
  usuarios = EMPTY_LIST,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) {
  const { colors } = usePreferences();
  const styles = useThemedStyles(createStyles);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  const perfis = useMemo(() => [...new Set(usuarios.map((u) => u.perfil))], [usuarios]);

  const activeFiltersCount = filters.status.length + filters.perfis.length;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return usuarios.filter((u) => {
      if (filters.status.length && !filters.status.includes(u.ativo ? 'Ativo' : 'Inativo')) return false;
      if (filters.perfis.length && !filters.perfis.includes(u.perfil)) return false;
      if (!term) return true;
      return (
        u.nome.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.perfil.toLowerCase().includes(term) ||
        u.cargo.toLowerCase().includes(term)
      );
    });
  }, [usuarios, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

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

  function goToPage(number) {
    if (number < 1 || number > totalPages) return;
    setPage(number);
  }

  function openActions(usuario, nativeEvent) {
    const { width } = Dimensions.get('window');
    const menuWidth = 200;
    const pageX = nativeEvent?.pageX ?? width / 2;
    const pageY = nativeEvent?.pageY ?? 200;
    const left = Math.max(8, Math.min(pageX - menuWidth, width - menuWidth - 8));
    setActionMenu({ usuario, top: pageY + 12, left });
  }

  function closeActions() {
    setActionMenu(null);
  }

  function handleEdit() {
    const usuario = actionMenu?.usuario;
    closeActions();
    if (usuario && onEditUser) onEditUser(usuario);
  }

  function handleDelete() {
    const usuario = actionMenu?.usuario;
    closeActions();
    if (!usuario) return;

    if (Swal) {
      ensureSwalFont();
      Swal.fire({
        title: 'Deseja excluir?',
        icon: 'warning',
        iconColor: colors.text,
        background: colors.card,
        color: colors.text,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor: colors.cta,
        cancelButtonColor: colors.primary,
      }).then((result) => {
        if (result.isConfirmed && onDeleteUser) onDeleteUser(usuario.id);
      });
      return;
    }

    Alert.alert('Deseja excluir?', '', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', style: 'destructive', onPress: () => onDeleteUser && onDeleteUser(usuario.id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />

      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Ionicons name="settings-outline" size={32} color={colors.text} style={styles.titleIcon} />
          <Text style={styles.title}>Administração</Text>
        </View>
        <Text style={styles.subtitle}>Gerencie usuários, permissões e configurações do sistema</Text>

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.text} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar usuários..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Pressable style={styles.filterButton} onPress={openFilter} accessibilityRole="button" accessibilityLabel="Filtrar">
            <Ionicons name="funnel-outline" size={20} color={colors.text} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={onAddUser}
            accessibilityRole="button"
            accessibilityLabel="Adicionar usuário"
            style={({ hovered }) => [styles.addButton, hovered && styles.addButtonHover]}
          >
            <Ionicons name="add" size={24} color={colors.onPrimary} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.tableHeader}>
            <View style={styles.cellNome}>
              <Text style={styles.headerText}>Nome</Text>
            </View>
            <View style={styles.cellEmail}>
              <Text style={styles.headerText}>Email</Text>
            </View>
            <View style={styles.cellPerfil}>
              <Text style={styles.headerText}>Perfil</Text>
            </View>
            <View style={styles.cellCargo}>
              <Text style={styles.headerText}>Cargo</Text>
            </View>
            <View style={styles.cellAcoes}>
              <Text style={styles.headerText}>Ações</Text>
            </View>
          </View>

          {rows.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          ) : (
            rows.map((usuario) => <UserRow key={usuario.id} usuario={usuario} onActions={openActions} />)
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Mostrando {rows.length} de {filtered.length} usuários</Text>
            <View style={styles.pagination}>
              <Pressable
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                accessibilityLabel="Página anterior"
              >
                <Ionicons name="caret-back" size={11} color={colors.text} />
              </Pressable>
              {pageNumbers.map((n) => (
                <Pressable key={n} onPress={() => goToPage(n)} style={[styles.pageButton, n === currentPage && styles.pageButtonActive]}>
                  <Text style={[styles.pageText, n === currentPage && styles.pageTextActive]}>{n}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                accessibilityLabel="Próxima página"
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
              <Text style={styles.filterTitle}>Filtrar usuários</Text>
              <Pressable onPress={() => setFilterOpen(false)} accessibilityLabel="Fechar">
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.chipsRow}>
              {STATUS_OPCOES.map((s) => (
                <FilterChip key={s} label={s} selected={draft.status.includes(s)} onPress={() => toggleDraft('status', s)} />
              ))}
            </View>
            <Text style={styles.filterLabel}>Perfil</Text>
            <View style={styles.chipsRow}>
              {perfis.map((p) => (
                <FilterChip key={p} label={p} selected={draft.perfis.includes(p)} onPress={() => toggleDraft('perfis', p)} />
              ))}
            </View>
            <View style={styles.filterActions}>
              <Pressable style={styles.filterClear} onPress={clearFilters}>
                <Text style={styles.filterClearText}>Limpar</Text>
              </Pressable>
              <Pressable style={styles.filterApply} onPress={applyFilters}>
                <Text style={styles.filterApplyText}>Aplicar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={!!actionMenu} transparent animationType="fade" onRequestClose={closeActions}>
        <Pressable style={styles.menuOverlay} onPress={closeActions}>
          {actionMenu && (
            <View style={[styles.actionMenu, { top: actionMenu.top, left: actionMenu.left }]}>
              <Pressable onPress={handleEdit} style={({ hovered }) => [styles.actionItem, hovered && styles.rowHover]}>
                <Ionicons name="create-outline" size={16} color={colors.text} />
                <Text style={styles.actionText}>Editar usuário</Text>
              </Pressable>
              <View style={styles.actionDivider} />
              <Pressable onPress={handleDelete} style={({ hovered }) => [styles.actionItem, hovered && styles.rowHover]}>
                <Ionicons name="trash-outline" size={16} color={colors.cta} />
                <Text style={[styles.actionText, styles.actionTextDanger]}>Excluir</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}