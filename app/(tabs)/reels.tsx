import {
    View,
    Dimensions,
    FlatList,
    StyleSheet,
    Pressable,
    Image,
    Text,
    TouchableOpacity,
    StyleProp,
    ImageStyle,
    Animated,
    Easing,
    PanResponder
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, MoreHorizontal, ThumbsUp, X, Play, RefreshCcw, Loader, Eye, Bookmark } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LogBox } from 'react-native';
LogBox.ignoreLogs([/Invalid view returned from registry, expecting EXVideo/]);
const videos = [
    {
        id: 1,
        url: "https://indulgetix.com/clanshare_api/uploads/675b98404f67a_3DC01467-5F30-41E3-ADCF-CCE4202A5678.mp4",
        userName: "Robinson Honour",
        userLocation: "Port Harcourt",
        liked: true,
    },
    {
        id: 2,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        userName: "Jane Smith",
        userLocation: "New York",
        liked: false,
    },
    {
        id: 3,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        userName: "Bob Johnson",
        userLocation: "Chicago",
        liked: true,
    },
    {
        id: 4,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        userName: "Sarah Lee",
        userLocation: "Los Angeles",
        liked: false,
    },
    {
        id: 5,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        userName: "Tom Wilson",
        userLocation: "Miami",
        liked: true,
    },
    {
        id: 6,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        userName: "Emily Davis",
        userLocation: "Seattle",
        liked: false,
    },
    {
        id: 7,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        userName: "John Doe",
        userLocation: "San Francisco",
        liked: false,
    },
    {
        id: 8,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        userName: "Jane Smith",
        userLocation: "New York",
        liked: false,
    },
    {
        id: 9,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        userName: "Bob Johnson",
        userLocation: "Chicago",
        liked: false,
    },
    {
        id: 10,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        userName: "Sarah Lee",
        userLocation: "Los Angeles",
        liked: false,
    },
    {
        id: 11,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        userName: "Tom Wilson",
        userLocation: "Miami",
        liked: false,
    },
    {
        id: 12,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        userName: "Emily Davis",
        userLocation: "Seattle",
        liked: false,
    },
    {
        id: 13,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        userName: "John Doe",
        userLocation: "San Francisco",
        liked: false,
    },
    {
        id: 14,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        userName: "Jane Smith",
        userLocation: "New York",
        liked: false,
    },
    {
        id: 15,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        userName: "Bob Johnson",
        userLocation: "Chicago",
        liked: false,
    },
    {
        id: 16,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        userName: "Sarah Lee",
        userLocation: "Los Angeles",
        liked: false,
    },
    {
        id: 17,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        userName: "Tom Wilson",
        userLocation: "Miami",
        liked: false,
    },
    {
        id: 18,
        url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        userName: "Emily Davis",
        userLocation: "Seattle",
        liked: false,
    },
    {
        id: 19,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        userName: "John Doe",
        userLocation: "San Francisco",
        liked: false,
    },
    {
        id: 20,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        userName: "Jane Smith",
        userLocation: "New York",
        liked: true,

    }
];

const INITIAL_ITEMS = 5;

export default function FeedScreen() {
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const [displayedVideos, setDisplayedVideos] = useState(videos.slice(0, INITIAL_ITEMS));
    const videoRefs = useRef<(Video | null)[]>([]);

    useEffect(() => {
        videoRefs.current = displayedVideos.map(() => null);
    }, [displayedVideos]);

    useEffect(() => {
        return () => {
            videoRefs.current.forEach(videoRef => {
                if (videoRef) {
                    videoRef.stopAsync();
                    videoRef.unloadAsync();
                }
            });
        };
    }, []);

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

    const likePost = (id: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        console.log('Liked post:', id);
    };

    const openChat = (id: number) => {
        router.push(`/message/chat/${id}`);
    };

    const loadMoreVideos = () => {
        const lastIndex = displayedVideos.length - 1;
        if (lastIndex >= INITIAL_ITEMS - 2) {
            const newVideos = videos.slice(displayedVideos.length, displayedVideos.length + 5);
            setDisplayedVideos(prevVideos => [...prevVideos, ...newVideos]);
            console.log('Loading more videos...');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={displayedVideos}
                renderItem={({ item, index }) => (
                    <Item
                        item={item}
                        shouldPlay={index === currentViewableItemIndex}
                        ref={(ref) => {
                            videoRefs.current[index] = ref as Video | null;
                        }}
                        onLike={likePost}
                        onOpenChat={openChat}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                pagingEnabled
                horizontal={false}
                showsVerticalScrollIndicator={false}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onEndReached={loadMoreVideos}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
}

const Item = React.forwardRef(({ item, shouldPlay, onLike, onOpenChat }: { shouldPlay: boolean; item: any; onLike: (id: number) => void; onOpenChat: (id: number) => void }, ref: any) => {
    const video = React.useRef<Video | null>(null);
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
    const spinValue = new Animated.Value(0);
    const [progress, setProgress] = useState(0);
    console.log(item)

    // Set the ref for parent component access
    React.useImperativeHandle(ref, () => video.current);
    const [isDragging, setIsDragging] = useState(false);
    const progressBarWidth = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
            },
            onPanResponderMove: (_, gestureState) => {
                // Handle progress bar dragging
            },
            onPanResponderRelease: (_, gestureState) => {
                // Handle progress bar release
                setIsDragging(false);
            },
        })
    ).current;

    useEffect(() => {
        if (!isDragging && status?.positionMillis && status?.durationMillis) {
            const currentProgress = status.positionMillis / status.durationMillis;
            setProgress(currentProgress);
            const newWidth = currentProgress * 100; // Convert to percentage

            Animated.timing(progressBarWidth, {
                toValue: newWidth,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [status?.positionMillis, status?.durationMillis, isDragging]);

    // Handle loading animation
    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinValue.setValue(0);
        }
    }, [isLoading]);

    // Handle video playback based on shouldPlay prop
    useEffect(() => {
        if (!video.current) return;

        if (shouldPlay) {
            video.current.playAsync().then(() => {
                console.log('Video should start playing');
                setIsActuallyPlaying(true);
            }).catch(err => {
                console.error('Error auto-playing:', err);
                setIsActuallyPlaying(false);
            });
        } else {
            video.current.pauseAsync().then(() => {
                video.current?.setPositionAsync(0);
                console.log('Video should pause');
                setIsActuallyPlaying(false);
            }).catch(err => {
                console.error('Error pausing:', err);
            });
        }
    }, [shouldPlay]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const handleRefresh = async () => {
        setLoadError(false);
        setIsLoading(true);
        setIsActuallyPlaying(false);
        if (video.current) {
            try {
                await video.current.unloadAsync();
                await video.current.loadAsync({ uri: item.url }, {}, false);
                console.log('Video refreshed successfully');
            } catch (error) {
                console.error('Error refreshing video:', error);
                setLoadError(true);
            }
        }
    };

    const leave = () => {
        if (!video.current) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        video.current.pauseAsync().then(() => {
            setIsActuallyPlaying(false);
            video.current?.setPositionAsync(0);
            router.back();
        }).catch(err => {
            console.error('Error leaving video:', err);
            router.back();
        });
    };

    const togglePlayPause = async () => {
        if (!video.current) return;

        try {
            const currentStatus = await video.current.getStatusAsync();
            console.log('Current video status:', currentStatus);

            if (currentStatus.isLoaded && 'isPlaying' in currentStatus) {
                if (currentStatus.isPlaying) {
                    await video.current.pauseAsync();
                    setIsActuallyPlaying(false);
                    console.log('Video paused successfully');
                } else {
                    await video.current.playAsync();
                    setIsActuallyPlaying(true);
                    console.log('Video playing successfully');
                }
            } else if (!currentStatus.isLoaded) {
                handleRefresh();
            }
        } catch (error) {
            console.error('Error toggling play/pause:', error);
            setIsActuallyPlaying(false);
        }
    };
    const [liked, setLiked] = useState(item.liked);

    const handlePress = () => {
        const newLikedStatus = !liked;
        setLiked(newLikedStatus);
        onLike(item.id); // Optionally, call the parent method with the updated state
    };
    return (
        <Pressable onPress={togglePlayPause}>
            <View style={styles.videoContainer}>
                <Video
                    ref={video}
                    source={{ uri: item.url }}
                    style={styles.video}
                    isLooping
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={false}
                    onPlaybackStatusUpdate={status => {
                        setStatus(() => status);
                        if (status?.isLoaded) {
                            setIsLoading(false);
                            setIsActuallyPlaying(status.isPlaying);
                            if (!isDragging) {
                                if (status?.positionMillis && status?.durationMillis) {
                                    const currentProgress = status.positionMillis / status.durationMillis;
                                    setProgress(currentProgress);
                                }
                            }
                        }
                    }}
                    onError={(error) => {
                        console.error('Video Error:', error);
                        setLoadError(true);
                        setIsLoading(false);
                        setIsActuallyPlaying(false);
                    }}
                />

                {/* Overlay for Play/Load/Error states */}
                {(isLoading || !isActuallyPlaying || loadError) && (
                    <View style={styles.overlay}>
                        {isLoading && !loadError && (
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <Loader size={48} color="#fff" />
                            </Animated.View>
                        )}
                        {!isLoading && !isActuallyPlaying && !loadError && (
                            <TouchableOpacity onPress={togglePlayPause}>
                                <Play size={48} color="#fff" fill="#fff" />
                            </TouchableOpacity>
                        )}
                        {loadError && (
                            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                                <RefreshCcw size={48} color="#fff" />
                                <Text style={styles.refreshText}>Tap to retry</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <View style={styles.postContent}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/800?img=30' }}
                            style={styles.userImage as StyleProp<ImageStyle>}
                        />
                        <View>
                            <Text style={styles.userName}>{item.userName}</Text>
                            <Text style={styles.userLocation}>{item.userLocation}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.PostButtoncontainer}>
                    <View style={styles.PostButtonmenuContainer}>
                        <TouchableOpacity
                            onPress={handlePress}
                            style={[
                                styles.PostButtonbutton,
                                liked && { backgroundColor: 'rgba(0,0, 255, 0.5)' }
                            ]}
                        >
                          <ThumbsUp size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => onOpenChat(item.id)} style={styles.PostButtonbutton}>
                            <MessageCircle size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.PostButtonbutton}>
                            <Bookmark size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={leave} style={styles.PostButtonbutton}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.progressBarContainer} {...panResponder.panHandlers}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressBarWidth,
                            },
                        ]}
                    />
                </View>
            </View>
        </Pressable>
    );
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButton: {
        alignItems: 'center',
    },
    refreshText: {
        color: '#fff',
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    postContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        paddingBottom: 50
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    userLocation: {
        fontSize: 12,
        color: '#eee',
        textTransform: 'uppercase',
    },
    PostButtoncontainer: {
        position: 'absolute',
        right: 10,
        top: '45%',
        transform: [{ translateY: -75 }],
    },
    PostButtonmenuContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 30,
        padding: 8,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    PostButtonbutton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressBar: {
        width: '1%',
        height: 5,
        backgroundColor: 'white',
    },
});