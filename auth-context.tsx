import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext 
const AuthContext = createContext();
// AuthContext Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial load

  // Check if the user is logged in by checking AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData)); // Parse user data from AsyncStorage
      }
      setLoading(false); // Set loading to false after checking AsyncStorage
    };
    loadUserData();
  }, []);

  const login = async (userData) => {
    setUser(userData); // Set user data in state
    await AsyncStorage.setItem('user', JSON.stringify(userData)); // Save to AsyncStorage
  };

  const logout = async () => {
    setUser(null); // Clear user data from state
    await AsyncStorage.removeItem('user'); // Remove from AsyncStorage
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => React.useContext(AuthContext);
