import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import breathAnimation from '../assets/breath1.json';

const Atmung1 = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const animationRef = useRef(null);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    animationRef.current?.reset();
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    animationRef.current?.reset();
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>Guide</Text>
        </TouchableOpacity>
      </View>

      {isTimerRunning && (
        <CountdownCircleTimer
          isPlaying={isTimerRunning}
          duration={60}
          colors={[colors.purple]}
          onComplete={handleTimerComplete}
        >
          {({ remainingTime }) => (
            <Text style={styles.timerText}>{remainingTime}</Text>
          )}
        </CountdownCircleTimer>
      )}

      {isTimerRunning && (
        <LottieView
          ref={animationRef}
          source={breathAnimation}
          style={styles.animation}
          autoPlay
          loop
        />
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
          "Das hier ist eine kontrollierte Atemübung. Versuche, mit der Animation zu atmen, und kontrolliere deinen Atem. Diese Übung hilft dir dabei: Stress abzubauen, Stress zu managen, Migräne zu lindern und Angstzustände zu verringern."
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  animation: {
    width: 400,
    height: 300,
    marginTop: 20, 
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.purple,
  },
  button: {
    backgroundColor: colors.purple,
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default Atmung1;
