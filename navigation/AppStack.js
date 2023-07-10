import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import { AuthenticatedUserProvider } from '../providers/AuthenticatedUserProvider';
import { signOut } from '@firebase/auth';
import { auth } from '../config/firebase';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen'; // make sure you create this screen
import GrundBedürfnisse from '../screens/GnbScreen';
import Individualbedürfnisse from '../screens/Individualbedürfnisse';
import Sozialebedürfnisse from '../screens/Sozialebedürfnisse';
import Sicherheitsbedürfnisse from '../screens/Sicherheitsbedürfnisse';
import Selbstverwirklichung from '../screens/Selbstverwirklichung';
import DrinkReminder from '../screens/DrinkReminder';
import AtemScreen from '../screens/AtemScreen';
import SleepScreen from '../screens/SleepScreen';
import NetzwerkScreen from '../screens/NetzwerkScreen';
import ZielJournal from '../screens/ZielJournal';
import MotivationScreen from '../screens/MotivationScreen';
import QuoteExplorer from '../screens/QuoteExplorer';
import SelbstReflexion from '../screens/SelbstReflexion';
import StimmungTracker from '../screens/StimmungTracker';
import Journal from '../screens/Journal';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import the other screens here

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

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
        <Drawer.Screen name="Sicherheitsbedürfnisse" component={Sicherheitsbedürfnisse} />
        <Drawer.Screen name="Sozialebedürfnisse" component={Sozialebedürfnisse} />
        <Drawer.Screen name="Individualbedürfnisse" component={Individualbedürfnisse} />
        <Drawer.Screen name="Selbstverwirklichung" component={Selbstverwirklichung} />
        <Drawer.Screen name="DrinkReminder" component={DrinkReminder} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Atem Übungen" component={AtemScreen} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="SleepTracker" component={SleepScreen} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Stimmung Tracker" component={StimmungTracker} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Journal" component={Journal} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Netzwerk" component={NetzwerkScreen} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Ziele" component={ZielJournal} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Motivation Generator" component={MotivationScreen} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Quote Generator" component={QuoteExplorer} options={{  drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Selbst Reflexion" component={SelbstReflexion} options={{  drawerItemStyle: { height: 0 } }} />
      
        {/* Define your other screens here */}
        <Drawer.Screen 
          name="Logout" 
          children={() => <View><Button title="Logout" onPress={handleLogout} /></View>} 
        />
      </Drawer.Navigator>
     
    </AuthenticatedUserProvider>
  );
};