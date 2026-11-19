import { Platform, StyleSheet } from 'react-native';
import { colors as loginColors, fonts } from '../login/LoginStyle';

const web = (style) => Platform.select({ web: style, default: {} });

export function createStyles(colors) {
  const isDark = colors.statusBar === 'light';
  const vermelho = isDark ? '#8E2B2B' : '#460303';
  const bordaCampo = isDark ? colors.inputBorder : loginColors.primaryLight;
  const bordaFoco = isDark ? colors.primary : loginColors.primary;

  return StyleSheet.create({
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
    botaoVoltar: {
      width: 36,
      height: 28,
      backgroundColor: colors.primary,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      ...web({ cursor: 'pointer' }),
    },
    botaoVoltarHover: {
      backgroundColor: colors.accent,
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
    columns: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 20,
      flexWrap: 'wrap',
      marginTop: 20,
    },
    mainColumn: {
      flex: 1,
      minWidth: 420,
      gap: 20,
    },
    sideColumn: {
      width: 340,
      gap: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      padding: 20,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
    },
    cardTitleIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tealBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontFamily: fonts.medium,
      fontSize: 17,
      color: colors.text,
    },
    field: {
      marginBottom: 16,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    label: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.text,
    },
    optional: {
      fontFamily: fonts.light,
      fontSize: 12,
      color: colors.textMuted,
    },
    input: {
      height: 42,
      borderWidth: 1,
      borderColor: bordaCampo,
      borderRadius: 3,
      paddingHorizontal: 12,
      fontFamily: fonts.light,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.inputBg,
      ...web({ outlineStyle: 'none' }),
    },
    inputFocused: {
      borderColor: bordaFoco,
      borderWidth: 2,
      paddingHorizontal: 11,
    },
    inputError: {
      borderColor: colors.danger,
    },
    textarea: {
      height: undefined,
      minHeight: 130,
      paddingVertical: 10,
      textAlignVertical: 'top',
    },
    errorText: {
      color: colors.danger,
      fontFamily: fonts.regular,
      fontSize: 12,
      lineHeight: 14,
      marginTop: 2,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 36,
      paddingHorizontal: 14,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBg,
      ...web({ cursor: 'pointer' }),
    },
    chipHover: {
      backgroundColor: colors.hover,
    },
    chipActive: {
      backgroundColor: vermelho,
      borderColor: vermelho,
    },
    chipText: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.text,
    },
    chipTextActive: {
      color: colors.onPrimary,
    },
    message: {
      fontFamily: fonts.regular,
      fontSize: 13,
      marginBottom: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 3,
    },
    messageSuccess: {
      color: colors.success,
      backgroundColor: colors.successBg,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 4,
    },
    primaryButton: {
      flex: 1,
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 3,
      backgroundColor: vermelho,
      ...web({ cursor: 'pointer' }),
    },
    primaryButtonText: {
      fontFamily: fonts.regular,
      fontSize: 15,
      color: colors.onPrimary,
    },
    secondaryButton: {
      flex: 1,
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.card,
      ...web({ cursor: 'pointer' }),
    },
    secondaryButtonText: {
      fontFamily: fonts.regular,
      fontSize: 15,
      color: colors.text,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      gap: 12,
    },
    summaryRowLast: {
      borderBottomWidth: 0,
    },
    summaryLabel: {
      fontFamily: fonts.light,
      fontSize: 13,
      color: colors.textMuted,
    },
    summaryValue: {
      flexShrink: 1,
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.text,
      textAlign: 'right',
    },
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
    },
    badgeText: {
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 12,
    },
    tipText: {
      flex: 1,
      fontFamily: fonts.light,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
  });
}