import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text } from 'react-native';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../config/firebase'; // Update this with your path
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Entypo from 'react-native-vector-icons/Entypo';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const List = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      const todoRef = collection(db, `todos/${user.uid}/userTodos`);
      const subscriber = onSnapshot(todoRef, snapshot => {
        const todos = [];
        snapshot.docs.forEach(doc => {
          todos.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setTodos(todos);
      });

      return () => subscriber(); // Unsubscribe on unmount
    }
  }, [user]); // This will re-run whenever `user` changes

  const addTodo = async () => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, `todos/${user.uid}/userTodos`), {
          title: todo,
          done: false,
        });
        setTodo('');
        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
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
          <Text style={styles.todoText}>{item.title}</Text>
        </TouchableOpacity>
        <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
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
        <Button onPress={addTodo} title="Ziel Adden" disabled={todo === ''} />
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
    flex: 1,
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
    paddingHorizontal: 4
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4
  }
});

export default List;
