import { Platform, StyleSheet } from 'react-native';

const web = (style) => Platform.select({ web: style, default: {} });

const fonts = { regular: 'Poppins_400Regular', medium: 'Poppins_500Medium' };

export const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconButton: {
      padding: 4,
      ...web({ cursor: 'pointer' }),
    },
    notificationDot: {
      position: 'absolute',
      top: 3,
      right: 4,
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: colors.danger,
      borderWidth: 1.5,
      borderColor: colors.bg,
    },
    userBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 4,
      paddingLeft: 4,
      paddingRight: 12,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 24,
      backgroundColor: colors.card,
      ...web({ cursor: 'pointer' }),
    },
    userBoxHover: {
      backgroundColor: colors.hover,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    avatarFallback: {
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: colors.onPrimary,
      fontFamily: fonts.medium,
      fontSize: 13,
    },
    userInfo: {
      maxWidth: 160,
    },
    userName: {
      color: colors.text,
      fontFamily: fonts.medium,
      fontSize: 13,
      lineHeight: 18,
    },
    userRole: {
      color: colors.textMuted,
      fontFamily: fonts.regular,
      fontSize: 11,
      lineHeight: 14,
    },
  });