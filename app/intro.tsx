import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

    const handleLogin = async () => {
   
        router.replace('/');
    
      };
    
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('@/assets/images/login.png')}
                    style={styles.topImage}
                />
            </View>

            <Text style={styles.title}>Let's meeting new{'\n'}people around you</Text>

            <TouchableOpacity onPress={handleLogin} style={styles.phoneButton}>
                <Image
                    source={require('@/assets/images/phone.png')}
                    style={styles.buttonIcon}
                />
                <Text style={styles.phoneButtonText}>Login with Phone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton}>
                <Image
                    source={require('@/assets/images/google.png')}
                    style={styles.buttonIcon}
                />
                <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity>
                    <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    topImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
        color: '#000'
    },
    phoneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 35,
        backgroundColor: '#16324C',
        padding: 10,
        borderRadius: 50,
        marginBottom: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 35,
        backgroundColor: '#88AEDD60',
        padding: 10,
        borderRadius: 50,
        marginBottom: 16,
    },
    buttonIcon: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    phoneButtonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
     },
    googleButtonText: {
        color: '#fff',
        // color: '#163B4C',
        fontSize: 22,
        fontWeight: '800',
        
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#DD88CF',
        fontWeight: '600',
    },
});
