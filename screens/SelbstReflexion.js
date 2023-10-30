import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, BackHandler } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import colors from '../constants/colors';

const SelfReflectionScreen = ({navigation}) => {

  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed, navigating to selbst');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Selbstverwirklichung' }],
      });
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [navigation]);





  const questions = [
    'Was habe ich heute gelernt?',
    'Wofür bin ich heute dankbar?',
    'Was könnte ich morgen besser machen?',
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(['', '', '']);
  const [user, setUser] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const timerRef = useRef(null);
  const animationRef = useRef(null);


  

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, `reflections/${user.uid}/userReflections`), (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const reflectionData = doc.data();
          return {
            id: doc.id,
            ...reflectionData,
          };
        });
        setReflections(data);
      });
      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe;
  }, []);

  const handleStartExercise = () => {
    setIsExerciseStarted(true);
    setCurrentQuestionIndex(0); 
    setAnswers(['', '', '']); 
    startTimer();
  };

  const handleCancelExercise = () => {
    setIsExerciseStarted(false);
    setIsPaused(false);
    setIsAnimationPlaying(false);
    setCurrentQuestionIndex(0);
    setAnswers(['', '', '']);
    setRemainingTime(60);
    clearInterval(timerRef.current);
    animationRef.current.reset(); 
  };

  const handleDeleteAllData = async () => {
    if (user) {
      try {
        const userReflectionsCollection = collection(db, `reflections/${user.uid}/userReflections`);
        const snapshot = await getDocs(userReflectionsCollection);
        const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);
        console.log('Daten erfolgreich gelöscht!');
      } catch (error) {
        console.error('Fehler beim löschen der Daten:', error);
      }
    }
  };

  const startTimer = () => {
    const timerDuration = 60; // 1 Minute pro Frage

    let seconds = remainingTime !== 60 ? remainingTime : timerDuration; // Verwende die verbleibende Zeit, wenn sie vorhanden ist
    timerRef.current = setInterval(() => {
      if (isPaused) return;

      seconds--;

      if (seconds === 0) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        seconds = timerDuration;

        if (currentQuestionIndex >= questions.length - 1) {
          saveReflections();
          clearInterval(timerRef.current);
        }
      }

      setRemainingTime(seconds); // Speichere die verbleibende Zeit in state
    }, 1000);
  };

  const saveReflections = async () => {
    if (user) {
      const docRef = await addDoc(collection(db, `reflections/${user.uid}/userReflections`), {
        answers,
        createdAt: new Date().toISOString(),
      });
      console.log('Document written with ID: ', docRef.id);
    }
  };

  const handleInfoButton = () => {
    Alert.alert(
      'Warum ist Selbstreflexion wichtig?',
      'Dude, Selbstreflexion ist wie ein persönlicher Check-up für deinen Geist! 😎 Es hilft dir, über deinen Tag nachzudenken, was du gelernt hast, wofür du dankbar bist und was du verbessern könntest. Es ist, als würdest du deinen eigenen Life-Coach haben. Also, warum nicht ein paar Minuten nehmen und darüber nachdenken? Du wirst dich danach super fühlen! 🚀'
    );
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    setIsAnimationPlaying(!isAnimationPlaying); // Ändere den Zustand der Animation, um sie zu pausieren oder fortzusetzen

    if (!isAnimationPlaying) {
      // Die Animation wird pausiert, also halten wir den Timer an
      clearInterval(timerRef.current);
      animationRef.current.pause(); // Animation pausieren
    } else {
      // Die Animation wird fortgesetzt, also starten wir den Timer neu
      startTimer();
      animationRef.current.play(); // Animation fortsetzen
    }
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex].trim().length > 0) {
      setIsPaused(false);
      setRemainingTime(60);
      clearInterval(timerRef.current);
      animationRef.current.reset(); 
  
      if (currentQuestionIndex >= questions.length - 1) {
        saveReflections(); 
        setIsExerciseStarted(false);
        setIsPaused(false);
        setIsAnimationPlaying(false);
        setCurrentQuestionIndex(0);
        setAnswers(['', '', '']);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        startTimer();
        animationRef.current.play(); 
      }
    }
  };
  

  const handleAnswerChange = (text) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = text;
      return newAnswers;
    });
  };

  const handleFinishExercise = () => {
    if (answers[currentQuestionIndex].trim().length > 0) {
      saveReflections();
      setIsExerciseStarted(false);
      setIsPaused(false);
      setIsAnimationPlaying(false);
      setCurrentQuestionIndex(0);
      setAnswers(['', '', '']);
      setRemainingTime(60);
      clearInterval(timerRef.current);
      animationRef.current.reset();
    }
  }; 
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity style={styles.infoButton} onPress={handleInfoButton}>
          <MaterialCommunityIcons name="information-outline" size={24} color="black" />
        </TouchableOpacity>

        {!isExerciseStarted && (
          <View>
            <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
              <Text style={styles.startButtonText}>Übung starten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteDataButton} onPress={handleDeleteAllData}>
              <Text style={styles.deleteDataButtonText}>Alle Daten löschen</Text>
            </TouchableOpacity>
          </View>
        )}

        {isExerciseStarted && (
          <>
            <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
            <TextInput
              style={styles.input}
              placeholder="Deine Antwort..."
              value={answers[currentQuestionIndex]}
              onChangeText={handleAnswerChange}
            />
            <TouchableOpacity style={styles.pauseButton} onPress={handlePauseResume}>
              <Text style={styles.pauseButtonText}>{isPaused ? 'Fortsetzen' : 'Pausieren'}</Text>
            </TouchableOpacity>

            {currentQuestionIndex < questions.length - 1 ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextQuestion}
                disabled={answers[currentQuestionIndex].trim().length === 0}
              >
                <Text style={styles.nextButtonText}>Nächste Frage</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.finishButton} onPress={handleFinishExercise}>
                <Text style={styles.finishButtonText}>Übung beenden</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelExercise}>
              <Text style={styles.cancelButtonText}>Übung abbrechen</Text>
            </TouchableOpacity>
            <LottieView
              ref={animationRef}
              source={require('../assets/timerreflexion.json')}
              autoPlay={!isPaused}
              loop={currentQuestionIndex < questions.length - 1}
              style={styles.timerAnimation}
              progress={isPaused ? 0 : 1} // Set the animation progress when paused or resumed
            />
          </>
        )}

        {!isExerciseStarted && reflections.length > 0 && (
          <View style={styles.reflectionsContainer}>
            <Text style={styles.result}>Deine früheren Reflexionen:</Text>
            {reflections.map((reflection, index) => (
              <View key={index} style={styles.reflectionItem}>
                {reflection.answers.map((answer, idx) => (
                  <Text key={idx} style={styles.reflectionText}>
                    {questions[idx]}: {answer}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {!isExerciseStarted && reflections.length === 0 && (
          <Text style={styles.noReflectionsText}>Noch keine früheren Reflexionen vorhanden.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  reflectionsContainer: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  
  reflectionItem: {
    borderColor: colors.midGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  noReflectionsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  deleteDataButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  deleteDataButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.white,
  },  
  cancelButton: {
    backgroundColor: colors.red,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  cancelButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: colors.midGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  startButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  pauseButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  timerAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  reflectionItem: {
    borderColor: colors.midGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  reflectionText: {
    fontSize: 16,
    color: colors.black,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  finishButton: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  finishButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default SelfReflectionScreen;
