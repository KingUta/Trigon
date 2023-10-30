import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';

import { View, StyleSheet, Text, TouchableOpacity, Modal, Alert, FlatList, Dimensions, ScrollView,BackHandler } from 'react-native';
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, deleteCollection, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../config/firebase';
import SleepModal from '../components/SleepModal';
import { Colors } from '../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SleepScreen = ({navigation}) => {
  const [sleepData, setSleepData] = useState([]);
  const [sleepQuality, setSleepQuality] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSleepData();
  }, []);

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

  const fetchSleepData = async () => {
    const sleepDataRef = collection(db, 'sleepData');
    const sleepDataQuery = query(
      sleepDataRef,
      orderBy('date', 'desc') 
    );

    try {
      const unsubscribe = onSnapshot(sleepDataQuery, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setSleepData(data);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    }
  };

  const addSleepData = async () => {
    const sleepQualityRegex = /^[1-9]|/;

    if (!sleepQuality || !sleepQualityRegex.test(sleepQuality)) {
      Alert.alert('Invalid Sleep Quality', 'Please enter a value between 1 and 9.');
      return;
    }

    try {
      await addDoc(collection(db, 'sleepData'), {
        sleepQuality: Number(sleepQuality),
        date: new Date(),
      });
      setSleepQuality('');

      // Get sleep tips based on the new sleep quality data
      const tips = getSleepTips(Number(sleepQuality));
      Alert.alert('Sleep Tips', tips);
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

  const deleteAllSleepData = async () => {
    try {
      const sleepDataRef = collection(db, 'sleepData');
      const querySnapshot = await getDocs(sleepDataRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error deleting all sleep data:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getSleepTips = (sleepQuality) => {
    // Define sleep tips based on sleep quality
    if (sleepQuality >= 9) {
      return "Dein Schlaf ist echt Bombe, Echt toll weiter so!";
    
    } else if (sleepQuality >= 7) {
      return "Sie haben eine anständige Schlafqualität. Versuchen Sie, jeden Tag zur gleichen Zeit ins Bett zu gehen, somit kann dein schlaf verbessert werden.";
    }
     else if (sleepQuality >= 5) {
      return "Du schläfst so lala. Probier mal, 'ne Stunde früher ins Bett zu gehen, und leg das Handy weg! "
    } 
    else if (sleepQuality >= 3) {
      return "Dein Schlaf ist echt nicht on fleek. Chill mal vor dem Schlafen mit 'ner guten Musik oder 'nem Buch. Forget Netflix für heute Abend!";
    }
    else if (sleepQuality >= 2) {
      return "Alter, dein Schlaf ist im Keller! Du brauchst 'ne Schlaf-Revolution. Kein Energy-Drink nach 6, und das Gaming zumindest eine Stunde vor dem Bett!";
    }
    else {
      return "Dein Schlaf ist echt im Eimer, Alter. Zeit, das Ganze umzukrempeln. Lass mal das Cola weg, und die Snacks vorm Bett auch. Und hey, mehr Chillen, weniger Stressen. #GetSomeRest";
    }
    
    
  };

  const chartData = sleepData.map((data) => {
    const date = data.date.toDate(); 
    return {
      date: date.toLocaleDateString('de-DE'),
      sleepQuality: data.sleepQuality,
    };
  });
  
  

  const renderSleepData = ({ item }) => (
    <View style={styles.sleepDataContainer}>
      <Text style={styles.sleepDataText}>Schlaf Qualität: {item.sleepQuality}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSleepData(item.id)}>
        <Text style={styles.deleteButtonText}>Löschen</Text>
      </TouchableOpacity>
    </View>
  );

  const handleInfoButton = () => {
    
    Alert.alert(
      'Warum der Sleep Tracker der Hammer ist',
      'Schlaf ist nicht nur zum Erholen da. Wenn du gut pennst, läuft dein Tag wie geschmiert. Aber wie checkst du, ob dein Schlaf wirklich on point ist? Da kommt der Sleep Tracker ins Spiel!\n\nMit diesem Ding kannst du deinen Schlaf wie ein Profi tracken. Du siehst, wie lange du schläfst, wie gut du schläfst, und wann du schläfst. Kein Rätselraten mehr, ob du genug Schlaf bekommst – die Fakten liegen auf dem Tisch.\n\nBist du mal platt und müde? Der Sleep Tracker hilft dir, das Problem zu finden. Vielleicht schläfst du zu wenig oder immer zu verschiedenen Zeiten. Mit den Daten kannst du das ändern und wieder voller Energie durchstarten.\n\nUnd das Beste? Du bekommst sogar Tipps, wie du deinen Schlaf verbessern kannst. Egal, ob du ein Frühaufsteher oder Nachteule bist, der Sleep Tracker zeigt dir, wie du das Beste aus deinem Schlaf rausholst. Mach dich bereit, deinen Tag zu rocken!'
    );
    

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Schlaf Qualität (1-9):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Füge deine Schlafqualität ein"
          onChangeText={(text) => setSleepQuality(text)}
          value={sleepQuality}
        />
        <TouchableOpacity
          style={[styles.addButton, !sleepQuality && styles.addButtonDisabled]}
          onPress={addSleepData}
          disabled={!sleepQuality}
        >
          <Text style={styles.addButtonLabel}>Schlafdaten hinzufügen</Text>
        </TouchableOpacity>
      </View>
      {sleepData.length > 0 && (
        <View>
          
          <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllSleepData}>
            <Text style={styles.deleteAllButtonText}>Lösche alle Daten</Text>
          </TouchableOpacity>
          <Modal visible={showModal} animationType="slide" onRequestClose={closeModal}>
            <SleepModal visible={showModal} sleepData={sleepData} closeModal={closeModal} />
          </Modal>
        </View>
      )}
      <TouchableOpacity style={styles.infoButton} onPress={handleInfoButton}>
        <MaterialCommunityIcons name="information-outline" size={24} color="black" />
      </TouchableOpacity>
      {sleepData.length > 0 && (
        <ScrollView horizontal={true}>
          <LineChart
            data={{
              
              labels: chartData.map((data) => data.date),
              
              datasets: [
                {
                  data: chartData.map((data) => data.sleepQuality),
                },
              ],
            }}
            width={Dimensions.get('window').width * chartData.length / 3}
            height={320}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 0,
              bezier: 1,
              color: () => Colors.blue,
              labelColor: () => Colors.black,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.white,
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
    borderColor: Colors.midGrey,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: Colors.purple,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonLabel: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  viewGraphButton: {
    backgroundColor: Colors.purple,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  viewGraphButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  deleteAllButton: {
    backgroundColor: Colors.red,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteAllButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  sleepDataContainer: {
    backgroundColor: Colors.lightGrey,
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  sleepDataText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  chart: {
    marginTop: 20,
    borderRadius: 18,
  },
  infoButton: {
    alignItems: 'flex-end',
  },
  sleepDataList: {
    marginTop: 20,
  },
});

export default SleepScreen;
