import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, Alert, Button } from 'react-native';
import { ProductListProps, Product, Board } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import BoardList from '@/components/boardList'; // Make sure BoardList is used correctly if needed
import { profileData, boards, products } from '@/constants/testData';
import { supabase } from '@/lib/supabase'

type PostParam = { id: any, date: any; link: any; review: any; pros: any; cons: any; images: any; recommend: any; likes: any; }

const ProfileTabs: React.FC<ProductListProps> = ({ session, onProductPress }) => {
    const [currentTab, setCurrentTab] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState<PostParam[]>([]);

    useEffect(() => {
        if (session) getPosts()    
    }, [session])

    const handleBoardPress = (boardId: string) => {
        console.log('Board pressed:', boardId);
        // Navigate to board details or perform any other action
    };

    const onTabClick = (tabIndex: number) => {
        setCurrentTab(tabIndex);
    };

    const renderProduct = useCallback(({ item }: { item: PostParam }) => (
        <TouchableOpacity 
            style={styles.gridItemProd} 
            onPress={() => onProductPress(item.id)}
        >
            {item.images && item.images[0] !== "" ? (
                <Image 
                    source={{ uri: item.images[0] }} 
                    style={styles.gridImageProd} 
                />
            ) : (
                <Ionicons name="camera-outline" size={18} color="black" />
            )}
        </TouchableOpacity>
    ), [onProductPress]);

    const renderHeader = () => (
        <View>
            <View style={styles.tabsContainer}>
                <Text 
                    onPress={() => onTabClick(1)}
                    style={[
                        currentTab === 1 ? styles.tabUnderline : null,
                    ]}
                >
                    <Ionicons name="image-outline" size={40} />
                </Text>

                <Text
                    onPress={() => onTabClick(2)}
                    style={[
                        currentTab === 2 ? styles.tabUnderline : null,
                    ]}
                >
                    <Ionicons name="cube-outline" size={40} />
                </Text>

                <Text
                    onPress={() => onTabClick(3)}
                    style={[
                        currentTab === 3 ? styles.tabUnderline : null,
                    ]}
                >
                    <Ionicons name="heart-outline" size={40} />
                </Text>
            </View>

            { currentTab == 1 && <Text style={styles.title}>My Posts</Text> }

            { currentTab == 2 && <Text style={styles.title}>My Boards</Text> }

            { currentTab == 3 && <Text style={styles.title}>My Likes</Text> }

        </View>
    );

    const renderBoardItem = ({ item }: { item: Board }) => (
        <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => handleBoardPress(item.id)}
        >
            <View style={styles.imageGrid}>
                {item.items.slice(0, 4).map((boardItem) => (
                    <Image 
                        key={boardItem.id} 
                        source={{ uri: boardItem.imageUrl![0] }} 
                        style={styles.gridImage} 
                    />
                ))}
            </View>
            <Text style={styles.boardName}>{item.name}</Text>
        </TouchableOpacity>
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
        <View style={styles.container}>

            {currentTab === 1 && (
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={posts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={3} // Display 3 items per row
                    columnWrapperStyle={styles.gridRow} // Align items within a row
                    contentContainerStyle={styles.grid}
                    onRefresh={() => getPosts()}
                    refreshing={refreshing}
                />
            )}

            {currentTab === 2 && (
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={boards}
                    renderItem={renderBoardItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2} 
                    columnWrapperStyle={styles.gridRow} // Align items within a row
                    contentContainerStyle={styles.grid}
                />
            )}

            {currentTab === 3 && (
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={posts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={3} // Display 3 items per row
                    columnWrapperStyle={styles.gridRow} // Align items within a row
                    contentContainerStyle={styles.grid}
                />
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 20; // Adjust item width for 3 columns with spacing
const itemWidthProd = width / 3 - 8; // Adjust item width for 3 columns with spacing

const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    tabUnderline: {
        textDecorationLine: 'underline',
        color: '#007AFF',
    },
    grid: {
        paddingHorizontal: 10, // Add padding around the grid
        paddingBottom: 10, // Add padding at the bottom
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    gridItem: {
        width: itemWidth,
        marginBottom: 10,
    },
    gridItemProd: {
        width: itemWidthProd,
        aspectRatio: 1, // Make each item square
        marginBottom: 0,
        overflow: 'hidden',
    },
    gridImage: {
        width: '50%',
        height: '50%',
    },
    gridImageProd: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        aspectRatio: 1,
    },
    boardName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileTabs;
