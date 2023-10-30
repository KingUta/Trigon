import 'dotenv/config';

export default {
  expo: {
    name: 'Trigon',
    slug: 'Trigon',
    privacy: 'public',
    platforms: ['ios', 'android'],
    version: '0.15.3',
    orientation: 'portrait',
    icon: './assets/Trigon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#173147'
    },
    updates: {
      fallbackToCacheTimeout: 1
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android:{
      package: 'com.nero.trigon',
      versionCode: 4,

    },
    extra: {
      eas: {
      projectId: '44e9918d-e039-4ab5-8c4e-1b2664bdfa2a'
      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
};
