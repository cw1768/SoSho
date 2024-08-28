import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { BoardListProps, Board } from '@/constants/types';

const BoardList: React.FC<BoardListProps> = ({ boards, onBoardPress }) => {
    const renderBoardItem = ({ item }: { item: Board }) => (
        <TouchableOpacity 
        style={styles.boardItem} 
        onPress={() => onBoardPress(item.id)}
        >
            <View style={styles.imageGrid}>
                {item.items.slice(0, 4).map((boardItem, index) => (
                <Image 
                    key={boardItem.id} 
                    source={{ uri: boardItem.imageUrl![0] }} 
                    style={styles.gridImage} 
                />
                ))}
            </View>
            <View style={styles.boardInfo}>
                <Text style={styles.boardName}>{item.name}</Text>
                <Text style={styles.itemCount}>{item.itemCount} items</Text>
            </View>
        </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
        <Text style={styles.title}>My Lists</Text>
        <FlatList
            data={boards}
            renderItem={renderBoardItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        />
    </View>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = width * 0.5; // 50% of screen width

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    boardItem: {
        width: itemWidth,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        aspectRatio: 1,
    },
    gridImage: {
        width: '50%',
        height: '50%',
    },
    boardInfo: {
        padding: 10,
    },
    boardName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default BoardList;