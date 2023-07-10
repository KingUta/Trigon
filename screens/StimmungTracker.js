import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const MoodTracker = () => {
  const [mood, setMood] = useState('');
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = 'YOUR_USER_ID'; // Replace with your user ID
    const moodRef = collection(db, 'moodTracker');
    const q = query(moodRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setMoodData(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveMood = async (mood) => {
    const userId = 'YOUR_USER_ID'; // Replace with your user ID
    const moodRef = collection(db, 'moodTracker');

    try {
      await addDoc(moodRef, { mood, userId });
      Alert.alert('Mood Tracker', 'Mood saved successfully.');
    } catch (error) {
      console.error('Error adding mood data: ', error);
      Alert.alert('Mood Tracker', 'Failed to save mood. Please try again.');
    }
  };

  const deleteMood = async (moodId) => {
    const moodDocRef = doc(db, 'moodTracker', moodId);

    try {
      await deleteDoc(moodDocRef);
      Alert.alert('Mood Tracker', 'Mood deleted successfully.');
    } catch (error) {
      console.error('Error deleting mood data: ', error);
      Alert.alert('Mood Tracker', 'Failed to delete mood. Please try again.');
    }
  };

  const renderMoodItem = (moodItem) => {
    const { id, mood } = moodItem;

    return (
      <TouchableOpacity key={id} style={styles.moodItemContainer} onPress={() => deleteMood(id)}>
        <Image source={moodImages[mood]} style={styles.moodImage} />
      </TouchableOpacity>
    );
  };

  const moodImages = {
    good: require('../assets/good_mood.png'),
    happy: require('../assets/happy_mood.png'),
    neutral: require('../assets/neutral_mood.png'),
    sad: require('../assets/sad_mood.png'),
    bad: require('../assets/bad_mood.png'),
    awful: require('../assets/awful_mood.png'),
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How's your mood today?</Text>
      <View style={styles.moodContainer}>
        {Object.keys(moodImages).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={styles.moodItemContainer}
            onPress={() => saveMood(mood)}
          >
            <Image source={moodImages[mood]} style={styles.moodImage} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>Past Month Mood Statistics</Text>
      <View style={styles.statisticsContainer}>
        {moodData.map(renderMoodItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodItemContainer: {
    alignItems: 'center',
  },
  moodImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  statisticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default MoodTracker;
