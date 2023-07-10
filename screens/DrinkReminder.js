import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TextInput, Switch, Alert } from 'react-native';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const DrinkReminder = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [drinkReminder, setDrinkReminder] = useState({});

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    const userId = 'YOUR_USER_ID'; // Replace with your user ID
    const drinkReminderRef = doc(db, 'drinkReminder', userId);

    const unsubscribe = onSnapshot(drinkReminderRef, (doc) => {
      if (doc.exists()) {
        setDrinkReminder(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const saveReminder = async () => {
    const userId = 'YOUR_USER_ID'; // Replace with your user ID
    const drinkReminderRef = doc(db, 'drinkReminder', userId);

    try {
      await updateDoc(drinkReminderRef, {
        startTime: startTime,
        endTime: endTime,
        interval: interval,
        isEnabled: isEnabled,
      });
      Alert.alert('Drink Reminder', 'Reminder settings saved successfully.');
    } catch (error) {
      console.error('Error updating reminder settings: ', error);
      Alert.alert('Drink Reminder', 'Failed to save reminder settings. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.label}>End Time</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM AM/PM"
        value={endTime}
        onChangeText={setEndTime}
      />

      <Text style={styles.label}>Interval (in minutes)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 60"
        value={interval}
        onChangeText={setInterval}
        keyboardType="numeric"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Reminder</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <Button title="Save Reminder" onPress={saveReminder} />

      <Text style={styles.reminderStatus}>
        {isEnabled ? 'Reminder Enabled' : 'Reminder Disabled'}
      </Text>

      <Text style={styles.reminderStatus}>
        Next Reminder: {drinkReminder.nextReminder || 'No upcoming reminder'}
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
});

export default DrinkReminder;
