import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Text, Modal } from 'react-native';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, where, getDocs,getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../config/theme';
import colors from '../constants/colors';


const NetzwerkScreen = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (search === '') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search, posts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe; 
  }, []);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const unsubscribe = onSnapshot(query(postsRef, orderBy('timestamp', 'desc')), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
  
    return () => unsubscribe();
  }, []);

  const addPost = async () => {
    if (!title || !content) {
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        timestamp: new Date(),
        owner: user.uid,
        upvotes: [],
        downvotes: [],
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const addComment = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const commentsRef = collection(db, 'comments');
  
      const docRef = await addDoc(commentsRef, {
        postId,
        comment,
        timestamp: new Date(),
        ownerId: user.uid,  
      });
  
      const postComments = comments[postId] || [];
      setComments({
        ...comments,
      });
  
      setComment('');
      updateDoc(postRef, { commentsCount: postComments.length + 1 });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteComment = async (postId, commentId, ownerId) => {
    if (!postId || !commentId || !ownerId) {
      console.error('One or more parameters are null or undefined');
      return;
    }

    if (ownerId !== user.uid) {
      alert('You can only delete your own comments');
      return;
    }

    try {
      const updatedComments = comments[postId].filter((c) => c.id !== commentId);
      setComments({
        ...comments,
        [postId]: updatedComments
      });

      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  const deletePost = async (postId, ownerId) => {
    console.log(`Attempting to delete post with id: ${postId} and ownerId: ${ownerId}`);
  
    if (!postId || !ownerId) {
      console.error('postId or ownerId is missing');
      return;
    }
  
    console.log(`Current user uid: ${user.uid}`);
  
    if (ownerId !== user.uid) {
      alert('You can only delete your own posts');
      return;
    }
  
    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      setSelectedPost(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const upvote = async (postId) => {
    console.log(`Running upvote function for post: ${postId}`);
    
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();
  
    
    let upvotesArray = Array.isArray(postData.upvotes) ? postData.upvotes : [postData.upvotes];
  
    console.log(`Current upvotes for post: ${upvotesArray.join('d, ')}`);
  
    let newUpvotes = [];
    if (upvotesArray.includes(user.uid)) {
  
      newUpvotes = upvotesArray.filter(uid => uid !== user.uid);
      console.log('User has already upvoted. Removing their upvote.');
    } else {
   
      newUpvotes = [...upvotesArray, user.uid];
      console.log('User has not upvoted yet. Adding their upvote.');
    }
  
    console.log(`New upvotes for post: ${newUpvotes.join(', ')}`);
  
    await updateDoc(postRef, { upvotes: newUpvotes });
  };
  


  const openThread = async (post) => {
    try {
      setSelectedPost(post);
      setModalVisible(true);

      const commentsRef = collection(db, 'comments');
      const postCommentsQuery = query(commentsRef, where('postId', '==', post.id));
      const commentsSnapshot = await getDocs(postCommentsQuery);

      const commentsData = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments({
        ...comments,
        [post.id]: commentsData,
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
};

  return (
    <View style={styles.container}>
     <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
            {selectedPost && (
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{selectedPost.title}</Text>
                    <Text style={styles.modalPostContent}>{selectedPost.content}</Text>
                    <Text style={styles.modalSubheading}>Comments:</Text>
                    {comments[selectedPost.id] && comments[selectedPost.id].length > 0 ? (
                        <FlatList
                        data={comments[selectedPost.id]}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentText}>{item.comment}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteComment(selectedPost.id, item.id, item.ownerId)} // Stellen Sie sicher, dass 'item.ownerId' hier übergeben wird
                                >
                                    <FontAwesome name="trash-o" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                    ) : (
                        <Text style={styles.emptyText}>No comments available</Text>
                    )}
                    {user.uid === selectedPost.owner && (
                        <View style={styles.ownerActions}>
                        <TouchableOpacity style={styles.deleteThreadButton} onPress={() => deletePost(selectedPost.id, selectedPost.owner)}>
                          <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <TouchableOpacity style={styles.closeModalButton}  onPress={() => setModalVisible(false)}>
                          <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
           
                        </View>
                    )}
                </View>
            </Modal>



      <TextInput
        style={styles.input}
        placeholder="Titel"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Inhalt"
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Suche..."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      
      
      <TouchableOpacity style={styles.Post2Button}  onPress={addPost} disabled={!title || !content} >
                          <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      

      {posts.length > 0 ? (
        <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => openThread(item)}>
              <Text style={styles.postTitle}>{item.title}</Text>
            </TouchableOpacity>
            <Text style={styles.postContent}>{item.content}</Text>
            {user.uid === item.owner && (
              <View style={styles.ownerActions}>
                
                <TouchableOpacity style={styles.DeletePostButton}  onPress={() => deletePost(item.id, item.owner)} >
                          <Text style={styles.buttonText}>Löschen</Text>
                </TouchableOpacity>
                
              </View>
            )}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => upvote(item.id)}
        >
          <MaterialCommunityIcons name="thumb-up-outline" size={20} color="#5372F0" />
          <Text style={styles.likeCount}>{item.upvotes?.length || 0}</Text>
        </TouchableOpacity>
        
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment"
            onChangeText={(text) => setComment(text)}
            value={comment}
          />
          <TouchableOpacity style={styles.AddButton} onPress={() => addComment(item.id)}disabled={!comment} >
            <Text style={styles.buttonText}>Add</Text>
           </TouchableOpacity>
   
        </View>
        {comments[item.id] && comments[item.id].length > 0 ? (
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{comments[item.id][0].comment}</Text>
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteComment(item.id, comments[item.id][0].id, comments[item.id][0].ownerId)}> 
                <FontAwesome name="trash-o" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.emptyText}>No comments available</Text>
        )}
      </View>
    )}
    keyExtractor={(item) => item.id}
  />
      ) : (
        <Text style={styles.emptyText}>No posts available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  postContainer: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: Colors.purple,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 6,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 2,
    padding: 10,
    borderRadius: 10,
 
    
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    backgroundColor: Colors.white,
  },
  commentText: {
    backgroundColor: colors.white,
    flex: 1,
    fontSize: 14,
    padding: 10,
    borderRadius: 10,
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.mediumGray,
  },
  modalContainer: {
    flex: 1,
    margin: 20,
  },
  modalContent: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: Colors.purple,
  },
  modalPostContent: {
    fontSize: 16,
    marginBottom: 2,
    marginTop: 2,
  },
  modalSubheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ownerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 10, 
    borderRadius: 10, 
  },
  deleteThreadButton: {
    backgroundColor: Colors.purple, 
    padding: 10, 
    borderRadius: 15, 
  },
  closeModalButton: {
    backgroundColor: Colors.purple, 
    padding: 10, 
    borderRadius: 15,
     
  },
  DeletePostButton: {
    backgroundColor: Colors.purple, 
    padding: 10, 
    borderRadius: 10,
     
  },

  AddButton: {
    backgroundColor: Colors.purple, 
    padding: 10, 
    borderRadius: 10,
     
  },
  Post2Button: {
    backgroundColor: Colors.purple, 
    padding: 10, 
    borderRadius: 10, 
  },
  buttonText: {
    color: 'white', 
    textAlign: 'center', 
  },
    searchBar: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 10,
    },

});


export default NetzwerkScreen;
