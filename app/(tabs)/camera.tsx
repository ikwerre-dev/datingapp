import React, { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions, FlashMode, CameraMode } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { SendHorizontal, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [microphonepermission, requestmicrophonePermission] = useMicrophonePermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [isTakingPicture, setIsTakingPicture] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [flash, setFlash] = useState<FlashMode | undefined>('on');
    const [mode, setMode] = useState<CameraMode>("video");
    const [countdown, setCountdown] = useState(30);
    const cameraRef = useRef<CameraView | null>(null);
    const pressStart = useRef<number | null>(null);
    useEffect(() => {
        let countdownInterval: any;
        if (isRecording) {
            countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        stopRecording();
                        clearInterval(countdownInterval);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdownInterval);
    }, [isRecording]);

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };
    const goBack = () => {
        router.back();
    };
    const toggleFlash = () => {
        setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
    };

    const handleShutterPressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        pressStart.current = Date.now();
        setMode('video')
        setTimeout(() => {
            if (pressStart.current && Date.now() - pressStart.current > 600) {
                handleLongPress();
            }
        }, 1000);
    };

    const handleShutterPressOut = async () => {
        const pressDuration = Date.now() - (pressStart.current || 0);

        if (pressDuration < 1000) {
            setIsTakingPicture(true)
            await takePicture();
            stopRecording();
        } else if (isRecording) {
            stopRecording();
        }
        pressStart.current = null;
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo: any = await cameraRef.current.takePictureAsync();
            console.log('Photo taken:', photo.uri);
            setPhotoUri(photo.uri)
            // MediaLibrary.saveToLibraryAsync(photo.uri)
            setIsTakingPicture(false)
        }
    };


    const recordingOptions = {
        maxDuration: 30, // Maximum duration of video in seconds
        mute: false, // Set to true to mute audio during recording
    };

    const handleLongPress = async () => {
        if (cameraRef.current && !isRecording) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setIsRecording(true);
            console.log('Started Recording')
            const videoRecordPromise = cameraRef.current.recordAsync(recordingOptions);
            const { uri } = await videoRecordPromise;
            setVideoUri(uri);
            // MediaLibrary.saveToLibraryAsync(uri)
            console.log('Temporary video file saved at:', uri);
        }
    };
    const stopRecording = () => {
        const cameraInstance = cameraRef.current;
        setIsRecording(false);
        cameraInstance?.stopRecording();
        console.log('stopped')
        setCountdown(30);
        setMode('picture')

    };


    const handleDoubleTap = () => {
        const now = Date.now();
        if (pressStart.current && now - pressStart.current < 300) {
            toggleCameraFacing();
        } else {
            pressStart.current = now;
        }
    };

    const handleGalleryPress = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            const { assets } = await MediaLibrary.getAssetsAsync();
        }
    };
    if (!permission) {
        return <View />;
    }
    if (!microphonepermission) {
        return <View />;
    }
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }
    if (!microphonepermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to record Audio</Text>
                <Button onPress={requestmicrophonePermission} title="Grant permission" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                flash={flash}
                mode={mode}
                zoom={facing == 'back' ? 0 : 0.0008}
                animateShutter={true}
                enableTorch={true}
                videoStabilizationMode='cinematic'
                videoQuality='1080p'

            >
                <TouchableWithoutFeedback onPress={handleDoubleTap}>
                    <View style={styles.cameraContainer}>
                        {isRecording && (
                            <View style={styles.recordingIndicator}>
                                <View style={styles.redBox}>
                                    <Text style={styles.redBoxText}>0:{countdown.toString().padStart(2, '0')}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={toggleFlash}>
                    <View style={styles.backController}>

                        <View style={styles.closeIndicator}>
                            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={30} color="white" />

                        </View>

                    </View>

                </TouchableWithoutFeedback>
                <Image src='' />

                {/* {!isTakingPicture && !isRecording && videoUri && (
                    <Video
                        source={{ uri: videoUri }}
                        style={styles.video}
                        shouldPlay
                        // useNativeControls={true}
                        isLooping={false}
                    />
                )} */}

                <View style={styles.CameraControlBar}>

                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.icon} onPress={goBack}>
                            <X size={30} color={'white'} />

                        </TouchableOpacity>
                    </View>
                    <View style={styles.shutterContainer}>
                        <TouchableOpacity
                            style={styles.shutterButton}
                            onPressIn={handleShutterPressIn}
                            onPressOut={handleShutterPressOut}
                        >
                            <View style={isRecording ? styles.shutter : '' as any}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={handleGalleryPress}
                        >
                            <Ionicons name="image" size={30} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    backController: {
        // flex: 1,
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    CameraControlBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 40,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        top: 0,
    },
    icon: {
        padding: 10,
    },
    shutterContainer: {},
    shutterButton: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutter: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
    },
    recordingIndicator: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    closeIndicator: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 50,
        padding: 10
    },
    redBox: {
        width: 60,
        height: 30,
        backgroundColor: 'rgba(255,0,0,0.4)',
        borderRadius: 60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redBoxText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    sendText: {
        color: 'white',
        fontSize: 18,
    },
    video: {
        width: '100%',
        height: 200,
        position: 'absolute',
        bottom: 100,
    },
});
