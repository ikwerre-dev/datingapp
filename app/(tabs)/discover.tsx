import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

interface User {
  id: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  name: string;
  description: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  const generateRandomPeople = (userLocation: LocationData | null): User[] => {
    if (!userLocation) return [];
    const people: User[] = [];
    for (let i = 0; i < 15; i++) { // Changed to generate 15 people
      const randomLat = userLocation.latitude + (Math.random() - 0.5) * 0.03;
      const randomLng = userLocation.longitude + (Math.random() - 0.5) * 0.03;
      people.push({
        id: i,
        latitude: randomLat,
        longitude: randomLng,
        imageUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
        name: `User ${i + 1}`,
        description: `Description of User ${i + 1}`,
      });
    }
    return people;
  };

  const people = generateRandomPeople(location);

  const handleMarkerClick = (user: User) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedUser(user);
  };

  return (
    <View style={styles.container}>
      {loading || location === null ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please hold on: loading...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Circle
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={500} // Increased the radius of the translucent circle
            fillColor="rgba(0, 0, 255, 0.1)"
            strokeWidth={1}
            strokeColor="white"
          />

          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
            <View style={styles.userMarkerContainer}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=0' }}
                style={styles.profileImage}
              />
            </View>
          </Marker>

          {people.map((person) => (
            <Marker
              key={person.id}
              coordinate={{ latitude: person.latitude, longitude: person.longitude }}
              onPress={() => handleMarkerClick(person)}
            >
              <View style={styles.markerContainer}>
                <Image source={{ uri: person.imageUrl }} style={styles.profileImage} />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {selectedUser && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedUser(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedUser.name}</Text>
              <Text style={styles.modalDescription}>{selectedUser.description}</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  userMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 2000,
    overflow: 'hidden',
    width: 50,
    height: 50,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 2000,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  modalDescription: { 
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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

export default MapScreen;
