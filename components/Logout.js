import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config';

export const Logout = ({ navigation }) => {
  useEffect(() => {
    signOut(auth)
      .then(() => {
        // Sign-out successful, navigate to any screen you want, maybe "Login"?
        navigation.navigate('Login');  // Replace 'Login' with your actual login screen name
      })
      .catch(error => console.log('Error logging out: ', error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Signing Out...</Text>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});