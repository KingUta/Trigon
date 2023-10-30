import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, SafeAreaView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Colors } from '../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

const InfoButton = ({ animation }) => {
  const [modalVisible, setModalVisible] = useState(0);
  const infoTexts = [
    "Info zum Quiz: Willkommen, lieber User, bei Trigon! Diese App ist auf der Bedürfnispyramide aufgebaut und soll dir dabei helfen, deine Grundbedürfnisse aufzuarbeiten. Im Quiz findest du eine Reihe an Fragen, die dir helfen, zu ergründen, welche Bedürfnisse du bearbeiten solltest.",
    "Info zu Grundbedürfnissen: Lieber User, unter 'Grundbedürfnisse' kannst du deine Grundbedürfnisse bearbeiten. Zurzeit bieten wir einen Schlaftracker und einen Trinkreminder an. Das Ganze wird durch eine Achtsamkeits-Atemübung abgerundet.",
    "Info zu Sicherheitsbedürfnissen: Unter 'Sicherheitsbedürfnisse' findest du unseren Stimmungstracker, der dir dabei helfen soll, Stimmungen gekonnt zu dokumentieren, um zu einem späteren Zeitpunkt Maßnahmen darauf zu treffen. Im Journal findest du all deine Daten des Stimmungstrackers sowie auch die Funktion, Erinnerungen zu setzen, um dich daran zu erinnern, den Stimmungstracker zu verwenden.",
    "Info zu Sozialbedürfnissen: Unter 'Sozialbedürfnissen' findest du eine Mini-Anwendung, mit der du Fragen an dieses Netzwerk stellen kannst. Das Ganze ist anonym, deshalb solltest du keine Angst haben, Fragen zu stellen!",
    "Info zu Individualbedürfnissen: Unter 'Individualbedürfnissen' hast du die Möglichkeit, deine Ziele aufzulisten, damit du sie immer vor Augen hast. Es gibt auch einen Motivationsgenerator, der dir täglich motivierende Zitate generiert und zu deiner gewünschten Zeit als Benachrichtigung anzeigt.",
    "Info zur Selbstverwirklichung: Unter 'Selbstverwirklichung' kannst du mit der Podcast-App auf eine Reise gehen und dich selbst verwirklichen. Wir haben oben eine kleine Empfehlung für dich!"
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
    resizeMode: 'cover',
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