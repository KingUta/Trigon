import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { doc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ThreadComponent = ({ thread, currentUser, comments, setComments }) => {
  const [comment, setComment] = useState('');

  const addComment = async () => {
    try {
      const postRef = doc(db, 'posts', thread.id);
      const commentsRef = collection(db, 'comments');

      const docRef = await addDoc(commentsRef, {
        postId: thread.id,
        comment,
        timestamp: new Date(),
        likes: 0,
        owner: currentUser.uid,
      });

      const postComments = comments[thread.id] || [];
      setComments({
        ...comments,
        [thread.id]: [...postComments, { id: docRef.id, comment, likes: 0, owner: currentUser.uid }],
      });

      setComment('');
      updateDoc(postRef, { commentsCount: postComments.length + 1 });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likeComment = async (commentId, likes) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      updateDoc(commentRef, { likes: likes + 1 });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const unlikeComment = async (commentId, likes) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      updateDoc(commentRef, { likes: likes - 1 });
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);

      const postComments = comments[postId] || [];
      const updatedComments = postComments.filter((c) => c.id !== commentId);
      setComments({
        ...comments,
        [postId]: updatedComments,
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <View>
      <Text style={styles.threadTitle}>{thread.title}</Text>
      <Text style={styles.threadContent}>{thread.content}</Text>

      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Add" onPress={addComment} />
      </View>

      {comments[thread.id] && comments[thread.id].length > 0 ? (
        <View>
          {comments[thread.id].map((comment) => (
            <View style={styles.commentContainer} key={comment.id}>
              <Text style={styles.commentText}>{comment.comment}</Text>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => {
                  if (comment.likes > 0) {
                    unlikeComment(comment.id, comment.likes);
                  } else {
                    likeComment(comment.id, comment.likes);
                  }
                }}
              >
                <FontAwesome
                  name={comment.likes > 0 ? 'thumbs-up' : 'thumbs-o-up'}
                  size={20}
                  color={comment.likes > 0 ? '#5372F0' : 'black'}
                />
                <Text style={styles.likeCount}>{comment.likes}</Text>
              </TouchableOpacity>
              {currentUser.uid === comment.owner && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteComment(thread.id, comment.id)}
                >
                  <FontAwesome name="trash-o" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text>No comments</Text>
      )}
    </View>
  );
};

const KommentarComponent = ({ comments, deleteComment }) => {
  const likeComment = async (commentId, likes) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      updateDoc(commentRef, { likes: likes + 1 });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const unlikeComment = async (commentId, likes) => {
    try {
      const commentRef = doc(db, 'comments', commentId);
      updateDoc(commentRef, { likes: likes - 1 });
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  return (
    <View>
      {comments.map((comment) => (
        <View style={styles.commentContainer} key={comment.id}>
          <Text style={styles.commentText}>{comment.comment}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => {
              if (comment.likes > 0) {
                unlikeComment(comment.id, comment.likes);
              } else {
                likeComment(comment.id, comment.likes);
              }
            }}
          >
            <FontAwesome
              name={comment.likes > 0 ? 'thumbs-up' : 'thumbs-o-up'}
              size={20}
              color={comment.likes > 0 ? '#5372F0' : 'black'}
            />
            <Text style={styles.likeCount}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteComment(comment.postId, comment.id)}
          >
            <FontAwesome name="trash-o" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  threadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  threadContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  commentText: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
});

export { ThreadComponent, KommentarComponent };
