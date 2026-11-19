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

    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      marginTop: 20,
      marginBottom: 12,
      overflow: 'hidden',
    },
    cardCabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputBorder,
    },
    cardCabecalhoTextos: {
      flex: 1,
    },
    atendNome: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 18,
      color: colors.text,
    },
    atendSub: {
      fontFamily: 'Poppins_300Light',
      fontSize: 12,
      color: colors.text,
    },
    status: {
      paddingHorizontal: 28,
      paddingVertical: 4,
      borderRadius: 4,
    },
    statusAberto: {
      backgroundColor: colors.infoBg,
    },
    statusAndamento: {
      backgroundColor: colors.warningBg,
    },
    statusConcluido: {
      backgroundColor: colors.successBg,
    },
    statusCancelado: {
      backgroundColor: colors.dangerBg,
    },
    statusTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 15,
    },
    statusAbertoTexto: {
      color: colors.info,
    },
    statusAndamentoTexto: {
      color: colors.warning,
    },
    statusConcluidoTexto: {
      color: colors.success,
    },
    statusCanceladoTexto: {
      color: colors.danger,
    },

    corpo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 24,
      padding: 20,
    },
    colunaEsquerda: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 320,
    },
    secaoTitulo: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 15,
      color: colors.text,
      marginBottom: 8,
    },
    descricaoBox: {
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 4,
      padding: 14,
      marginBottom: 18,
    },
    descricaoTexto: {
      fontFamily: 'Poppins_300Light',
      fontSize: 13,
      lineHeight: 20,
      color: colors.text,
    },
    documentoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.inputBorder,
    },
    documentoTexto: {
      flex: 1,
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      color: colors.text,
    },

    historico: {
      marginBottom: 6,
    },
    historicoItem: {
      flexDirection: 'row',
      gap: 12,
    },
    historicoTrilho: {
      width: 20,
      alignItems: 'center',
    },
    historicoPonto: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.cta,
      marginTop: 4,
    },
    historicoLinha: {
      flex: 1,
      width: 2,
      backgroundColor: colors.inputBorder,
      marginTop: 2,
    },
    historicoTextos: {
      flex: 1,
      paddingBottom: 16,
    },
    historicoTitulo: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      color: colors.text,
    },
    historicoData: {
      fontFamily: 'Poppins_300Light',
      fontSize: 11,
      color: colors.text,
      opacity: 0.8,
    },

    acoes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    acao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      height: 32,
      borderWidth: 1,
      borderColor: colors.cta,
      borderRadius: 4,
      backgroundColor: colors.card,
      ...web({ cursor: 'pointer' }),
    },
    acaoAtiva: {
      backgroundColor: colors.hover,
    },
    acaoTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      color: colors.ctaText,
    },

    painel: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 320,
      backgroundColor: colors.primary,
      borderRadius: 4,
      padding: 18,
    },
    painelTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 12,
      marginBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    },
    painelTituloTexto: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 17,
      color: colors.onPrimary,
    },
    painelLista: {
      marginBottom: 6,
    },
    campo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    campoLinha: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    },
    campoIcone: {
      width: 28,
      alignItems: 'center',
    },
    campoTextos: {
      flex: 1,
      minWidth: 0,
    },
    campoLabel: {
      fontFamily: 'Poppins_300Light',
      fontSize: 11,
      color: colors.onPrimary,
      opacity: 0.8,
    },
    campoValor: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      color: colors.onPrimary,
    },
    badgePrioridade: {
      minWidth: 52,
      paddingHorizontal: 8,
      paddingVertical: 1,
      borderRadius: 3,
      alignItems: 'center',
    },
    badgePrioridadeTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 10,
    },

    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    confirmacao: {
      width: 380,
      maxWidth: '100%',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      gap: 8,
    },
    confirmacaoTitulo: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 18,
      color: colors.text,
    },
    confirmacaoTexto: {
      fontFamily: 'Poppins_300Light',
      fontSize: 13,
      color: colors.text,
      textAlign: 'center',
    },
    confirmacaoAcoes: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    confirmacaoCancelar: {
      paddingHorizontal: 22,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 6,
      ...web({ cursor: 'pointer' }),
    },
    confirmacaoCancelarTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      color: colors.text,
    },
    confirmacaoConfirmar: {
      paddingHorizontal: 22,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cta,
      borderRadius: 6,
      ...web({ cursor: 'pointer' }),
    },
    confirmacaoConfirmarTexto: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 13,
      color: colors.onPrimary,
    },
  });