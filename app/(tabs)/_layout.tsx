import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Compass, Film, Home, MessageCircle, Plus, Users } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

type Styles = {
  navBar: ViewStyle;
  navBarContent: ViewStyle;
  navItem: ViewStyle;
  navIcon: ViewStyle;
  activeNavIcon: ViewStyle;
  navText: TextStyle;
};

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const pathname = usePathname();

  useEffect(() => {
    // Update activeTab based on the current route
    const currentTab = pathname === '/' ? 'home' : pathname.substring(1);
    setActiveTab(currentTab);
  }, [pathname]);

  const NavigationBar: React.FC = () => {
    interface NavItem {
      id: string;
      icon: any;
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
      if (id === activeTab) {
       }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      const link: string = id === 'home' ? '/' : `/${id}`;
      router.navigate(link as any);
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

  const styles = StyleSheet.create<Styles>({
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
    navIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#DDDDDD',
    },
    activeNavIcon: {
      backgroundColor: '#2a91f7',
    },
    navText: {
      fontSize: 12,
      color: '#333333',
      marginTop: 4,
    },
  });

  return (
    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Camera',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            title: 'Reels',
            headerShown: false,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
      {(activeTab !== 'camera' && activeTab !== 'reels') && <NavigationBar />}
      </>
  );
}
