import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { useAuth } from './context/auth';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async () => {
   
    router.replace('/intro');

  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={credentials.username}
        onChangeText={(text) => setCredentials(prev => ({
          ...prev,
          username: text
        }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) => setCredentials(prev => ({
          ...prev,
          password: text
        }))}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});