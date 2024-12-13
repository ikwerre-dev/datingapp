import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Slot, usePathname, useRouter, Stack } from 'expo-router';
import { Compass, Film, Home, MessageCircle, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentTab = pathname === '/' ? 'home' : pathname.substring(1);
    setActiveTab(currentTab);
  }, [pathname]);

  const NavigationBar: React.FC = () => {
    interface NavItem {
      id: string;
      icon: React.ReactNode;
      label?: string;
    }

    const navItems: NavItem[] = [
      { id: 'home', icon: <Home size={30} />, label: 'Home' },
      { id: 'discover', icon: <Compass size={30} />, label: 'Discover' },
      { id: 'camera', icon: <Plus size={30} />, label: '' },
      { id: 'reels', icon: <Film size={30} />, label: 'Reels' },
      { id: 'messages', icon: <MessageCircle size={30} />, label: 'Messages' },
    ];

    const changeTab = (id: string) => {
      setActiveTab(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      const link: string = id === 'home' ? '/' : `/${id}`;
      router.push(link);
    };

    return (
      <View style={styles.navBarContent}>
        <View style={styles.navBar}>
          {navItems.map((item) => (
            <TouchableOpacity
              onPress={() => changeTab(item.id)}
              key={item.id}
              style={styles.navItem}
            >
              {React.cloneElement(item.icon, {
                color: activeTab === item.id ? '#2a91f7' : 'black',
              })}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add the Stack Navigator */}
      <Stack
        screenOptions={{
          gestureEnabled: !['home', 'discover', 'camera', 'reels', 'messages','intro'].includes(activeTab),
          headerShown: false, // Hide headers (if preferred)
        }}
      >
        <Slot />
      </Stack>
      {(activeTab !== 'camera' &&
        activeTab !== 'reels' &&
        activeTab !== 'profile' &&
        activeTab !== 'chat') && <NavigationBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBarContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 30,
    paddingBottom: 60,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  navItem: {
    alignItems: 'center',
  },
});
