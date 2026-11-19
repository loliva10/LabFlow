import React, { useMemo } from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { usePreferences } from '../../context/PreferencesContext'
import { useUser } from '../../context/UserContext'
import { createStyles } from './MenuGlobalStyle'

const logoImage = require('../../assets/Logo (branca).png')

const MENU_TOP = [
  { key: 'dashboard', labelKey: 'menu.dashboard', icon: 'grid-outline' },
  { key: 'documentos', labelKey: 'menu.documentos', icon: 'document-text-outline' },
  { key: 'atendimentos', labelKey: 'menu.atendimentos', icon: 'headset-outline' },
  { key: 'integracoes', labelKey: 'menu.integracoes', icon: 'power-plug-outline', material: true },
]

const MENU_BOTTOM = [
  { key: 'administracao', labelKey: 'menu.administracao', icon: 'settings-outline', adminOnly: true },
  { key: 'perfil', labelKey: 'menu.perfil', icon: 'person-circle-outline' },
]

function MenuIcon({ item, color }) {
  if (item.material) {
    return (
      <MaterialCommunityIcons
        name={item.icon}
        size={21}
        color={color}
      />
    )
  }

  return (
    <Ionicons
      name={item.icon}
      size={21}
      color={color}
    />
  )
}

function MenuItem({ item, activeMenu, onNavigate, styles, colors, t }) {
  const active = activeMenu === item.key

  return (
    <Pressable
      onPress={() => onNavigate && onNavigate(item.key)}
      style={({ hovered }) => [
        styles.navItem,
        active && styles.navItemActive,
        hovered && !active && styles.navItemHover,
      ]}
    >
      <View style={styles.navIcon}>
        <MenuIcon
          item={item}
          color={colors.onPrimary}
        />
      </View>

      <Text style={styles.navText}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  )
}

export default function MenuGlobal({
  activeMenu = 'dashboard',
  onNavigate,
}) {
  const { colors, t } = usePreferences()
  const { isAdmin } = useUser()
  const styles = useMemo(() => createStyles(colors), [colors])

  const menuBottomVisivel = useMemo(
    () => MENU_BOTTOM.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin]
  )

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.menuTop}>
        {MENU_TOP.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            activeMenu={activeMenu}
            onNavigate={onNavigate}
            styles={styles}
            colors={colors}
            t={t}
          />
        ))}
      </View>

      <View style={styles.menuBottom}>
        {menuBottomVisivel.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            activeMenu={activeMenu}
            onNavigate={onNavigate}
            styles={styles}
            colors={colors}
            t={t}
          />
        ))}
      </View>
    </View>
  )
}