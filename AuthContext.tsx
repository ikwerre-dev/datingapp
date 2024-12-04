import AsyncStorage from "@react-native-async-storage/async-storage"; 
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define types for AuthContext value
interface AuthContextType {
  authStatus: '0' | '1'; // Only '0' (logged out) and '1' (logged in)
  setAuthStatus: React.Dispatch<React.SetStateAction<'0' | '1'>>; // Function to update authStatus
}


/*


const App: React.FC = () => {
  const { authStatus, setAuthStatus } = useAuth();
  const navigation = useNavigation();

  // Handle login
  const handleLogin = async () => {
    if (resp2.status === 200) {
      setAuthStatus('1'); // Logged in
      await AsyncStorage.setItem("authenticated_status", '1');
      
      // Navigate to the screens under the logged in conditional
      navigation.navigate("LoggedInScreen"); 
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await AsyncStorage.clear();
    setAuthStatus('0'); // Logged out
    await AsyncStorage.setItem("authenticated_status", '0');
    


    // Navigate to the screens under the logged out conditional
    navigation.navigate("LoggedOutScreen");
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authStatus === '0' ? (
          // Logged out screens
          <>
            <Stack.Screen name="LoggedOutScreen" component={LoggedOutScreen} />
            Add more logged-out screens here 
            </>
        ) : (
           Logged in screens
          <>
        add more logged out screens
              </>
       // )}
      //</Stack.Navigator>
   // </NavigationContainer>
  );
};

*/

// Create an AuthContext with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define types for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode; // children prop can be any valid React node
}

// AuthProvider component to wrap around parts of your app that need access to authentication status
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<'0' | '1'>('0'); // Default to '0' (logged out)

  useEffect(() => {
    const getDeets = async () => {
      const authenticatedStatus = await AsyncStorage.getItem("authenticated_status");
      if (authenticatedStatus === "1") {
        setAuthStatus('1'); // Logged in
      } else {
        setAuthStatus('0'); // Logged out
      }
    };
    getDeets();
  }, []); // Empty dependency array to run only once on mount

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional: Create a custom hook to use the AuthContext easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
