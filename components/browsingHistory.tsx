import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { browsingHistDataProps, browsingHistData } from '@/constants/types';

const BrowseHist: React.FC<browsingHistDataProps> = ({ history }) => {
  const renderUpdateItem = ({ item }: { item: browsingHistData }) => (
    <View style={styles.updateItem}>
        <View style={styles.updateInfo}>
            <Image source={{ uri: item.product.imageUrl![0] }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.friendName}>{item.product.title}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick up where you left off</Text>
      <FlatList
        data={history}
        renderItem={renderUpdateItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const updateItemWidth = width * 0.5; // 70% of screen width

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    updateItem: {
        width: updateItemWidth,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    updateInfo: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    friendName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    updateText: {
        fontSize: 14,
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
});

export default BrowseHist;