import { Stack } from 'expo-router/stack';
import { Text } from 'react-native';

export default function Layout() {

    return (
        <><Stack>
          <Stack.Screen name="intro" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        </>
    );
}
