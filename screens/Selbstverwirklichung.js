import React from 'react';
import { useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, BackHandler } from 'react-native';



const Selbstverwirklichung = ({navigation}) => {


  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed, navigating to Home');
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Podcasts')}>
          <Image
            style={styles.image}
            source={require('../assets/Podcast.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Selbst Reflexion')}>
          <Image
            style={styles.image}
            source={require('../assets/reflexion.png')}
          />
        </TouchableOpacity>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 15,
    margin: 10,
    marginTop: 15,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});

export default Selbstverwirklichung;
