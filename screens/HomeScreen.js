import React from 'react';
import { Button, View, TouchableOpacity, Image, StyleSheet,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button  stlye={StyleSheet.Button1}
    title="Quiz" 
    onPress={() => navigation.navigate('Quiz')} 
  />
  <ScrollView>
 
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
</SafeAreaView>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  bilder1: {
    flex: 1,
    resizeMode: 'center',
    width: 350,
    height: 100,
    marginBottom: 0, // Verwenden Sie CamelCase für marginBottom
    marginTop: 30, // Verwenden Sie CamelCase für marginTop
    marginVertical: -30,
  },
  bilder2: {
    resizeMode: 'center',
    width: 360,
    height: 100,
    marginBottom: 10, // Verwenden Sie CamelCase für marginBottom
    marginTop: 10, // Verwenden Sie CamelCase für marginTop
    marginVertical: -30,
  },
  bilder3: {
    resizeMode: 'center',
    width: 355,
    height: 100,
    marginBottom: 0, // Verwenden Sie CamelCase für marginBottom
    marginTop: 10, // Verwenden Sie CamelCase für marginTop
    marginVertical: -30,
  },
  bilder4: {
    resizeMode: 'center',
    width: 360,
    height: 150,
    marginBottom: 0, // Verwenden Sie CamelCase für marginBottom
    marginTop: 10, // Verwenden Sie CamelCase für marginTop
    marginVertical: 0,
  },
  bilder5: {
    resizeMode: 'center',
    width: 360,
    height: 370,
    
    marginBottom: 0, // Verwenden Sie CamelCase für marginBottom
    marginTop: -60, // Verwenden Sie CamelCase für marginTop

  },
  Button1: {
    margin: 'center',

  },

});