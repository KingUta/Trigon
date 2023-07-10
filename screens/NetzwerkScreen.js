import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { collection, addDoc, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

const NetzwerkScreen = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  const addPost = async () => {
    if (text.trim() !== '') {
      try {
        await addDoc(collection(db, 'posts'), { text, timestamp: new Date() });
        setText('');
      } catch (error) {
        console.error('Error adding post: ', error);
      }
    }
  };

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        onChangeText={(text) => setText(text)}
        value={text}
      />
      <Button onPress={addPost} title="Post" disabled={text.trim() === ''} />

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        style={styles.postList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  postList: {
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  postText: {
    fontSize: 16,
  },
});
export default NetzwerkScreen;