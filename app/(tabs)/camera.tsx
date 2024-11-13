import React, { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions, FlashMode, CameraMode } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { X, Grid, FlipHorizontal2, Focus, Settings2, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function CameraComponent() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [isTakingPicture, setIsTakingPicture] = useState(false);
    const [facing, setFacing] = useState<CameraType>('front');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [mode, setMode] = useState<CameraMode>('picture');
    const [countdown, setCountdown] = useState(30);
    const [isLocked, setIsLocked] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTap = useRef<number>(0);
    const [isGridVisible, setIsGridVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [focusMode, setFocusMode] = useState<'auto' | 'continuous'>('auto');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    useEffect(() => {
        let countdownInterval: NodeJS.Timeout;
        if (isRecording) {
            countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        stopRecording();
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdownInterval);
    }, [isRecording]);

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dy) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy < -50 && !isLocked) {
                setIsLocked(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        },
        onPanResponderRelease: () => {
            if (!isLocked) {
                stopRecording();
            }
        },
    });

    const toggleCameraFacing = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
            toggleCameraFacing();
        } else {
            lastTap.current = now;
        }
    };

    const handleShutterPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (mode === 'picture') {
            takePicture();
        } else {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    };

    const handleShutterLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setMode('video');
        startRecording();
    };

    const handleShutterPressIn = () => {
        longPressTimer.current = setTimeout(handleShutterLongPress, 500);
    };

    const handleShutterPressOut = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            setIsTakingPicture(true);
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo taken:', photo.uri);
            setIsTakingPicture(false);
        }
    };

    const startRecording = async () => {
        if (cameraRef.current && !isRecording) {
            setIsRecording(true);
            console.log('Started Recording');
            const video = await cameraRef.current.recordAsync();
            console.log('Video recorded:', video.uri);
        }
    };

    const stopRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            cameraRef.current?.stopRecording();
            console.log('Stopped Recording');
            setCountdown(30);
            setMode('picture');
            setIsLocked(false);
        }
    };

    const openGallery = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result.assets[0]);
            // Handle the selected image or video
        }
    };

    const toggleGrid = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setIsGridVisible(prev => !prev);
    };

    const toggleFocusMode = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setFocusMode(prev => prev === 'auto' ? 'continuous' : 'auto');
    };
    const toggleMute = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setIsMuted(prev => !prev);
    };
    const toggleSettings = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setIsSettingsOpen(prev => !prev);
    };

    if (!permission) {
        return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to use the camera</Text>
                <TouchableOpacity onPress={() => { requestPermission(); }}>
                    <Text style={styles.button}>Grant permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing={facing}
                flash={flash}
                mode={mode}
                zoom={facing === 'back' ? 0 : 0.0008}
                videoStabilizationMode="cinematic"
                videoQuality="1080p"
                autoFocus={focusMode}
            >
                <TouchableWithoutFeedback onPress={handleDoubleTap}>
                    <View style={styles.cameraContainer}>
                        {isRecording && (
                            <View style={styles.recordingIndicator}>
                                <Text style={styles.recordingText}>● {countdown}s</Text>
                            </View>
                        )}
                        {isGridVisible && (
                            <View style={styles.gridOverlay}>
                                <View style={[styles.gridLine, styles.horizontalLine, { top: '33%' }]} />
                                <View style={[styles.gridLine, styles.horizontalLine, { top: '66%' }]} />
                                <View style={[styles.gridLine, styles.verticalLine, { left: '33%' }]} />
                                <View style={[styles.gridLine, styles.verticalLine, { left: '66%' }]} />
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.verticalMenu}>
                    <TouchableOpacity style={styles.menuButton} onPress={toggleFlash}>
                        <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={24} color="white" />
                    </TouchableOpacity>
                    {isSettingsOpen && (<>

                        <TouchableOpacity style={styles.menuButton} onPress={toggleGrid}>
                            <Grid size={24} color={isGridVisible ? "yellow" : "white"} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={toggleCameraFacing}>
                            <FlipHorizontal2 size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={toggleFocusMode}>
                            <Focus size={24} color={focusMode === 'continuous' ? "yellow" : "white"} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuButton} onPress={toggleMute}>
                            <Ionicons
                                name={isMuted ? "mic-off" : "mic"}
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </>)}
                    <TouchableOpacity style={styles.menuButton} onPress={toggleSettings}>
                        <Settings2 size={24} color={isSettingsOpen ? "yellow" : "white"} />
                    </TouchableOpacity>

                </View>

                <View style={styles.controlBar}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <X size={30} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        {...panResponder.panHandlers}
                        style={[styles.shutterButton, isRecording && styles.recordingShutter]}
                        onPress={handleShutterPress}
                        onPressIn={handleShutterPressIn}
                        onPressOut={handleShutterPressOut}
                    >
                        {isLocked && <Lock size={24} color="white" style={styles.lockIcon} />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
                        <Ionicons name="images" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    message: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        color: 'blue',
        fontSize: 18,
        textAlign: 'center',
    },
    verticalMenu: {
        position: 'absolute',
        top: 40,
        right: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    menuButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
    },
    controlBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50,
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        padding: 10,
    },
    shutterButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingShutter: {
        backgroundColor: 'red',
    },
    galleryButton: {
        padding: 10,
    },
    recordingIndicator: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,0,0,0.6)',
        borderRadius: 20,
        padding: 10,
        paddingHorizontal:20
    },
    recordingText: {
        color: 'white',
        fontWeight: 'bold',
    },
    lockIcon: {
        position: 'absolute',
    },
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gridLine: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    horizontalLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
    },
    verticalLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
    },
    muteButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 30,
        padding: 10,
    },
});