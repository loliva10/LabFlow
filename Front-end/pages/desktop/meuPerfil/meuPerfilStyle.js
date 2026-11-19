import { Platform, StyleSheet } from 'react-native';
import { colors as loginColors } from '../login/LoginStyle';

export const createStyles = (c) => {
  const isDark = c.statusBar === 'light';
  const bordaCampo = isDark ? c.inputBorder : loginColors.primaryLight;
  const bordaFoco = isDark ? c.primary : loginColors.primary;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: c.bg,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 26,
      paddingTop: 18,
      paddingBottom: 32,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
      gap: 16,
      flexWrap: 'wrap',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 26,
      lineHeight: 36,
      color: c.text,
    },
    subtitle: {
      fontFamily: 'Poppins_300Light',
      fontSize: 15,
      lineHeight: 22,
      color: c.text,
      marginLeft: 6,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
      backgroundColor: c.dangerBg,
    },
    logoutButtonText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      color: c.danger,
    },

    columns: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 24,
    },
    column: {
      flex: 1,
      minWidth: 340,
      gap: 24,
    },

    card: {
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 24,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    cardTitleIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 18,
      color: c.text,
    },
    divider: {
      height: 1,
      backgroundColor: c.divider,
      marginVertical: 16,
    },

    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatarWrapper: {
      width: 76,
      height: 76,
      position: 'relative',
      ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: c.avatarBg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: 76,
      height: 76,
    },
    avatarBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: c.accent,
      borderWidth: 2,
      borderColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 28,
      color: c.onPrimary,
    },
    profileName: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 20,
      color: c.text,
    },
    profileRole: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 15,
      color: c.accent,
    },

    field: {
      marginBottom: 14,
    },
    label: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      color: c.textMuted,
      marginBottom: 4,
    },
    input: {
      height: 42,
      borderWidth: 1,
      borderColor: bordaCampo,
      borderRadius: 3,
      paddingHorizontal: 12,
      fontFamily: 'Poppins_300Light',
      fontSize: 15,
      color: c.text,
      backgroundColor: c.inputBg,
      ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    inputFocused: {
      borderColor: bordaFoco,
      borderWidth: 2,
      paddingHorizontal: 11,
    },
    inputError: {
      borderColor: c.danger,
    },
    inputDisabled: {
      backgroundColor: c.inputDisabledBg,
      color: c.textMuted,
    },

    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.primary,
      borderRadius: 8,
      paddingVertical: 12,
      marginTop: 8,
    },
    primaryButtonText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      color: c.onPrimary,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.inputBorder,
      paddingVertical: 12,
      marginTop: 8,
    },
    secondaryButtonText: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      color: c.text,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },

    optionRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.inputBorder,
      backgroundColor: c.inputBg,
    },
    optionActive: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    optionText: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      color: c.text,
    },
    optionTextActive: {
      color: c.onPrimary,
    },

    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    switchTitle: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      color: c.text,
    },
    switchDescription: {
      fontFamily: 'Poppins_300Light',
      fontSize: 12,
      color: c.textMuted,
    },

    message: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      marginTop: 10,
    },
    messageError: {
      color: c.danger,
    },
    messageSuccess: {
      color: c.accent,
    },

    photoOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoMenu: {
      width: 300,
      maxWidth: '92%',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: 12,
      paddingVertical: 8,
    },
    photoMenuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    photoMenuTitle: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 16,
      color: c.text,
    },
    photoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 18,
      height: 46,
      ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    },
    photoItemHover: {
      backgroundColor: c.inputDisabledBg,
    },
    photoItemText: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 14,
      color: c.text,
    },
    photoItemDanger: {
      color: c.danger,
    },
    photoDivider: {
      height: 1,
      backgroundColor: c.divider,
    },
  });
};