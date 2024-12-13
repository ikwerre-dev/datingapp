import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const router = useRouter();
  const [messages] = useState([
    {
      id: 1,
      type: 'image',
      user: 'Athalia Putri',
      content: 'Look at how chocho sleep in my arms!',
      timestamp: '16:46',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 2,
      type: 'text',
      user: 'You',
      content: 'Can I come over?',
      timestamp: '16:46',
    },
    {
      id: 3,
      type: 'text',
      user: 'Athalia Putri',
      content: "Of course, let me know if you're on your way",
      timestamp: '16:46',
    },
    {
      id: 4,
      type: 'text',
      user: 'You',
      content: "K, I'm on my way",
      timestamp: '16:50',
      readStatus: 'Read',
    },
    {
      id: 5,
      type: 'voice',
      user: 'You',
      timestamp: '09:13',
      readStatus: 'Read',
      audioUrl: 'https://www.computerhope.com/jargon/m/example.mp3',
      duration: '0:20',
    },
    {
      id: 6,
      type: 'text',
      user: 'Athalia Putri',
      content: 'Good morning, did you sleep well?',
      timestamp: '09:45',
    },
  ]);

  const [playingAudio, setPlayingAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const soundRef = useRef(null);
  const flatListRef = useRef(null);

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleAudioPlay = async (audioUrl, messageId) => {
    // If no audio is playing or a different audio is selected
    if (playingAudio !== messageId) {
      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }

      // Load and play the new audio
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.isPlaying) {
              // Update progress while playing
              setProgress(status.positionMillis / status.durationMillis);
            }

            if (status.didJustFinish) {
              // Reset when audio finishes
              setPlayingAudio(null);
              setProgress(0);
            }
          }
        });

        // Set the current playing audio
        setPlayingAudio(messageId);
      } catch (error) {
        console.error('Error playing audio:', error);
        setPlayingAudio(null);
        setProgress(0);
      }
    } else {
      // If the same audio is playing, stop it and reset
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      setPlayingAudio(null);
      setProgress(0);
    }
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setIsPopupVisible(true);
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'image') {
      return (
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          style={styles.messageContainer}
        >
          <View style={styles.imageMessage}>
            <Image source={{ uri: item.imageUrl }} style={styles.chatImage} />
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === 'text') {
      const isUser = item.user === 'You';
      return (
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          style={[styles.messageContainer, isUser ? styles.myMessage : styles.youMessage]}
        >
          <Text style={isUser ? styles.myMessageText : styles.youText}>{item.content}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'voice') {
      const isPlaying = playingAudio === item.id;
      return (
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          style={[styles.messageContainer, styles.myMessage]}
        >
          <View style={styles.voiceMessage}>
            <TouchableOpacity onPress={() => handleAudioPlay(item.audioUrl, item.id)}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="white" />
            </TouchableOpacity>
            <View style={styles.waveformContainer}>
              <View 
                style={[
                  styles.waveform, 
                  { width: `${progress * 100}%`, backgroundColor: 'white' }
                ]} 
              />
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Athalia Putri</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#0052FF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsPopupVisible(false)}
        >
          <Pressable 
            style={styles.popup} 
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.popupTitle}>Message Options</Text>
            <TouchableOpacity 
              style={styles.popupButton}
              onPress={() => {
                console.log('Copy Pressed');
                setIsPopupVisible(false);
              }}
            >
              <Ionicons name="copy" size={20} color="#0052FF" />
              <Text style={styles.popupButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.popupButton}
              onPress={() => {
                console.log('Delete Pressed');
                setIsPopupVisible(false);
              }}
            >
              <Ionicons name="trash" size={20} color="red" />
              <Text style={styles.popupButtonText}>Delete</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 20,
  },
  chatContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80, // Add extra padding at the bottom to prevent input overlap
  },
  messageContainer: {
    marginBottom: 16,
  },
  imageMessage: {
    maxWidth: "80%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  chatImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 16,
    padding: 12,
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  youMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    maxWidth: "80%",
  },
  youText: {
    fontSize: 16,
    color: "#000",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0052FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessageText: {
    fontSize: 16,
    color: "#fff",
  },
  voiceMessage: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 150,
  },
  waveformContainer: {
    flex: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  waveform: {
    height: '100%',
    backgroundColor: "white",
  },
  duration: {
    color: "#fff",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  addButton: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  popupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  popupButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});