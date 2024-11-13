import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  TextStyle,
  ImageStyle,
  StyleProp,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Compass, EggFriedIcon, Home, MessageCircle, MoreHorizontal, Plus, Search, ThumbsUp, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { Video } from 'expo-av';

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  notificationButton: ViewStyle;
  notificationIcon: ViewStyle;
  content: ViewStyle;
  storiesContainer: ViewStyle;
  storyContainer: ViewStyle;
  storyCircle: ViewStyle;
  storyImage: ImageStyle;
  storyName: TextStyle;
  addButton: ViewStyle;
  interactionButtonsAfter: ViewStyle;
  addButtonText: TextStyle;
  actionButtonsContainer: ViewStyle;
  actionButtonContainer: ViewStyle;
  actionButton: ViewStyle;
  actionButtonText: TextStyle;
  postCard: ViewStyle;
  categoryPill: ViewStyle;
  categoryText: TextStyle;
  postImage: ImageStyle;
  postContent: ViewStyle;
  postQuestion: TextStyle;
  userInfo: ViewStyle;
  userImage: ImageStyle;
  userName: TextStyle;
  userLocation: TextStyle;
  interactionButtons: ViewStyle;
  interactionButton: ViewStyle;
  iconButton: ViewStyle;
  navBar: ViewStyle;
  navBarContent: ViewStyle;
  navItem: ViewStyle;
  navIcon: ViewStyle;
  activeNavIcon: ViewStyle;
  navText: TextStyle;
  PostCardsView: ViewStyle;
  PostButtoncontainer: ViewStyle;
  PostButtonmenuContainer: ViewStyle;
  PostButtonbutton: ViewStyle;
};
type PostType = "image" | "video";

interface StoryCircleProps {
  image: string;
  name: string;
  isAdd?: boolean;
}

interface ActionButtonProps {
  title: string;
  gradient: string[];
  onPress?: () => void;
}

interface User {
  name: string;
  image: string;
}

interface PostCardProps {
  category: string;
  image: string;
  user: User;
  location: string;
  postType: PostType
}

const StoryCircle: React.FC<StoryCircleProps> = ({ image, name, isAdd = false }) => (
  <View style={styles.storyContainer}>
    <View style={styles.storyCircle}>
      {isAdd && (
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
      )}
      <Image
        source={{ uri: image }}
        style={styles.storyImage as StyleProp<ImageStyle>}
      />
    </View>
    <Text style={styles.storyName}>{name}</Text>
  </View>
);

const ActionButton: React.FC<ActionButtonProps> = ({ title, gradient, onPress }) => (
  <TouchableOpacity style={styles.actionButtonContainer} onPress={onPress}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.actionButton}
    >
      <Text style={styles.actionButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const PostCard: React.FC<PostCardProps> = ({ category, image, postType, user, location }) => (
  <View style={styles.postCard}>
    <View style={styles.categoryPill}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
    {postType == 'image' ? (
      <Image
        source={{ uri: image }}
        style={styles.postImage as StyleProp<ImageStyle>}
        resizeMode="cover"
      />
    ) : (
      <Video
        source={{ uri: image }}
        style={styles.postImage as StyleProp<ImageStyle>}
        shouldPlay={false}
        useNativeControls={false}
        isLooping={true}
      />
    )
    }
    <View style={styles.postContent}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: user.image }}
          style={styles.userImage as StyleProp<ImageStyle>}
        />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLocation}>{location}</Text>
        </View>
      </View>
    </View>

    <View style={styles.PostButtoncontainer}>
      <View style={styles.PostButtonmenuContainer}>
        <TouchableOpacity style={styles.PostButtonbutton}>
          <ThumbsUp size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.PostButtonbutton}>
          <MessageCircle size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.PostButtonbutton}>
          <MoreHorizontal size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  </View >
);

const NavigationBar: React.FC = () => {
  interface NavItem {
    id: string;
    icon: any;
    label?: string;
  }

  const navItems: NavItem[] = [
    { id: 'home', icon: <Home size={30} />, label: 'Home' },
    { id: 'discover', icon: <Compass size={30} />, label: 'Discover' },
    { id: 'add', icon: <Plus size={30} />, label: '' },
    { id: 'friends', icon: <Users size={30} />, label: 'Friends' },
    { id: 'messages', icon: <MessageCircle size={30} />, label: 'Messages' }
  ];

  const changeTab = (id: string) => {
    const link = id === 'home' ? '/' : `/${id}`;
    router.replace(link as any);
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
            {item.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


interface Post {
  id: number;
  user_id: number;
  fullname: string;
  gender: string;
  likeCount: number;
  age: number;
  commentCount: number;
  distance: string;
  profilePicture: string;
  PostContent: string;
  postType: PostType;
}
const initialData: Post[] = [
  {
    id: 1,
    user_id: 23,
    fullname: "Robinson Honour",
    gender: "Male",
    likeCount: 50,
    age: 18,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=11",
    PostContent: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    postType: "video"
  },
  {
    id: 2,
    user_id: 15,
    fullname: "Ryan James",
    gender: "Male",
    likeCount: 50,
    age: 22,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=16",
    PostContent: "https://i.pravatar.cc/800?img=36",
    postType: "image"
  },
  {
    id: 3,
    user_id: 23,
    fullname: "Presh Dev",
    gender: "Female",
    likeCount: 50,
    age: 19,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=30",
    PostContent: "https://i.pravatar.cc/800?img=30",
    postType: "image"
  },
];

const friendsData: Post[] = [
  {
    id: 1,
    user_id: 23,
    fullname: "Robinson Honour",
    gender: "Male",
    likeCount: 50,
    age: 18,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=11",
    PostContent: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    postType: "video"
  },
  {
    id: 2,
    user_id: 15,
    fullname: "Cypher Wealth",
    gender: "Male",
    likeCount: 50,
    age: 22,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=22",
    PostContent: "https://i.pravatar.cc/800?img=12",
    postType: "image"
  },
  {
    id: 3,
    user_id: 23,
    fullname: "Kora Kosrian",
    gender: "Female",
    likeCount: 50,
    age: 19,
    commentCount: 100,
    distance: "200 KM",
    profilePicture: "https://i.pravatar.cc/800?img=23",
    PostContent: "https://i.pravatar.cc/800?img=1",
    postType: "image"
  },
];




const App: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [PostData, setPostData] = useState<Post[]>([]);
  useEffect(() => {
    setPostData(initialData);
  }, []);
  const handleMakeFriends = (): void => {
    setPostData([]); 
    setTab(0);
    console.log('Discover pressed');

    setTimeout(() => {
      setPostData(initialData); 
    }, 100);
  };

  const handleSearchPartners = (): void => {
    setPostData([]); 
    setTab(1);
    console.log('Search Partners pressed');

    setTimeout(() => {
      setPostData(friendsData); 
    }, 100);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>G-Plug</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Search color="#2a91f7" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#2a91f7'} titleColor={'#2a91f7'} title='Hang On!! Refreshing' />
      }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
        >
          <StoryCircle
            image="https://i.pravatar.cc/150?img=3"
            name="My Story"
            isAdd={true}
          />
          <StoryCircle
            image="https://i.pravatar.cc/150?img=43"
            name="Selena"
          />
          <StoryCircle
            image="https://i.pravatar.cc/150?img=41"
            name="Clara"
          />
          <StoryCircle
            image="https://i.pravatar.cc/150?img=36"
            name="Fabian"
          />
          <StoryCircle
            image="https://i.pravatar.cc/150?img=27"
            name="Ge"
          />
        </ScrollView>

        <View style={styles.actionButtonsContainer}>
          <ActionButton
            title="Discover"
            gradient={tab == 0 ? ['#fff', '#fff'] : ['#2a91f700', '#2a91f700']}
            onPress={handleMakeFriends}
          />
          <ActionButton
            title="Friends"
            gradient={tab == 1 ? ['#fff', '#fff'] : ['#2a91f700', '#2a91f700']}
            onPress={handleSearchPartners}
          />
        </View>

        <View style={styles.PostCardsView}>

          {PostData && PostData.filter(data => data.postType === 'image').map((data, index) => (
            <PostCard
              key={index}
              category={data.distance}
              image={data.PostContent}
              postType={data.postType}
              user={{
                name: data.fullname,
                image: data.profilePicture
              }}
              location={`${data.gender} - ${data.age}`}
            />
          ))}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a91f7',
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    borderColor: '#2a91f770',
    borderWidth: 2,
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DDDDDD',
  },
  content: {
    flex: 1,
  },
  PostCardsView: {
    paddingBottom: 100
  },
  storiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#2a91f7',
    padding: 2,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  storyName: {
    marginTop: 4,
    fontSize: 12,
    color: '#333333',
  },
  addButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2a91f7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#2a91f740',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 30,
    gap: 12,
  },
  actionButtonContainer: {
    flex: 1,
  },
  actionButton: {
    padding: 12,
    borderRadius: 25,
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#2a91f7',
    fontWeight: '600',
  },
  postCard: {
    margin: 16,
    backgroundColor: '#121212',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    height: 400

  },
  categoryPill: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(12, 12, 12, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,

  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
  },
  postQuestion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
    // fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'red',
  },
  interactionButtons: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingStart: 12,
    paddingVertical: 12,
    paddingEnd: 5,
    gap: 8,
    position: 'absolute',
    right: 0,
    top: 55,
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    borderStartStartRadius: 30,
    borderEndStartRadius: 30,
  },
  interactionButtonsAfter: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingStart: 12,
    paddingVertical: 12,
    paddingEnd: 5,
    gap: 8,
    position: 'absolute',
    right: 0,
    top: 55,
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    borderStartStartRadius: 30,
    borderEndStartRadius: 30,
    height: 20
  },
  interactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DDDDDD',
  },
  navBarContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 30,
    paddingBottom: 60

  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 50

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

export default App;