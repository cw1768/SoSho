import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { ProductListProps, Board, Product } from '@/constants/types';

const Favorites: React.FC<ProductListProps> = ({ products, onProductPress }) => {
    const renderProduct = ({ item }: { item: Product }) => (

        <TouchableOpacity 
            style={styles.product} 
            onPress={() => onProductPress(item.id)}
        >
            {item.imageUrl && item.imageUrl[0] !== "" && (
                <Image 
                    key={item.id} 
                    source={{ uri: item.imageUrl[0] }} 
                    style={styles.gridImage} 
                />
            )}
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
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
    product: {
        width: itemWidth,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    gridImage: {
        width: '100%',
        height: itemWidth, // Make the image square
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default Favorites;