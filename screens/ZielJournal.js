import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Colors from "../constants/colors";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const auth = getAuth();

const createUserDocument = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const initialUserData = {
      userId: userId,
    };
    await setDoc(userDocRef, initialUserData);
    console.log('User document created in Firestore');
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

const List = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        createUserDocument(user.uid);
      }
    });
    return unsubscribe;
  }, []);

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
  

  useEffect(() => {
    if (user) {
      const todoRef = collection(db, `todos/${user.uid}/userTodos`);
      const subscriber = onSnapshot(todoRef, (snapshot) => {
        const todos = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setTodos(todos);
      });

      return () => subscriber();
    }
  }, [user]);

  const addTodo = async () => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, `todos/${user.uid}/userTodos`), {
          title: todo,
          done: false,
        });
        setTodo('');
        console.log('Document written with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  const renderTodo = ({ item }) => {
    const ref = doc(db, `todos/${user.uid}/userTodos/${item.id}`);

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    };

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done && <Ionicons name="md-checkmark-circle" size={32} color="green" />}
          {!item.done && <Entypo name="circle" size={32} color="black" />}
          <Text style={[styles.todoText, item.done && styles.done]}>{item.title}</Text>
        </TouchableOpacity>
        <FontAwesome name="trash-o" size={20} color="red" onPress={deleteItem}  />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Neues Ziel hinzufügen"
          onChangeText={(text) => setTodo(text)}
          value={todo}
        />
        <TouchableOpacity onPress={addTodo} style={styles.ZielButton} disabled={todo === ''}>
          <Text style={styles.ZielText}>Add</Text>
        </TouchableOpacity>
      </View>
      {todos.length > 0 && (
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(todo) => todo.id}
        />
      )}
    </View>
  );
};

const colors = {
  purple: '#6c5ce7',
  white: '#ffffff',
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20
  },
  form: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 0.8,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  },
  todo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 18
  },
  done: {
    textDecorationLine: 'line-through',
    color: 'gray'
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  ZielButton: {
    flex: 0.2,
    backgroundColor: Colors.purple,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 10,
  },
  ZielText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default List;
