import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Pencil,
  Lock,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      title: "Edit Profile",
      link: "/",
      icon: Pencil,
      color: "#2a91f750",
    },
    {
      id: 2,
      title: "Change Password",
      link: "/",
      icon: Lock,
      color: "#2a91f750",
    },
    { id: 3, title: "Help", link: "/", icon: HelpCircle, color: "#2a91f750" },
    { id: 4, title: "Settings", link: "/", icon: Settings, color: "#2a91f750" },
    {
      id: 5,
      title: "Log out",
      link: "/intro",
      icon: LogOut,
      color: "#2a91f750",
      onPress: () => {
        router.replace("/intro", {
          params: {
            disableSwipeBack: true,
          },
        });
      },
    },
  ];

  const MenuItem = ({ title, Icon, color, link, onPress }) => (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : router.push(link))}
      style={styles.menuItem}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon size={24} color="#2a91f7" />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <ChevronRight size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?u=as" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <Pencil size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Robinson Honour</Text>
          <Text style={styles.role}>Marketing Coordinator</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              title={item.title}
              Icon={item.icon}
              color={item.color}
              link={item.link}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2a91f7",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2a91f7",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
