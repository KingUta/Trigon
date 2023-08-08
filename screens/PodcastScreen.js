import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, StyleSheet, TextInput, Button } from 'react-native';
import { Audio } from 'expo-av';
import { Client } from 'podcast-api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { debounce } from 'lodash';

const PodcastScreen = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activePodcast, setActivePodcast] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  
  
  const client = Client({ apiKey: '9559c8343f504a06b9601f8047b2d169' });

  const recommendationIds = [
    'a366eb9c39d5415f8399756870ba95f3',
    '8043a063bc6a4afc965eb60716a52306',
    '88e3eecb69154cac84f0fcd80bf485f8'
  ];

  const fetchRecommendedPodcasts = () => {
    const fetchPodcastPromises = recommendationIds.map(id => 
      client.fetchEpisodeById({
        id: id,
        show_transcript: 1,
      })
    );

    Promise.all(fetchPodcastPromises)
      .then((responses) => {
        const recommendationData = responses.map(response => response.data);
        setRecommendations(recommendationData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchRecommendedPodcasts();
  }, []);

  const handleSearch = useCallback(debounce(() => {
    if (searchText !== '') {
      setIsLoading(true);
      client.search({
        q: searchText,
        language: 'English',
        page_size: 10,
      })
        .then((response) => {
          setPodcasts(response.data.results);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching podcasts:', error);
          setIsLoading(false);
        });
    }
  }, 300), [searchText]);

  useEffect(() => {
    handleSearch();
  }, [searchText, handleSearch]);



  const playSound = async (audioUrl, item) => {
    console.log('Loading Sound');
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true }
    );
    setSound(newSound);
    console.log('Playing Sound');
    await newSound.playAsync();

    setActivePodcast(item);
    setIsModalVisible(true);
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const PodcastItem = ({ item }) => {
    const title = item.title_original || item.title;
    const titleLength = title.length;
    let fontSize = 20;  
    
    if (titleLength > 30) {
      fontSize = 14;  
    } else if (titleLength > 10) {
      fontSize = 12;  
    }
  
    return (
      <TouchableOpacity
        onPress={() => playSound(item.audio, item)}
        style={{
          backgroundColor: Colors.white,
          padding: 20,
          borderRadius: 10,
          marginVertical: 20,
          padding: 10,
          marginRight: 5,

        }}
      >
        <Image
          style={{ width: 150, height: 120 }}
          source={{ uri: item.image }}
        />
        <View style={{width: 150 , padding: 10}}> 
          <Text style={{ color: Colors.purple, fontSize: fontSize, fontWeight: 'bold' }}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  
  

  const renderItem = ({ item }) => <PodcastItem item={item} />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.purple, padding: 15 }}>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold', }}>Vorgeschlagene Podcasts</Text>
        <FlatList
          data={recommendations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 5 }} 
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 2, color: Colors.white, borderRadius: 10, paddingLeft: 20 }}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          placeholder="   Suche Podcasts..."
          placeholderTextColor={Colors.white}
        />
  
          <TouchableOpacity
          style={[styles.podcastButton]}
          onPress={handleSearch}>
          <Text style={styles.podcastButtonText}>Suche</Text>
        </TouchableOpacity>

      </View>
       {
          searchText !== "" && (
            isLoading ? (
              <Text style={{ color: Colors.white }}>Loading...</Text>
            ) : (
              <FlatList
                data={podcasts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                 showsVerticalScrollIndicator={false}
              />
            )
          )}
      
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {activePodcast &&
            <>
              <Image
                style={{ width: 150, height: 100, padding: 30 }}
                source={{ uri: activePodcast.image }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: 300 }}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={async () => { if (sound) await sound.stopAsync(); setIsModalVisible(false); }}
                >
                  <MaterialCommunityIcons name="stop" size={50} color={Colors.purple} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={async () => { if (sound) await sound.pauseAsync(); }}
                >
                  <MaterialCommunityIcons name="pause" size={50} color={Colors.purple} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={async () => { if (sound) await sound.playAsync(); }}
                >
                  <MaterialCommunityIcons name="play" size={50} color={Colors.purple} />
                </TouchableOpacity>
              </View>
            </>
          }
        </View>
      </Modal>
    </View>
  );
};

export default PodcastScreen;

const styles = StyleSheet.create({
  controlButton: {
    padding: 10,
    marginTop: 15,
  },
  podcastButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 6,
    
  },
  podcastButtonText: {
    fontSize: 16,
    color: Colors.purple,
    fontWeight: 'bold',
  },
});
