import React, { createContext, useContext, useMemo, useState } from 'react';

const PERFIL_ADMIN = 'Administrador';

const USUARIO_INICIAL = {
  nome: 'Luis Oliva',
  email: 'luis.oliva@labflow.com',
  cargo: 'Administrador',
  perfil: PERFIL_ADMIN,
  instituicao: 'LabFlow',
  telefone: '(11) 91234-5678',
  avatarUrl: null,
};

const UserContext = createContext(null);

export function UserProvider({ children, initialUser = USUARIO_INICIAL }) {
  const [user, setUser] = useState(initialUser);
  const value = useMemo(
    () => ({ user, setUser, isAdmin: user?.perfil === PERFIL_ADMIN }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider');
  return ctx;
}