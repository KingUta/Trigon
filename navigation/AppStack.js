import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import { AuthenticatedUserProvider } from '../providers/AuthenticatedUserProvider';
import { signOut } from '@firebase/auth';
import { auth } from '../config/firebase';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen'; // make sure you create this screen
import GrundBedürfnisse from '../screens/GnbScreen';
// import the other screens here

const Drawer = createDrawerNavigator();

export const AppStack = () => {

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  return (
    <AuthenticatedUserProvider>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        <Drawer.Screen name="Quiz" component={QuizScreen} />
        <Drawer.Screen name="GrundBedürfnisse" component={GrundBedürfnisse} />
        {/* Define your other screens here */}
        <Drawer.Screen 
          name="Logout" 
          children={() => <View><Button title="Logout" onPress={handleLogout} /></View>} 
        />
      </Drawer.Navigator>
    </AuthenticatedUserProvider>
  );
};