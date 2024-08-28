import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, FlatList, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { mockPosts } from '@/constants/testData';

export default function PostExpandedPage() {
  const params = useLocalSearchParams();
  const { id } = params;

  const clickedPost = mockPosts.find((post) => post.id === id)
  const [comment, setComment] = useState<string>('');

  const handlePostComment = () => {
    // Handle posting comment logic here
    setComment('');
  };

  const renderPostHeader = () => (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image source={{ uri: clickedPost?.avatar }} style={styles.avatar} />
        <View style={styles.userAction}>
          <ThemedText style={styles.user}>{clickedPost?.user}</ThemedText>
          <ThemedText style={styles.action}>{clickedPost?.action}</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.contentText}>{clickedPost?.content}</ThemedText>

        {clickedPost?.product.map((product, index) => (
          <FlatList
            horizontal
            data={product.imageUrl}
            renderItem={({ item, index }) => (
              <Image key={index} source={{ uri: item }} style={styles.postImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="thumbs-up-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{clickedPost?.likeCount || 0}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{clickedPost?.shareCount || 0}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{clickedPost?.bookmarkCount || 0}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.select({ ios: 65, android: 500 })}>
      <FlatList
        data={clickedPost?.comments || []}
        ListHeaderComponent={renderPostHeader}
        renderItem={({ item, index }) => (
          <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <ThemedText style={styles.commentorInfo}>{item.account}</ThemedText>
              <ThemedText style={styles.comment}>{item.comment}</ThemedText>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a comment..."
          value={comment}
          onChangeText={setComment}
          returnKeyType="send"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  post: {
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderColor: '#e8e8e8'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userAction: {
    marginLeft: 15,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  action: {
    color: '#888',
    marginTop: 5,
  },
  content: {
    marginBottom: 15,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  commentContent: {
    marginLeft: 10,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  commentorInfo: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  comment: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
});
