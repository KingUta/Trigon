import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config';
import { Logout } from '../components/Logout';

const HomeDrawer = createDrawerNavigator();

export const HomeScreen = () => {

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  return (
    <NavigationContainer independent={true}>
      <HomeDrawer.Navigator>
        {/* Add your screens here */}
        <HomeDrawer.Screen name="Logout" children={() => <View><Button title="Quiz" /></View>} />
        <HomeDrawer.Screen name="Logout2" children={() => <View><Button title="Fuck2" onPress={handleLogout} /></View>} />
      </HomeDrawer.Navigator>
    </NavigationContainer>
  );
};