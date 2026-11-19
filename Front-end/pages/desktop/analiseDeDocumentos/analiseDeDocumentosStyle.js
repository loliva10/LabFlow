import { Platform, StyleSheet } from 'react-native';
import { fonts } from '../login/LoginStyle';

const web = (style) => Platform.select({ web: style, default: {} });

const fontMedium = 'Poppins_500Medium';

export const createStyles = (colors) => {
  const panel = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 6,
    padding: 18,
  };

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

    backButton: {
      alignSelf: 'flex-start',
      width: 32,
      height: 24,
      borderRadius: 3,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
      ...web({ cursor: 'pointer' }),
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

    notice: {
      marginTop: 14,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
      borderWidth: 1,
    },
    noticeSuccess: {
      backgroundColor: colors.successBg,
      borderColor: colors.success,
    },
    noticeError: {
      backgroundColor: colors.dangerBg,
      borderColor: colors.danger,
    },
    noticeText: {
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    noticeSuccessText: { color: colors.success },
    noticeErrorText: { color: colors.danger },

    columns: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 20,
      marginTop: 18,
    },
    leftCol: {
      flexGrow: 1.15,
      flexBasis: 420,
    },
    rightCol: {
      flexGrow: 1,
      flexBasis: 380,
      gap: 14,
    },

    fileCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      overflow: 'hidden',
    },
    fileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 54,
      paddingHorizontal: 18,
      backgroundColor: colors.primary,
    },
    fileHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
    },
    fileName: {
      marginLeft: 10,
      color: colors.onPrimary,
      fontFamily: fonts.regular,
      fontSize: 16,
      flexShrink: 1,
    },
    statusBadge: {
      paddingHorizontal: 22,
      paddingVertical: 5,
      borderRadius: 4,
      marginLeft: 12,
    },
    statusBadgeText: {
      fontFamily: fonts.regular,
      fontSize: 14,
    },
    previewFrame: {
      height: 420,
      margin: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 4,
      backgroundColor: colors.bg,
      overflow: 'hidden',
    },
    viewerWeb: {
      flex: 1,
      ...web({ overflow: 'auto' }),
    },
    viewerScroll: {
      flex: 1,
    },
    viewerScrollX: {
      flexGrow: 0,
    },
    pageShadow: {
      backgroundColor: '#FFFFFF',
      ...web({ boxShadow: '0 2px 10px rgba(0,0,0,0.18)' }),
      elevation: 3,
    },
    zoomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
      marginHorizontal: 16,
      paddingHorizontal: 14,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    zoomControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    zoomText: {
      minWidth: 64,
      textAlign: 'center',
      color: colors.onPrimary,
      fontFamily: fonts.regular,
      fontSize: 13,
    },
    zoomButton: {
      paddingHorizontal: 6,
      ...web({ cursor: 'pointer' }),
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 14,
      paddingVertical: 16,
    },
    squareButton: {
      width: 62,
      height: 36,
      borderRadius: 4,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...web({ cursor: 'pointer' }),
    },

    panel,
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 22,
    },
    progressCenter: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressValue: {
      color: colors.cta,
      fontFamily: fonts.regular,
      fontSize: 20,
    },
    progressInfo: {
      flex: 1,
    },
    progressTitle: {
      color: colors.cta,
      fontFamily: fontMedium,
      fontSize: 20,
      marginBottom: 10,
    },
    barTrack: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.divider,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 5,
      backgroundColor: colors.cta,
    },
    progressHint: {
      marginTop: 6,
      color: colors.cta,
      fontFamily: fonts.regular,
      fontSize: 11,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    sectionIcon: {
      marginRight: 8,
    },
    sectionTitle: {
      color: colors.text,
      fontFamily: fontMedium,
      fontSize: 18,
    },

    table: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      minHeight: 38,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tableRowLast: {
      borderBottomWidth: 0,
    },
    tableLabel: {
      flex: 1,
      paddingHorizontal: 16,
      color: colors.text,
      fontFamily: fonts.light,
      fontSize: 13,
    },
    tableValue: {
      flex: 1,
      minHeight: 38,
      justifyContent: 'center',
      paddingHorizontal: 16,
      borderLeftWidth: 1,
      borderLeftColor: colors.divider,
    },
    tableValueText: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 13,
    },
    tableInput: {
      height: 28,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 3,
      backgroundColor: colors.hover,
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 13,
      ...web({ outlineStyle: 'none' }),
    },

    checkList: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      overflow: 'hidden',
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    checkIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.cta,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    checkTexts: {
      flex: 1,
    },
    checkLabel: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 12,
    },
    checkDescription: {
      color: colors.text,
      fontFamily: fonts.light,
      fontSize: 10,
    },
    checkValue: {
      color: colors.text,
      fontFamily: fonts.regular,
      fontSize: 12,
      marginLeft: 8,
    },

    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 14,
      marginTop: 14,
    },
    outlineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 34,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.cta,
      borderRadius: 4,
      backgroundColor: colors.card,
      ...web({ cursor: 'pointer' }),
    },
    outlineButtonHover: {
      backgroundColor: colors.hover,
    },
    outlineButtonText: {
      marginLeft: 8,
      color: colors.cta,
      fontFamily: fonts.regular,
      fontSize: 13,
    },

    fullOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    fullPanel: {
      width: '92%',
      maxWidth: 900,
      height: '90%',
      backgroundColor: colors.card,
      borderRadius: 6,
      overflow: 'hidden',
    },
    fullHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
    },
    fullBody: {
      flex: 1,
      padding: 12,
    },
    fullFrame: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 4,
      backgroundColor: colors.bg,
      overflow: 'hidden',
    },
  });
};