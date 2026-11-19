import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import { usePreferences } from '../../../context/PreferencesContext';
import { useUser } from '../../../context/UserContext';
import { createStyles } from './meuPerfilStyle';

const PERFIL_ADMIN = 'Administrador';

function getIniciais(nome) {
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function useStyles() {
  const { colors } = usePreferences();
  return useMemo(() => createStyles(colors), [colors]);
}

function Campo({ label, value, onChangeText, editable = true, ...rest }) {
  const { colors } = usePreferences();
  const styles = useStyles();
  const [focado, setFocado] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          editable && focado && styles.inputFocused,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        {...rest}
      />
    </View>
  );
}

function SwitchAnimado({ value, onValueChange, iconeOn, iconeOff, textoOn, textoOff }) {
  const { colors } = usePreferences();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trilho = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.switchOff, colors.accent],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });
  const girar = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const temIcone = Boolean(iconeOn && iconeOff);
  const temTexto = Boolean(textoOn && textoOff);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
    >
      <Animated.View
        style={{
          width: 46,
          height: 26,
          borderRadius: 13,
          backgroundColor: trilho,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateX }, { rotate: temIcone ? girar : '0deg' }],
          }}
        >
          {temIcone ? (
            <Ionicons name={value ? iconeOn : iconeOff} size={14} color={colors.accent} />
          ) : null}
          {!temIcone && temTexto ? (
            <Text style={{ fontSize: 9, fontWeight: '700', color: colors.accent }}>
              {value ? textoOn : textoOff}
            </Text>
          ) : null}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function LinhaSwitch({ titulo, descricao, value, onValueChange, ...rest }) {
  const styles = useStyles();
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.switchTitle}>{titulo}</Text>
        <Text style={styles.switchDescription}>{descricao}</Text>
      </View>
      <SwitchAnimado value={value} onValueChange={onValueChange} {...rest} />
    </View>
  );
}

function Mensagem({ msg }) {
  const { t } = usePreferences();
  const styles = useStyles();
  if (!msg) return null;
  return (
    <Text
      style={[styles.message, msg.tipo === 'erro' ? styles.messageError : styles.messageSuccess]}
    >
      {t(msg.chave)}
    </Text>
  );
}

function TituloCard({ icone, texto }) {
  const { colors } = usePreferences();
  const styles = useStyles();
  return (
    <View style={styles.cardTitleRow}>
      <View style={styles.cardTitleIcon}>
        <Ionicons name={icone} size={20} color={colors.accent} />
      </View>
      <Text style={styles.cardTitle}>{texto}</Text>
    </View>
  );
}

export default function MeuPerfil({
  activeMenu = 'perfil',
  onNavigate,
  onLogout,
  perfil = PERFIL_ADMIN,
}) {
  const {
    colors,
    theme,
    setTheme,
    language,
    setLanguage,
    notifEmail,
    setNotifEmail,
    notifSistema,
    setNotifSistema,
    t,
  } = usePreferences();
  const styles = useStyles();
  const { user, setUser } = useUser();

  const isAdmin = perfil === PERFIL_ADMIN;

  const [dados, setDados] = useState(user);
  const [backup, setBackup] = useState(user);
  const [editando, setEditando] = useState(false);
  const [msgPerfil, setMsgPerfil] = useState(null);

  const [fotoMenuAberto, setFotoMenuAberto] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [msgSenha, setMsgSenha] = useState(null);

  const foto = user.avatarUrl;
  const escuro = theme === 'escuro';
  const ingles = language === 'en';

  function atualizar(campo, valor) {
    if (campo === 'cargo' && !isAdmin) return;
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function iniciarEdicao() {
    setBackup(dados);
    setMsgPerfil(null);
    setEditando(true);
  }

  function cancelarEdicao() {
    setDados(backup);
    setEditando(false);
    setMsgPerfil(null);
  }

  function salvarPerfil() {
    if (!dados.nome.trim()) {
      setMsgPerfil({ tipo: 'erro', chave: 'perfil.erroNome' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(dados.email.trim())) {
      setMsgPerfil({ tipo: 'erro', chave: 'perfil.erroEmail' });
      return;
    }
    setUser((prev) => ({
      ...prev,
      nome: dados.nome,
      email: dados.email,
      cargo: dados.cargo,
      instituicao: dados.instituicao,
      telefone: dados.telefone,
    }));
    setEditando(false);
    setMsgPerfil({ tipo: 'ok', chave: 'perfil.okPerfil' });
  }

  function alterarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMsgSenha({ tipo: 'erro', chave: 'perfil.erroCampos' });
      return;
    }
    if (novaSenha.length < 8) {
      setMsgSenha({ tipo: 'erro', chave: 'perfil.erroTamanho' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ tipo: 'erro', chave: 'perfil.erroConfirmacao' });
      return;
    }
    if (novaSenha === senhaAtual) {
      setMsgSenha({ tipo: 'erro', chave: 'perfil.erroIgual' });
      return;
    }
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setMsgSenha({ tipo: 'ok', chave: 'perfil.okSenha' });
  }

  function sair() {
    if (onLogout) onLogout();
  }

  function definirFoto(uri) {
    setUser((prev) => ({ ...prev, avatarUrl: uri }));
  }

  async function escolherFoto() {
    setFotoMenuAberto(false);
    if (Platform.OS !== 'web') {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      definirFoto(resultado.assets[0].uri);
    }
  }

  function removerFoto() {
    definirFoto(null);
    setFotoMenuAberto(false);
  }

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <Ionicons name="person-circle-outline" size={28} color={colors.text} />
                <Text style={styles.title}>{t('perfil.titulo')}</Text>
              </View>
              <Text style={styles.subtitle}>{t('perfil.subtitulo')}</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.logoutButton} onPress={sair} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                <Text style={styles.logoutButtonText}>{t('perfil.sair')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.columns}>
            <View style={styles.column}>
              <View style={styles.card}>
                <View style={styles.profileRow}>
                  <Pressable
                    style={styles.avatarWrapper}
                    onPress={() => setFotoMenuAberto(true)}
                    accessibilityRole="button"
                    accessibilityLabel={t('perfil.fotoAlterarLabel')}
                  >
                    <View style={styles.avatar}>
                      {foto ? (
                        <Image source={{ uri: foto }} style={styles.avatarImage} />
                      ) : (
                        <Text style={styles.avatarText}>{getIniciais(user.nome)}</Text>
                      )}
                    </View>
                    <View style={styles.avatarBadge}>
                      <Ionicons name="camera" size={14} color={colors.onPrimary} />
                    </View>
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>{user.nome}</Text>
                    <Text style={styles.profileRole}>{user.cargo}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <TituloCard icone="id-card-outline" texto={t('perfil.infoPessoais')} />

                <Campo
                  label={t('perfil.nome')}
                  value={dados.nome}
                  onChangeText={(v) => atualizar('nome', v)}
                  editable={editando}
                />
                <Campo
                  label={t('perfil.email')}
                  value={dados.email}
                  onChangeText={(v) => atualizar('email', v)}
                  editable={editando}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isAdmin && (
                  <Campo
                    label={t('perfil.cargo')}
                    value={dados.cargo}
                    onChangeText={(v) => atualizar('cargo', v)}
                    editable={editando}
                  />
                )}
                <Campo
                  label={t('perfil.instituicao')}
                  value={dados.instituicao}
                  onChangeText={(v) => atualizar('instituicao', v)}
                  editable={editando}
                />
                <Campo
                  label={t('perfil.telefone')}
                  value={dados.telefone}
                  onChangeText={(v) => atualizar('telefone', v)}
                  editable={editando}
                  keyboardType="phone-pad"
                />

                <Mensagem msg={msgPerfil} />

                {editando ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.secondaryButton, styles.flex1]}
                      onPress={cancelarEdicao}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close-outline" size={18} color={colors.text} />
                      <Text style={styles.secondaryButtonText}>{t('perfil.cancelar')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.primaryButton, styles.flex1]}
                      onPress={salvarPerfil}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-outline" size={18} color={colors.onPrimary} />
                      <Text style={styles.primaryButtonText}>{t('perfil.salvar')}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={iniciarEdicao}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.onPrimary} />
                    <Text style={styles.primaryButtonText}>{t('perfil.editar')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.column}>
              <View style={styles.card}>
                <TituloCard icone="options-outline" texto={t('perfil.preferencias')} />

                <LinhaSwitch
                  titulo={t('perfil.tema')}
                  descricao={escuro ? t('perfil.temaEscuro') : t('perfil.temaClaro')}
                  value={escuro}
                  onValueChange={(v) => setTheme(v ? 'escuro' : 'claro')}
                  iconeOn="moon"
                  iconeOff="sunny"
                />
                <LinhaSwitch
                  titulo={t('perfil.idioma')}
                  descricao={ingles ? t('perfil.idiomaEn') : t('perfil.idiomaPt')}
                  value={ingles}
                  onValueChange={(v) => setLanguage(v ? 'en' : 'pt')}
                  textoOn="EN"
                  textoOff="PT"
                />

                <View style={styles.divider} />

                <LinhaSwitch
                  titulo={t('perfil.notifEmail')}
                  descricao={t('perfil.notifEmailDesc')}
                  value={notifEmail}
                  onValueChange={setNotifEmail}
                />
                <LinhaSwitch
                  titulo={t('perfil.notifSistema')}
                  descricao={t('perfil.notifSistemaDesc')}
                  value={notifSistema}
                  onValueChange={setNotifSistema}
                />
              </View>

              <View style={styles.card}>
                <TituloCard icone="lock-closed-outline" texto={t('perfil.alterarSenha')} />

                <Campo
                  label={t('perfil.senhaAtual')}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  secureTextEntry
                  placeholder={t('perfil.senhaAtualPh')}
                />
                <Campo
                  label={t('perfil.novaSenha')}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry
                  placeholder={t('perfil.novaSenhaPh')}
                />
                <Campo
                  label={t('perfil.confirmarSenha')}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                  placeholder={t('perfil.confirmarSenhaPh')}
                />

                <Mensagem msg={msgSenha} />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={alterarSenha}
                  activeOpacity={0.8}
                >
                  <Ionicons name="key-outline" size={18} color={colors.onPrimary} />
                  <Text style={styles.primaryButtonText}>{t('perfil.alterarSenha')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={fotoMenuAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setFotoMenuAberto(false)}
      >
        <Pressable style={styles.photoOverlay} onPress={() => setFotoMenuAberto(false)}>
          <Pressable style={styles.photoMenu} onPress={() => {}}>
            <View style={styles.photoMenuHeader}>
              <Text style={styles.photoMenuTitle}>{t('perfil.fotoTitulo')}</Text>
              <Pressable
                onPress={() => setFotoMenuAberto(false)}
                accessibilityLabel={t('perfil.fechar')}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            <Pressable
              onPress={escolherFoto}
              style={({ hovered }) => [styles.photoItem, hovered && styles.photoItemHover]}
            >
              <Ionicons name="image-outline" size={20} color={colors.text} />
              <Text style={styles.photoItemText}>
                {foto ? t('perfil.fotoAlterar') : t('perfil.fotoEscolher')}
              </Text>
            </Pressable>

            {foto && (
              <>
                <View style={styles.photoDivider} />
                <Pressable
                  onPress={removerFoto}
                  style={({ hovered }) => [styles.photoItem, hovered && styles.photoItemHover]}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  <Text style={[styles.photoItemText, styles.photoItemDanger]}>
                    {t('perfil.fotoRemover')}
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
} 