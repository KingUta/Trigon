import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sicherheitsbedürfnisse = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Journal')}>
          <Image
            style={styles.image}
            source={require('../assets/journal.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Stimmung Tracker')}>
          <Image
            style={styles.image}
            source={require('../assets/stimmung.png')}
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

export default Sicherheitsbedürfnisse;
