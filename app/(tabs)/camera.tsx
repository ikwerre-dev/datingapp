import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { Haptics, ImpactFeedbackStyle } from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';

const CameraScreen = () => {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<any>('off');
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleLongPress = async () => {
    if (cameraRef.current && !isRecording && !isLocked) {
      Haptics.impactAsync(ImpactFeedbackStyle.Medium);
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 30,
      });
      setVideoUri(video.uri);
    }
  };

  const handleRelease = () => {
    if (cameraRef.current && isRecording && !isLocked) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleLockToggle = () => {
    setIsLocked((prev) => !prev);
  };

  const handleSwitchCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  const handleToggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'torch' : 'off');
  };

  const handleOpenGallery = async () => {
    setShowGalleryModal(true);
  };

  const handleCloseGalleryModal = () => {
    setShowGalleryModal(false);
  };

  const handleSend = () => {
    // Implement the logic to send the photo/video
    console.log('Sending video/photo...');
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Permission to access camera denied</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={isFrontCamera ? Camera.Constants.Type.front : Camera.Constants.Type.back}
        flashMode={flashMode}
        ref={cameraRef}
      >
        {isRecording && (
          <View style={styles.recordingBox}>
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.flashButton}
          onPress={handleToggleFlash}
        >
          <Ionicons name="flash" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleOpenGallery}
        >
          <Ionicons name="images" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchCameraButton}
          onPress={handleSwitchCamera}
        >
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>
      </Camera>

      <View style={styles.shutterContainer}>
        <TouchableOpacity
          style={styles.shutterButton}
          onLongPress={handleLongPress}
          onPressOut={handleRelease}
        >
          <Text style={styles.shutterText}>{isRecording ? 'Stop' : 'Record'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lockButton}
          onPress={handleLockToggle}
        >
          <Ionicons name="lock-closed" size={32} color={isLocked ? 'red' : 'white'} />
        </TouchableOpacity>
      </View>

      <Modal visible={showGalleryModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gallery</Text>
            <TouchableOpacity
              onPress={handleCloseGalleryModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {/* You can display a gallery component here */}
          </View>
        </View>
      </Modal>

      {videoUri && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  shutterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  lockButton: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  galleryButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  switchCameraButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  recordingBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderColor: 'red',
    borderWidth: 2,
    padding: 5,
    borderRadius: 5,
  },
  recordingText: {
    color: 'red',
    fontWeight: 'bold',
  },
  videoContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  video: {
    width: 300,
    height: 200,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;
