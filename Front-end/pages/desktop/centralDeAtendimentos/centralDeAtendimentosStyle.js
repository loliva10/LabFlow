import { Platform, StyleSheet } from 'react-native';
import { fonts } from '../login/LoginStyle';

const web = (style) => Platform.select({ web: style, default: {} });

export const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.bg,
    },
    main: {
      flex: 1,
      backgroundColor: colors.bg,
      ...web({ scrollbarWidth: 'none' }),
    },
    mainContent: {
      paddingHorizontal: 26,
      paddingTop: 18,
      paddingBottom: 32,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleIcon: {
      marginRight: 8,
    },
    title: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 26,
      lineHeight: 36,
    },
    subtitle: {
      color: colors.text,
      fontFamily: fonts.light,
      fontSize: 15,
      lineHeight: 22,
      marginLeft: 6,
    },

    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 32,
    },
    searchBox: {
      flex: 1,
      maxWidth: 315,
      height: 35,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      backgroundColor: colors.inputBg,
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 6,
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.text,
      ...web({ outlineStyle: 'none' }),
    },
    filterButton: {
      width: 42,
      height: 35,
      marginLeft: 10,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...web({ cursor: 'pointer' }),
    },
    filterBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    filterBadgeText: {
      color: colors.onPrimary,
      fontFamily: fonts.regular,
      fontSize: 9,
    },
    addButton: {
      width: 43,
      height: 35,
      marginLeft: 'auto',
      borderRadius: 3,
      backgroundColor: colors.cta,
      alignItems: 'center',
      justifyContent: 'center',
      ...web({ cursor: 'pointer' }),
    },
    addButtonHover: {
      backgroundColor: colors.ctaHover,
    },

    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      height: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    headerText: {
      color: colors.onPrimary,
      fontFamily: fonts.regular,
      fontSize: 14,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      height: 29,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    rowHover: {
      backgroundColor: colors.hover,
    },
    cell: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: colors.divider,
    },
    cellLast: {
      borderRightWidth: 0,
    },
    cellText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 11,
    },

    cellProtocolo: {
      flex: 1.2,
    },
    cellTipo: {
      flex: 1,
    },
    cellPrioridade: {
      flex: 1.1,
    },
    cellCliente: {
      flex: 1.3,
    },
    cellData: {
      flex: 1,
    },
    cellAcoes: {
      flex: 0.9,
    },

    badge: {
      minWidth: 54,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: fonts.regular,
      fontSize: 9,
      lineHeight: 12,
    },
    badgeAlta: { backgroundColor: colors.dangerBg },
    badgeAltaText: { color: colors.danger },
    badgeMedia: { backgroundColor: colors.warningBg },
    badgeMediaText: { color: colors.warning },
    badgeBaixa: { backgroundColor: colors.successBg },
    badgeBaixaText: { color: colors.success },

    emptyText: {
      textAlign: 'center',
      paddingVertical: 24,
      color: colors.text,
      fontFamily: fonts.light,
      fontSize: 13,
    },

    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 26,
      paddingVertical: 20,
    },
    footerText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pageButton: {
      minWidth: 19,
      height: 19,
      marginLeft: 2,
      paddingHorizontal: 2,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 2,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...web({ cursor: 'pointer' }),
    },
    pageButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    pageButtonDisabled: {
      opacity: 0.4,
    },
    pageEllipsis: {
      minWidth: 19,
      height: 19,
      marginLeft: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 11,
    },
    pageTextActive: {
      color: colors.onPrimary,
    },

    filterOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterPanel: {
      width: 360,
      maxWidth: '92%',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 6,
      padding: 20,
    },
    filterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    filterTitle: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 18,
    },
    filterLabel: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 13,
      marginTop: 14,
      marginBottom: 8,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 6,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 14,
      backgroundColor: colors.card,
      ...web({ cursor: 'pointer' }),
    },
    chipSelected: {
      backgroundColor: colors.accent,
    },
    chipText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    chipTextSelected: {
      color: colors.onPrimary,
    },
    filterActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
    filterClear: {
      paddingHorizontal: 16,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 4,
      marginRight: 8,
      ...web({ cursor: 'pointer' }),
    },
    filterClearText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 13,
    },
    filterApply: {
      paddingHorizontal: 20,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      backgroundColor: colors.cta,
      ...web({ cursor: 'pointer' }),
    },
    filterApplyText: {
      color: colors.onPrimary,
      fontFamily: fonts.regular,
      fontSize: 13,
    },

    menuOverlay: {
      flex: 1,
    },
    actionMenu: {
      position: 'absolute',
      width: 200,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      paddingVertical: 4,
      elevation: 6,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      height: 36,
      ...web({ cursor: 'pointer' }),
    },
    actionText: {
      marginLeft: 8,
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 12,
    },
  });