import React,{useEffect} from 'react';
import { View, StyleSheet, Text, TouchableOpacity,BackHandler } from 'react-native';
import colors from '../constants/colors';

const AtemScreen = ({ navigation }) => {
  // Function to navigate to the Guided Breath Technique Screen
  const navigateToGuidedBreathTechnique = (breathTechnique) => {
    navigation.navigate('GuidedBreathTechnique', { breathTechnique });
  };

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.breathTechniqueButton}
        onPress={() => navigation.navigate('Atmung1', { breathTechnique: 'Ruhiges Atmen' })}
      >
        <Text style={styles.breathTechniqueButtonText}>kontrollierte Atmung</Text>
      </TouchableOpacity>
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathTechniqueButton: {
    backgroundColor: colors.purple,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  breathTechniqueButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AtemScreen;
