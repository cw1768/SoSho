import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Platform } from "react-native";
import ImageView from "react-native-image-viewing";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Post, ImageType } from "@/constants/types";
import { Link } from 'expo-router';

const HomePost = ({ item }: { item: Post }) => {
  const [lrgImgVisible, setLrgImgVisible] = useState(false);
  const [lrgImg, setLrgImg] = useState<ImageType[] | null>(null);

  const handleImagePress = (imageUrl: string) => {
    setLrgImgVisible(true);
    setLrgImg([{ uri: imageUrl }]);
  };

  const closeImageView = () => {
    setLrgImg(null);
    setLrgImgVisible(false);
  };

  return(
    <ThemedView style={styles.post}>
      <Link 
        href={{
          pathname: '/user/[id]',
          params: { id: item.id }
        }}
        asChild
      >
        <TouchableOpacity>
          <ThemedView style={styles.header}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <ThemedView style={styles.userInfo}>
              <ThemedText style={styles.username}>{item.user}</ThemedText>
              <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </Link>

      <Pressable onPress={() => {}}>
        <ThemedText style={styles.content}>{item.content}</ThemedText>
      </Pressable>

      {item.list.length > 0 && 
        <ThemedView style={styles.listContainer}>

          <Link 
            href={{
              pathname: '/list/[id]',
              params: { id: item.list[0].id }
            }}
            asChild
          >
            <TouchableOpacity onPress={() => console.log(item)}>
              <ThemedView style={styles.content}>
                <ThemedText style={styles.title}>{item.list[0].title}</ThemedText>
                <ThemedText style={styles.count}>{item.list[0].products.length} products</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </Link>
        </ThemedView>        
      }

      {item.product && 
        <ThemedView>
          {item.product.map((product, index) => (
            <ThemedView style={styles.product}>
              <ThemedText style={styles.productName}>{product.title}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      }

      {item.product && 
        <ThemedView>
          {item.product.map((product, index) => 
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={Platform.OS === 'web'}
              data={product.imageUrl}
              contentContainerStyle={styles.imageList}
              renderItem={({ item: imageUrl, index }) => (
                <Pressable key={index} onPress={() => handleImagePress(imageUrl)}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </Pressable >
              )}
            />
          )}
        </ThemedView>
      }

      {lrgImg && 
        <ImageView
          images={lrgImg}
          imageIndex={0}
          visible={lrgImgVisible}
          onRequestClose={closeImageView}
        />
      }

      <ThemedView style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="thumbs-up-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{item.likeCount || 0}</ThemedText>
        </TouchableOpacity>

        <Link 
          href={{
            pathname: '/post/[id]',
            params: { id: item.id }
          }}
          asChild
        >
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbox-outline" size={18} color="black" />
            <ThemedText style={styles.actionText}>{item.commentCount || 0}</ThemedText>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{item.shareCount || 0}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={18} color="black" />
          <ThemedText style={styles.actionText}>{item.bookmarkCount || 0}</ThemedText>
        </TouchableOpacity>

        {item.product.length > 0 && 
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={18} color="black" />
            <ThemedText style={styles.actionText}>${item.product[0].price}</ThemedText>
          </TouchableOpacity>
        }
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 15
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
  post: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    width: 250,
    height: 250,
    marginRight: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  imageList: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  content: {
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  product: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  listContainer: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  count: {
    fontSize: 12,
    color: '#999',
  },
})

export default HomePost;