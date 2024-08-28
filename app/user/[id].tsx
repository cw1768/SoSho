import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, FlatList, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { useLocalSearchParams } from "expo-router";

import { ThemedView } from '@/components/ThemedView';
import { mockPosts } from '@/constants/testData';
import { ThemedText } from '@/components/ThemedText';

export default function PostExpandedPage() {
  const params = useLocalSearchParams();
  const { id } = params;

  const clickedPost = mockPosts.find((post) => post.id === id)
  const [comment, setComment] = useState<string>('');


  if (!clickedPost?.user) {
    return <ThemedText>User not found</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: clickedPost.avatar }} style={styles.avatar} />
      <ThemedText style={styles.name}>{clickedPost.user}</ThemedText>
      {/* Add other user information as needed */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});
