import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, TextInput, ScrollView,BackHandler } from 'react-native';
import colors from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ContributionChart } from '../components/ContributionChart';
import MoodCalendar from '../components/MoodKalender';
import DateTimePicker from '@react-native-community/datetimepicker';

const MoodTracker = ({navigation}) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [reason, setReason] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [user, setUser] = useState(null);
  const [showMoodCalendar, setShowMoodCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe; 
  }, []);

  const handleMoodButtonPress = (mood) => {
    setSelectedMood(mood);
  };

  const handleReasonButtonPress = (selectedReason) => {
    setReason(selectedReason);
  };

  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed, navigating to sicher');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Sicherheitsbedürfnisse' }],
      });
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [navigation]);

  const handleSubmit = async () => {
    if (selectedMood.trim() !== '' && reason.trim() !== '') {
      try {
        const docRef = await addDoc(collection(db, `moods/${user.uid}/userMoods`), {
          mood: selectedMood,
          reason: reason,
          textInput: textInput,
          createdAt: new Date().toISOString(),
        });
        setSelectedMood('');
        setReason('');
        setTextInput('');
        setIsSubmitted(true);
        setShowButtons(false);
        Alert.alert('Mood Tracker', 'Mood and reason submitted successfully.');
        console.log('Document written with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      Alert.alert('Mood Tracker', 'Please select a mood and reason before submitting.');
    }
  };

  const handleInfoButton = () => {
    Alert.alert(
      'Bedeutung der Stimmungsverfolgung',
      'Die Verfolgung der Stimmung kann dir helfen, dein emotionales Wohlbefinden zu verstehen und zu verwalten. Indem du deine Stimmungen festhältst, kannst du Muster, Auslöser und Trends erkennen, die sich auf deine mentale Gesundheit auswirken. Es kann auch wertvolle Erkenntnisse für Selbstreflexion, Kommunikation mit medizinischen Fachkräften und informierte Entscheidungen für die Selbstfürsorge liefern.'
    );
  };

  const handleMoodDataPress = () => {
    if (showMoodCalendar) {
      setShowMoodCalendar(false);
    }
    setShowChart(!showChart);
  };

  const handleCalendarPress = () => {
    if (showChart) {
      setShowChart(false);
    }
    setShowMoodCalendar((prev) => !prev);
    setSelectedDate(new Date());
  };

  const handleDeleteData = () => {
    moodData.forEach((data) => {
      const moodDocRef = doc(db, `moods/${user.uid}/userMoods`, data.id);
      deleteDoc(moodDocRef);
    });
    setShowChart(false);
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, `moods/${user.uid}/userMoods`), (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const moodData = doc.data();
          return {
            id: doc.id,
            ...moodData,
          };
        });
        setMoodData(data);
      });
      return unsubscribe;
    }
  }, [user]);

  const moodImages = {
    good: require('../assets/good_mood.png'),
    happy: require('../assets/happy_mood.png'),
    neutral: require('../assets/neutral_mood.png'),
    sad: require('../assets/sad_mood.png'),
    bad: require('../assets/bad_mood.png'),
    awful: require('../assets/awful_mood.png'),
  };

  const renderMoodImages = () => {
    if (isSubmitted) {
      return null;
    }

    return (
      <View style={styles.moodContainer}>
        {Object.keys(moodImages).map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodItemContainer, selectedMood === mood ? styles.selectedMood : null]}
            onPress={() => handleMoodButtonPress(mood)}
          >
            <Image source={moodImages[mood]} style={styles.moodImage} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReasonButtons = () => {
    if (isSubmitted) {
      return null;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Was belastet dich?</Text>
        <View style={styles.reasonContainer}>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Arbeit' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Arbeit')}
          >
            <Text style={styles.reasonButtonText}>Arbeit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Beziehung' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Beziehung')}
          >
            <Text style={styles.reasonButtonText}>Beziehung</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Gesundheit' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Gesundheit')}
          >
            <Text style={styles.reasonButtonText}>Gesundheit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Familie' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Familie')}
          >
            <Text style={styles.reasonButtonText}>Familie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Finanzen' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Finanzen')}
          >
            <Text style={styles.reasonButtonText}>Finanzen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Stress' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Stress')}
          >
            <Text style={styles.reasonButtonText}>Stress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.reasonButton, reason === 'Sonstiges' ? styles.selectedReason : null]}
            onPress={() => handleReasonButtonPress('Sonstiges')}
          >
            <Text style={styles.reasonButtonText}>Sonstiges</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTextInput = () => {
    if (isSubmitted) {
      return null;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Lass uns darüber schreiben:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Schreibe, was dich bedrückt..."
          value={textInput}
          onChangeText={(text) => setTextInput(text)}
        />
      </View>
    );
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowDateTimePicker(false);
  };

  const showDateTimepicker = () => {
    setShowDateTimePicker(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.infoButton} onPress={handleInfoButton}>
        <MaterialCommunityIcons name="information-outline" size={24} color="black" />
      </TouchableOpacity>

      {renderMoodImages()}

      {renderReasonButtons()}

      {renderTextInput()}

      {!isSubmitted && showButtons && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Stimmung Speichern</Text>
        </TouchableOpacity>
      )}

      {isSubmitted && (
        <View>
          <Text style={styles.submittedText}>Du hast heute bereits deine Stimmung gespeichert.</Text>
          <TouchableOpacity style={styles.button} onPress={handleMoodDataPress}>
            <Text style={styles.buttonText}>Mood Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCalendarPress}>
            <Text style={styles.buttonText}>Kalender</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMoodCalendar && <MoodCalendar user={user} moodData={moodData} />}

      {showDateTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showChart && moodData.length > 0 && (
        <View>
          <TouchableOpacity style={styles.deleteDataButton} onPress={handleDeleteData}>
            <Text style={styles.deleteDataButtonText}>Delete Data</Text>
          </TouchableOpacity>
          <ContributionChart data={moodData} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.white,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 10,
    marginTop: 40,
  },
  moodItemContainer: {
    alignItems: 'center',
  },
  selectedMood: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    padding: 10,
  },
  moodImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.purple,
  },
  reasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  reasonButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 6,
  },
  selectedReason: {
    backgroundColor: colors.grey,
  },
  reasonButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: colors.midGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'transparent',
    padding: 8,
  },
  submittedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  deleteDataButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  deleteDataButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default MoodTracker;
