import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const SleepScreen = () => {
  const [sleepData, setSleepData] = useState([]);
  const [sleepQuality, setSleepQuality] = useState('');

  useEffect(() => {
    const sleepDataRef = collection(db, 'sleepData');
    const unsubscribe = onSnapshot(sleepDataRef, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setSleepData(data);
    });
    return () => unsubscribe();
  }, []);

  const addSleepData = async () => {
    try {
      await addDoc(collection(db, 'sleepData'), {
        sleepQuality,
      });
      setSleepQuality('');
    } catch (error) {
      console.error('Error adding sleep data:', error);
    }
  };

  const deleteSleepData = async (id) => {
    try {
      await deleteDoc(doc(db, 'sleepData', id));
    } catch (error) {
      console.error('Error deleting sleep data:', error);
    }
  };

  const renderSleepData = ({ item }) => (
    <View style={styles.sleepDataContainer}>
      <Text style={styles.sleepDataText}>Sleep Quality: {item.sleepQuality}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteSleepData(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Sleep Quality (1-10):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter sleep quality"
          onChangeText={(text) => setSleepQuality(text)}
          value={sleepQuality}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addSleepData}
          disabled={!sleepQuality}
        >
          <Text style={styles.addButtonLabel}>Add Sleep Data</Text>
        </TouchableOpacity>
      </View>
      {sleepData.length > 0 && (
        <FlatList
          data={sleepData}
          renderItem={renderSleepData}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  sleepDataContainer: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  sleepDataText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SleepScreen;
