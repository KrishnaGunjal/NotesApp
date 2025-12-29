import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/auth/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import NotesListScreen from './src/screens/NotesListScreen';

const AppContent = () => {
  const { session } = useContext(AuthContext);
  return session ? <NotesListScreen /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
