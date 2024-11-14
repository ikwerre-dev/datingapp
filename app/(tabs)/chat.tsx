import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter, useParams } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = useRef<FlatList<Message> | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Fetch messages for the current chat from an API or database
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
          sender: 'You',
          text: 'Im doing great, thanks for asking!',
          timestamp: '2023-04-20T12:35:12Z',
        },
        {
          id: 3,
          sender: 'John Doe',
          text: 'Did you see the latest news?',
          timestamp: '2023-04-20T12:36:04Z',
        },
        {
          id: 4,
          sender: 'You',
          text: 'No, what happened?',
          timestamp: '2023-04-20T12:36:30Z',
        },
      ];
      setMessages(mockMessages);
    };
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (newMessage.trim() !== '') {
      const newMessageObject: Message = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');
    }
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat with John Doe</Text>
      </View>
      <FlatList
        ref={messagesRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'You' ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Send size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  messageContainer: {
    backgroundColor: '#fff',
    padding: 12,
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
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    color: '#fff',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 50,
  },
});

export default ChatScreen;