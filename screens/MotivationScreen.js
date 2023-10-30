import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Linking, BackHandler } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { requestPermissionsAsync, scheduleNotificationAsync, cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import colors from '../constants/colors';

const MotivationScreen = ({navigation}) => {
  const [quote, setQuote] = useState('Laden...');
  const [author, setAuthor] = useState('Laden...');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed, navigating to individual');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Individualbedürfnisse' }],
      });
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove();
  }, [navigation]);



  const randomQuote = () => {
    setIsLoading(true);
    fetch('https://zenquotes.io/api/quotes/')
      .then((res) => res.json())
      .then((result) => {
        setQuote(result[0].q);
        setAuthor(result[0].a); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Fehler beim abrufen des Zitats:', error);
        setQuote('Lieber User leider ist der Zitat service momentan nicht verfügbar.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    randomQuote();
  }, []);

  const speakNow = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(quote + ' von ' + author, {
        language: 'de',
        pitch: 1.2,
        rate: 0.5,
      });
      setIsSpeaking(true);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(quote);
    Toast.show({
      type: 'erfolgreich',
      text1: 'Zitat kopiert!',
      visibilityTime: 2000,
    });
  };

  const tweetNow = () => {
    const url = 'https://twitter.com/intent/tweet?text=' + quote;
    Linking.openURL(url);
  };

  const scheduleDailyQuote = async () => {
    await requestPermissionsAsync();
    await cancelAllScheduledNotificationsAsync();

    scheduleNotificationAsync({
      content: {
        title: 'Tägliches Zitat',
        body: quote + ' - ' + author,
      },
      trigger: {
        seconds: 24 * 60 * 60,
        repeats: true,
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.purple }}>
      <StatusBar barStyle="light-content" />
      <View style={{ width: '90%', backgroundColor: colors.white, borderRadius: 20, padding: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: colors.black, marginBottom: 20 }}>
          Zitat des Tages
        </Text>
        <FontAwesome5 name="quote-left" style={{ fontSize: 20, marginBottom: -12 }} color={colors.black} />
        <Text
          style={{
            color: colors.black,
            fontSize: 16,
            lineHeight: 26,
            letterSpacing: 1.1,
            fontWeight: '400',
            textAlign: 'center',
            marginBottom: 10,
            paddingHorizontal: 30,
          }}
        >
          {quote}
        </Text>
        <FontAwesome5 name="quote-right" style={{ fontSize: 20, textAlign: 'right', marginTop: -20, marginBottom: 20 }} color={colors.black} />
        <Text style={{ textAlign: 'right', fontWeight: '300', fontStyle: 'italic', fontSize: 16, color: colors.black }}>
          —— {author}
        </Text>
        <TouchableOpacity
          onPress={randomQuote}
          style={{
            backgroundColor: isLoading ? 'rgba(83, 114, 240, 0.7)' : colors.purple,
            padding: 20,
            borderRadius: 30,
            marginVertical: 20,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center' }}>
            {isLoading ? 'Loading...' : 'Neues Zitat'}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            onPress={speakNow}
            style={{
              borderWidth: 2,
              borderColor: colors.purple,
              borderRadius: 50,
              padding: 15,
              backgroundColor: isSpeaking ? colors.blue : colors.white,
            }}
          >
            <FontAwesome name="volume-up" size={22} color={isSpeaking ? colors.white : colors.purple} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={{
              borderWidth: 2,
              borderColor: colors.purple,
              borderRadius: 50,
              padding: 15,
            }}
          >
            <FontAwesome5 name="copy" size={22} color={colors.purple} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={tweetNow}
            style={{
              borderWidth: 2,
              borderColor: colors.purple,
              borderRadius: 50,
              padding: 15,
            }}
          >
            <FontAwesome name="twitter" size={22} color={colors.purple} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={scheduleDailyQuote}
            style={{
              borderWidth: 2,
              borderColor: colors.purple,
              borderRadius: 50,
              padding: 15,
            }}
          >
            <FontAwesome name="clock-o" size={22} color={colors.purple} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MotivationScreen;
