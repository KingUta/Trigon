import React, { useState, useEffect} from 'react';
import { View, StyleSheet, Text, Button, Switch, Alert, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../config/theme';
import { requestPermissionsAsync, scheduleNotificationAsync, cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import { collection, doc, updateDoc, onSnapshot, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import colors from '../constants/colors';

const DrinkReminder = ({navigation}) => {
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
    const backAction = () => {
      console.log('Back button pressed, navigating to GNBScreen');
      navigation.reset({
        index: 0,
        routes: [{ name: 'GrundBedürfnisse' }],
      });
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
       
        const userId = user.uid;
        const userDocumentRef = doc(db, 'users', userId); 

        const unsubscribeSnapshot = onSnapshot(userDocumentRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setDrinkReminder(userData.drinkReminder || {});
          }
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, 'users', userId); 
  
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            const userDrinkReminder = userData.drinkReminder?.settings || {};
  
            if (userDrinkReminder.startTime) {
              setStartTime(new Date(userDrinkReminder.startTime));
            }
            if (userDrinkReminder.endTime) {
              setEndTime(new Date(userDrinkReminder.endTime));
            }
            if (userDrinkReminder.interval) {
              setInterval(userDrinkReminder.interval.toString());
            }
            if (userDrinkReminder.isEnabled !== undefined) {
              setIsEnabled(userDrinkReminder.isEnabled);
            }
          }
        });
  
        return () => {
          unsubscribeSnapshot(); 
        };
      }
    });
  
    return () => {
      unsubscribe(); 
    };
  }, []);
  

  useEffect(() => {
    if (isEnabled) {
      const intervalInMinutes = parseInt(interval, 10);
      const currentTime = new Date();
      const triggerTimes = [];
      const futureTime = new Date(startTime); 

     
      while (futureTime < endTime) {
        if (futureTime > currentTime) {
          triggerTimes.push(new Date(futureTime)); 
        }
        futureTime.setMinutes(futureTime.getMinutes() + intervalInMinutes);
      }

  
      cancelAllScheduledNotificationsAsync();

    
      triggerTimes.forEach((triggerTime, index) => {
        console.log(`Scheduled Notification ${index + 1} for: ${triggerTime}`);
        scheduleNotificationAsync({
          content: {
            title: 'Drink Reminder',
            body: 'Es ist Zeit wieder etwas zu Trinken!',
          },
          trigger: triggerTime,
        });
      });
    } else {
 
      cancelAllScheduledNotificationsAsync();
    }
  }, [isEnabled, interval, startTime, endTime]);

  const saveReminder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const intervalInMinutes = parseInt(interval, 10);

      await updateDoc(userRef, {
        'drinkReminder.settings': {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          interval: intervalInMinutes,
          isEnabled: isEnabled,
        },
      });

      Alert.alert('Drink Reminder', 'Reminder-Einstellungen erfolgreich angepasst.');
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Reminder-Einstellungen: ', error);
      Alert.alert('Drink Reminder', 'Speichern der Einstellungen fehlgeschlagen, versuchen Sie es noch einmal.');
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
        <Text style={styles.label}>Reminder setzen?</Text>
        <Switch
          trackColor={{ false: Colors.mediumGray, true: Colors.purple }}
          thumbColor={isEnabled ? Colors.orange : Colors.midGrey}
          ios_backgroundColor={Colors.lightGrey}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
        <Text style={styles.saveButtonText}>Reminder speichern</Text>
      </TouchableOpacity>
      

      <Text style={styles.reminderStatus}>
        {isEnabled ? 'Erinnerung Ein' : 'Erinnerung Aus'}
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
