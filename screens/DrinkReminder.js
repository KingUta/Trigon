import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Switch, Alert, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../config/theme';
import { requestPermissionsAsync, scheduleNotificationAsync, cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import { collection, doc, updateDoc, onSnapshot, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Make sure to import your Firebase config
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import colors from '../constants/colors';

const DrinkReminder = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [interval, setInterval] = useState('1'); // Default interval is set to 5 minutes
  const [isEnabled, setIsEnabled] = useState(false);
  const [drinkReminder, setDrinkReminder] = useState({});
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, you can access the user ID as user.uid
        const userId = user.uid;
        const userRef = doc(db, 'users', userId);

        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setDrinkReminder(userData.drinkReminder || {});
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        Alert.alert(
          'Notification Rechte werden benötigt',
          'Please enable notifications in the device settings to receive reminders.'
        );
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isEnabled) {
      const intervalInMinutes = parseInt(interval, 10);
      const currentTime = new Date();
      const triggerTimes = [];
      const futureTime = new Date(startTime); // Start from the chosen start time

      // Loop to generate trigger times every `intervalInMinutes` minutes until the end time is reached
      while (futureTime < endTime) {
        if (futureTime > currentTime) {
          triggerTimes.push(new Date(futureTime)); // Create a new Date object here
        }
        futureTime.setMinutes(futureTime.getMinutes() + intervalInMinutes);
      }

      // Clear any previous notifications
      cancelAllScheduledNotificationsAsync();

      // Schedule notifications at trigger times
      triggerTimes.forEach((triggerTime, index) => {
        console.log(`Scheduled Notification ${index + 1} for: ${triggerTime}`);
        scheduleNotificationAsync({
          content: {
            title: 'Drink Reminder',
            body: 'Time to have a drink!',
          },
          trigger: triggerTime,
        });
      });
    } else {
      // Disable the reminder, so clear all scheduled notifications
      cancelAllScheduledNotificationsAsync();
    }
  }, [isEnabled, interval, startTime, endTime]);

  const saveReminder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        return; // Exit if the user is not authenticated
      }

      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const drinkReminderRef = collection(userRef, 'drinkReminder');
      const settingsRef = doc(drinkReminderRef, 'settings');
      const intervalInMinutes = parseInt(interval, 10);

      await updateDoc(settingsRef, {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        interval: intervalInMinutes,
        isEnabled: isEnabled,
      });

      Alert.alert('Drink Reminder', 'Reminder settings saved successfully.');
    } catch (error) {
      console.error('Error updating reminder settings: ', error);
      Alert.alert('Drink Reminder', 'Failed to save reminder settings. Please try again.');
    }
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const handleStartTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setStartTime(selectedTime);
    }
    setStartTimePickerVisible(false);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setEndTime(selectedTime);
    }
    setEndTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Zeit</Text>
      <TouchableOpacity style={styles.timePickerButton} onPress={showStartTimePicker}>
        <Text>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {startTimePickerVisible && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      <Text style={styles.label}>Ende</Text>
      <TouchableOpacity style={styles.timePickerButton} onPress={showEndTimePicker}>
        <Text>{endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {endTimePickerVisible && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      {isEnabled && (
        <>
          <Text style={styles.label}>Interval (in minuten)</Text>
          <TextInput
            style={styles.input}
            placeholder="z.B., 5"
            value={interval}
            onChangeText={text => setInterval(text)}
            keyboardType="numeric"
          />
        </>
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Reminder</Text>
        <Switch
          trackColor={{ false: Colors.mediumGray, true: Colors.purple }}
          thumbColor={isEnabled ? Colors.orange : Colors.midGrey}
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
        <Text style={styles.saveButtonText}>Save Reminder</Text>
      </TouchableOpacity>
      

      <Text style={styles.reminderStatus}>
        {isEnabled ? 'Reminder Enabled' : 'Reminder Disabled'}
      </Text>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timePickerButton: {
    width: '100%',
    padding: 10,
    borderColor: Colors.purple,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reminderStatus: {
    fontSize: 16,
    marginTop: 10,
  },
  saveReminder: {
    width: '100%',
    padding: 10,
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DrinkReminder;
