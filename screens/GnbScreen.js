import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GnbScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>GnbScreen</Text>
    </View>
  );
};

export default GnbScreen;