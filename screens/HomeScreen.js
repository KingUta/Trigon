import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Colors } from '../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

const InfoButton = ({ animation }) => {
  const [modalVisible, setModalVisible] = useState(0);
  const infoTexts = [
    "Info zu Quiz, Willkommen lieber User auf Trigon diese App ist auf der Bedürfnisspyramide aufgebaut! Es soll dir dabei helfen deine Grundbedürfnisse aufzuarbeiten. Im Quiz findest du eine reihe an Fragen die dir helfen zu ergründen welche Bedürfnisse du aufarbeiten solltest!",
    "Info zu Grundbedürfniss, Lieber User unter Grundbedürfnisse kannst du deine Grundbedürfnisse auf arbeiten zurzeit haben wir eine Schlaftracker und eine Trinkreminder das ganze rundet eine Achstamkeit Atem Übung ab ",
    "Info zu Sicherheitsbedürfnisse findest du unseren Stimmungstracker der soll dir dabei helfen, stimmungen gekonnt zu Dokumentieren um in einem Späteren zeitpunkt massnahmen darauf zu Treffen, im Journal findest du all deine Daten des Stimmungstrackers sowie auch die Funktion Erinnerungen zu setzen um dich daran zu erinnern Stimmungstracker zu werden",
    "Info zu Sozialebedürnisse, unter sozialbedürfnisse findes du eine Minianwendung wo du Fragen and dieses Netzwerk stellen kannst, das ganze ist Anonym deshalb solltest du keine Angst haben Fragen zu stellen!",
    "Info zu Individualbedürfnisse, unter Individualbedürfnisse hast du die Möglichkeit deine Ziele aufzulisten, damit du Sie immer vor augen hast, es gibt da auch einen Motivationsgenerator der dir Täglich Motivierende Zitate generiert und zu deiner Gewünschten Zeit als Benachrichtigung anzeigt",
    "Info zu Selbstverwirklichung, unter Selbstverwirklichung kannst du mit der Podcastapp auf eine Reise gehen und dich Selbstverwirklichen, wir haben zuoberst eine kleine Recomendation!"
  ];

  return (
    <View>
      <TouchableOpacity 
        style={styles.infoButtonHome}
        onPress={() => setModalVisible(1)}
      >
        <MaterialCommunityIcons name="information-outline" size={24} color="black" />
      </TouchableOpacity>

      {[1, 2, 3, 4, 5, 6].map((modalNumber) => (
        <Modal
          key={modalNumber}
          animationType="fade"
          transparent={true}
          visible={modalVisible === modalNumber}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <LottieView
                source={animation}
                autoPlay
                loop
                style={styles.animation}
              />
              <Text style={styles.modalText}>{infoTexts[modalNumber - 1]}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(modalNumber === 5 ? 0 : modalVisible + 1);
                }}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ))}
    </View>
  );
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const checkDayNight = () => {
      const currentHour = new Date().getHours();
      setIsDay(currentHour >= 6 && currentHour < 18);
    };
    checkDayNight();
    const interval = setInterval(checkDayNight, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isDay ? (
        <LottieView
          source={require('../assets/daysky2.json')}
          autoPlay
          loop
          style={styles.skyanimation}
        />
      ) : (
        <LottieView
          source={require('../assets/nightsky2.json')}
          autoPlay
          loop
          style={styles.skyanimation}
        />
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.quizButtonText}>Quiz</Text>
        </TouchableOpacity>
        <ScrollView>
          <View>
            <InfoButton
              infoText="Info zu Selbstverwirklichung..."
              animation={require('../assets/owl.json')}
            />
          </View>
 
         <View> 
            <TouchableOpacity onPress={() => navigation.navigate('Selbstverwirklichung')}>
              <Image style={styles.bilder1} source={require('../assets/Selbstverwirklichung.png')} />
            </TouchableOpacity>
      
            <TouchableOpacity onPress={() => navigation.navigate('Individualbedürfnisse')}>
              <Image style={styles.bilder2} source={require('../assets/Individual.png')} />
            </TouchableOpacity>
      
            <TouchableOpacity onPress={() => navigation.navigate('Sozialebedürfnisse')}>
              <Image style={styles.bilder3} source={require('../assets/Sozial.png')} />
            </TouchableOpacity>
      
            <TouchableOpacity onPress={() => navigation.navigate('Sicherheitsbedürfnisse')}>
              <Image style={styles.bilder4} source={require('../assets/Sicherheit.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bilder5} onPress={() => navigation.navigate('GrundBedürfnisse')}>
              <Image style={styles.bilder1} source={require('../assets/Grundbedürfnisse.png')} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
        
  },
  bilder1: {
    flex: 1,
    resizeMode: 'center',
    width: 350,
    height: 100,
    marginBottom: 0,
    marginTop: 30,
    marginVertical: -30,
  },
  bilder2: {
    resizeMode: 'center',
    width: 360,
    height: 100,
    marginBottom: 10, 
    marginTop: 10, 
    marginVertical: -30,
  },
  bilder3: {
    resizeMode: 'center',
    width: 355,
    height: 100,
    marginBottom: 0, 
    marginTop: 10, 
    marginVertical: -30,
  },
  bilder4: {
    resizeMode: 'center',
    width: 360,
    height: 150,
    marginBottom: 0, 
    marginTop: 10, 
    marginVertical: 0,
  },
  bilder5: {
    resizeMode: 'center',
    width: 350,
    height: 380,
    marginLeft: 2,
    
    marginBottom: 0, 
    marginTop: -60, 

  },
  Button1: {
    margin: 'center',

  },
  skyanimation: {
    ...StyleSheet.absoluteFillObject,
  },

  quizButton: {
    backgroundColor: Colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  quizButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: 'bold',
  },
  infoButtonHome: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    padding: 8,
    zIndex: 9999,

  }

});