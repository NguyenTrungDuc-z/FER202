import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem('user-info')) ||
      JSON.parse(sessionStorage.getItem('user-info'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    console.log("Current user after login:", currentUser); // Thêm dòng này để debug
  }, [currentUser]);
  const login = (userData, remember = false) => {
    setCurrentUser(userData);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user-info', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user-info');
    sessionStorage.removeItem('user-info');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
