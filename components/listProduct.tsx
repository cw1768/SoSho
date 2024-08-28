import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Platform } from "react-native";
import ImageView from "react-native-image-viewing";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Post, ImageType, Product } from "@/constants/types";
import { Link } from 'expo-router';

const ListProd = ({ item }: { item: Product }) => {
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
    
      {item && 
        <ThemedView>
            <ThemedView style={styles.product}>
              <ThemedText style={styles.productName}>{item.title}</ThemedText>
              <ThemedText>{item.description}</ThemedText>
              <ThemedText>${item.price}</ThemedText>
            </ThemedView>
        </ThemedView>
      }

      {item.imageUrl && 
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          data={item.imageUrl}
          contentContainerStyle={styles.imageList}
          renderItem={({ item: imageUrl, index }) => (
            <Pressable key={index} onPress={() => handleImagePress(imageUrl)}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </Pressable >
          )}
        />
      }

      <TouchableOpacity style={styles.button} onPress={() => {
        console.log("press")
      }}>
        <ThemedText style={styles.text}>Buy!</ThemedText>
      </TouchableOpacity>
        

      {lrgImg && 
        <ImageView
          images={lrgImg}
          imageIndex={0}
          visible={lrgImgVisible}
          onRequestClose={closeImageView}
        />
      }

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
  product: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginTop: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
})

export default ListProd;