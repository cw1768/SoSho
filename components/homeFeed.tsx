import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, ListRenderItem, Text, View, Alert, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Post } from '@/constants/types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons';

interface FeedProps {
  session: Session
}

type PostParam = { id: any, date: any; link: any; review: any; pros: any; cons: any; images: any; recommend: any; likes: any; }
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const HomeFeed: React.FC<FeedProps> = ({session}) => {
  const [posts, setPosts] = useState<PostParam[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session) getPosts()    
  }, [session])

  const renderItem = ({ item }: { item: PostParam }) => (
    <View style={styles.postContainer}>
      {item.images && item.images[0] !== "" ? (
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles.postImage}
        />
      ) : (
        <Ionicons name="camera-outline" size={windowHeight * 0.1} color="black" />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Birkenstock</Text>
        <Text style={styles.review}>{item.review}</Text>
      </View>
    </View>
  );

  async function getPosts() {
    console.log("GETTING POSTS")

    try {
      if (posts.length > 0) {
        setRefreshing(true)                
      }

      if (!session?.user) throw new Error('No user on the session!')
    
        const { data, error, status } = await supabase.from('posts').select(`id, date, link, review, pros, cons, images, recommend, likes`).eq('user', session?.user.id)
        
        if (error && status !== 406) {
          throw error
        }

        if (data) { 
          if (posts.length !== data.length) {
                    
            const preData = data

            for (let i = 0; i < data.length; i++) {
              const post = data[i];
              const imgs = []

              for (let j = 0; j < post.images.length; j++) {
                const img = post.images[j];
                  
                if (img !== null) {
                  const imgURL = await downloadImage(img)
                  imgs.push(imgURL)
                }
              }

              preData[i].images = imgs
            }

          setPosts(preData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      if (posts.length > 0) {
        setRefreshing(false)                
      }        
    }
  }

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('post-imgs').download(path);
  
      if (error) {
        throw error;
      }

      return URL.createObjectURL(data); // Create an object URL directly from the blob

    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
      }
      return null;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        snapToInterval={windowWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '70%',  // Adjust the height to give space for the text below
    resizeMode: 'cover',
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  review: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default HomeFeed;