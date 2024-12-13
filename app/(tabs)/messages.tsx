import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera, Edit, SettingsIcon, User } from "lucide-react-native";
import { useRouter } from 'expo-router';

const MessageListScreen = () => {
  const navigation = useNavigation();

  const chats = [
    {
      id: "1",
      name: "Martin Randolph",
      message: "You: What's up man!",
      time: "9:40 AM",
    },
    {
      id: "2",
      name: "Andrew Parker",
      message: "You: Ok, thanks!",
      time: "9:25 AM",
    },
    {
      id: "3",
      name: "Karen Castillo",
      message: "You: Ok, See you in To...",
      time: "Fri",
    },
    {
      id: "4",
      name: "Maisy Humphrey",
      message: "Have a good day, Maisy!",
      time: "Fri",
    },
    {
      id: "5",
      name: "Joshua Lawrence",
      message: "The business plan loo...",
      time: "Thu",
    },
  ];
  const router = useRouter();

  const stories = ["Your story", "Joshua", "Martin", "Karen", "Maisy"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity  onPress={() =>
              router.push('/(tabs)/profile')

            }
            style={styles.iconButton}>
              <User color="#000" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                router.push('/(tabs)/chat')

              }
            >
              <Image
                source={{ uri: `https://i.pravatar.cc/100?u=${item.name}` }}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 8,
    fontSize: 16,
  },
  storiesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  storyItem: {
    alignItems: "center",
    marginRight: 16,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  addStory: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  addStoryText: {
    fontSize: 24,
    color: "#000",
  },
  storyName: {
    fontSize: 12,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
  },
});

export default MessageListScreen;
