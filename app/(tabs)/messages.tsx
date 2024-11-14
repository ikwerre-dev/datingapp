import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const MessageListScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch messages from an API or database
    const fetchMessages = async () => {
      const mockMessages: Message[] = [
        {
          id: 1,
          sender: 'John Doe',
          text: 'Hey, how are you?',
          timestamp: '2023-04-20T12:34:56Z',
        },
        {
          id: 2,
          sender: 'Jane Smith',
          text: 'Im doing great, thanks for asking!',
          timestamp: '2023-04-20T12:35:12Z',
        },
        {
          id: 3,
          sender: 'Bob Johnson',
          text: 'Did you see the latest news?',
          timestamp: '2023-04-20T12:36:04Z',
        },
      ];
      setMessages(mockMessages);
    };
    fetchMessages();
  }, []);

  const handleMessagePress = (message: Message) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/chat/${message.id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageContainer} onPress={() => handleMessagePress(item)}>
            <Text style={styles.senderText}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
});

export default MessageListScreen;