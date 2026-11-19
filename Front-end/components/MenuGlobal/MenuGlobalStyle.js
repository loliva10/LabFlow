
import { Platform, StyleSheet } from 'react-native'

const web = (style) => Platform.select({
  web: style,
  default: {},
})

export const createStyles = (c) => StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: c.menuBg,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    ...web({
      minHeight: '100vh',
    }),
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 52,
  },

  logo: {
    width: 200,
    height: 54,
  },

  menuTop: {
    flex: 1,
  },

  navItem: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    ...web({
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }),
  },

  navItemActive: {
    backgroundColor: c.accent,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },

  navItemHover: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  navIcon: {
    width: 28,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    color: c.onPrimary,
    fontSize: 18,
    fontWeight: '400',
  },

  menuBottom: {
    marginTop: 24,
  },
})
