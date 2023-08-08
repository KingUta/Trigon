import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import colors from '../constants/colors';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';

const MoodTracker = () => {
  const { user } = useContext(AuthenticatedUserContext);
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    const loadMoodData = async () => {
      if (user) {
        const userId = user.uid;
        const moodRef = collection(db, 'moodTracker');
        const q = query(moodRef, where('userId', '==', userId));

        const unsubscribe = onSnapshot(q, () => {
          setIsLoading(false);
        });

        return () => unsubscribe();
      } else {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, [user]);

  const saveMood = async (selectedMood) => {
    if (!user) {
      return;
    }

    const userId = user.uid;
    const moodRef = collection(db, 'moodTracker');

    try {
      await addDoc(moodRef, { mood: selectedMood, userId });
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

  const renderReasonButton = (reason) => (
    <TouchableOpacity
      key={reason}
      style={styles.reasonButton}
      onPress={() => setSelectedReason(reason)}
      activeOpacity={0.8}
    >
      <Text style={selectedReason === reason ? styles.selectedReasonText : styles.reasonText}>{reason}</Text>
    </TouchableOpacity>
  );

  const handleSubmitMood = () => {
    // Perform any desired action with the selected mood and submission text
    console.log('Selected Mood:', mood);
    console.log('Submission Text:', submissionText);
  };

  const handleInfoButton = () => {
    // Show information popup explaining the importance of sleep
    Alert.alert(
      'Importance of Sleep',
      'Sleep is essential for maintaining good physical and mental health. It helps improve concentration, boost immunity, regulate mood, and support overall well-being. Make sure to prioritize quality sleep by maintaining a consistent sleep schedule and creating a sleep-friendly environment.'
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
      <TouchableOpacity style={styles.infoButton} onPress={handleInfoButton}>
        <Image source={require('../assets/info.png')} style={styles.infoIcon} />
      </TouchableOpacity>

      <Text style={styles.moodTitle}>How's your mood today?</Text>
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

      <Text style={styles.reasonTitle}>Was belastet dich?</Text>
      <View style={styles.reasonsContainer}>
        {renderReasonButton('Work')}
        {renderReasonButton('Relationships')}
        {renderReasonButton('Health')}
        {renderReasonButton('Finances')}
        {renderReasonButton('Family')}
        {renderReasonButton('School')}
        {renderReasonButton('Self-esteem')}
        {renderReasonButton('Other')}
      </View>

      <Text style={styles.writeTitle}>Lass uns darüber schreiben:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your thoughts..."
        value={submissionText}
        onChangeText={setSubmissionText}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitMood}>
        <Text style={styles.submitButtonText}>Submit Mood</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  infoIcon: {
    width: 24,
    height: 24,
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
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
  reasonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  reasonButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  reasonText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedReasonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  writeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  textInput: {
    width: '100%',
    height: 100,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default MoodTracker;
