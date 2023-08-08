import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Alert, Platform, Switch } from 'react-native';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, collection } from 'firebase/firestore';
import { orderBy } from 'lodash';
import { requestPermissionsAsync, scheduleNotificationAsync, cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from "../constants/colors";

const JournalScreen = () => {
  const [userEntries, setUserEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, `moods/${user.uid}/userMoods`), snapshot => {
        const entries = snapshot.docs.map(doc => {
          const entryData = doc.data();
          return {
            id: doc.id,
            ...entryData,
          };
        });

        const sortedEntries = orderBy(entries, ['createdAt'], ['desc']);
        setUserEntries(sortedEntries);
      });

      return unsubscribe;
    }
  }, [user]);

  const toggleSwitch = () => {
    if (reminderEnabled) {
      cancelAllScheduledNotificationsAsync();
    }
    setReminderEnabled(previousState => !previousState);
  };

  const scheduleReminder = () => {
    if (reminderEnabled) {
      requestPermissionsAsync().then(({ granted }) => {
        if (!granted) {
          Alert.alert(
            'Notification permissions required',
            'Please enable notifications in the device settings to receive reminders.'
          );
        } else {
          scheduleNotificationAsync({
            content: {
              title: 'Journal Reminder',
              body: 'Don\'t forget to fill in your mood tracker for today!',
            },
            trigger: reminderTime,
          });

          setModalVisible(false);
        }
      });
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleOpenDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowDatePicker(Platform.OS === 'ios');
    setReminderTime(currentDate);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Set a reminder to use the mood tracker!</Text>
            <Switch
              trackColor={{ false: Colors.gray, true: Colors.purple }}
              thumbColor={reminderEnabled ? Colors.white : Colors.purple}
              onValueChange={toggleSwitch}
              value={reminderEnabled}
            />
            {showDatePicker && (
              <DateTimePicker
                value={reminderTime}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <TouchableOpacity
              style={[styles.button, {backgroundColor: Colors.purple}]}
              onPress={handleOpenDatePicker}
            >
              <Text style={styles.textStyle}>Choose Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: Colors.purple}]}
              onPress={scheduleReminder}
            >
              <Text style={styles.textStyle}>Set Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: Colors.purple}]}
              onPress={handleCloseModal}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: Colors.purple}]}
        onPress={handleOpenModal}
      >
        <Text style={styles.textStyle}>Set Reminder</Text>
      </TouchableOpacity>

      {userEntries.map(entry => (
        <View key={entry.id} style={styles.entry}>
          <Text style={styles.dateText}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.moodText}>Stimmung: {entry.mood}</Text>
          <Text style={styles.reasonText}>Grund: {entry.reason}</Text>
          <Text style={styles.noteText}>Notitzen: {entry.textInput}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  openButton: {
    backgroundColor: Colors.purple,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: Colors.purple,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  entry: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodText: {
    marginTop: 10,
  },
  reasonText: {
    marginTop: 10,
  },
  noteText: {
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JournalScreen;
