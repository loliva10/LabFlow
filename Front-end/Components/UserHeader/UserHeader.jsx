import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { useUser } from '../../context/UserContext';
import { createStyles } from './userHeaderStyle';

function iniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function UserHeader({
  notificationCount = 0,
  onOpenNotifications,
  onOpenProfile,
}) {
  const { colors, t } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const { user } = useUser();

  const temNotificacoes = notificationCount > 0;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.iconButton}
        onPress={onOpenNotifications}
        accessibilityRole="button"
        accessibilityLabel={t('dash.notificacoes')}
      >
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
        {temNotificacoes && <View style={styles.notificationDot} />}
      </Pressable>

      <Pressable
        style={({ hovered }) => [styles.userBox, hovered && styles.userBoxHover]}
        onPress={onOpenProfile}
        accessibilityRole="button"
        accessibilityLabel={t('dash.perfil')}
      >
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{iniciais(user.nome)}</Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{user.nome}</Text>
          {!!user.cargo && <Text style={styles.userRole} numberOfLines={1}>{user.cargo}</Text>}
        </View>
      </Pressable>
    </View>
  );
}