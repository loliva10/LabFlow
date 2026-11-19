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
    conteudo: {
      flex: 1,
    },
    conteudoInterno: {
      paddingHorizontal: 26,
      paddingTop: 18,
      paddingBottom: 32,
    },
    cabecalho: {},
    tituloLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    titulo: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 26,
      lineHeight: 36,
      color: colors.text,
    },
    subtitulo: {
      fontFamily: 'Poppins_300Light',
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
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

    grade: {
      width: '100%',
    },
    linhaCards: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 20,
    },
    cardVazio: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      padding: 16,
    },
    card: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      minHeight: 200,
      backgroundColor: colors.card,
      borderRadius: 6,
      padding: 16,
    },
    cardTopo: {
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    logoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    nomeIntegracao: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 20,
      color: colors.text,
    },
    selo: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    seloConectado: {
      backgroundColor: colors.successBg,
    },
    seloDesconectado: {
      backgroundColor: colors.divider,
    },
    seloPonto: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    seloPontoConectado: {
      backgroundColor: colors.success,
    },
    seloPontoDesconectado: {
      backgroundColor: colors.textMuted,
    },
    seloTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 11,
    },
    seloTextoConectado: {
      color: colors.success,
    },
    seloTextoDesconectado: {
      color: colors.textMuted,
    },
    linhaInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 12,
    },
    textoInfo: {
      minWidth: 0,
      fontFamily: 'Poppins_400Regular',
      flex: 1,
      fontSize: 13,
      color: colors.text,
    },
    rotuloSync: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      color: colors.text,
    },
    dataSync: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      color: colors.text,
      marginTop: 2,
    },
    vazio: {
      alignItems: 'center',
      paddingTop: 60,
      gap: 8,
    },
    textoVazio: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
      color: colors.textMuted,
    },
  });