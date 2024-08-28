import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, FlatList, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { useLocalSearchParams } from "expo-router";

import { ThemedView } from '@/components/ThemedView';
import { mockUserLists } from '@/constants/testData';
import { ThemedText } from '@/components/ThemedText';
import ListProd from '@/components/listProduct';

export default function PostExpandedPage() {
  const params = useLocalSearchParams();
  const { id } = params;

  const clickedList = mockUserLists.find((list) => list.id === id)
  const [comment, setComment] = useState<string>('');

  if (!clickedList?.products) {
    return <ThemedText>this list is empty!</ThemedText>;
  }

  console.log(clickedList)

  return (
    <ThemedView style={styles.container}>
         <ThemedView style={styles.header}>
            <ThemedText style={styles.headerText}>{clickedList.title}</ThemedText>   
        </ThemedView>

        <FlatList 
          data={clickedList.products} 
          renderItem={({item}) => <ListProd item={item}/>} 
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 35 }}
          //ListFooterComponent={renderFooter}
          //ListEmptyComponent={renderEmpty}
          //onEndReachedThreshold={0.2}
          //onEndReached={fetchMoreData}
          //onRefresh={onRefresh}
          //refreshing={isRefreshing}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 'auto', // Pushes the text to the left
  },
});
