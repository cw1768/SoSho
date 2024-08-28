import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Modal, Button, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Input } from '@rneui/themed'
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js';

interface SearchBarProps {
    onSearch: (query: string) => void;
    session: Session
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, session }) => {
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false); 
    const [uploading, setUploading] = useState(false)

    const [reviewInput, setReviewInput] = useState<string>();
    const [linkInput, setLinkInput] = useState<string>();
    const [selectedPros, setSelectedPros] = useState<string[]>([]);
    const [selectedCons, setSelectedCons] = useState<string[]>([]);
    const [recommend, setRecommend] = useState<string | null>(null);
    const [images, setImages] = useState<(string | null)[]>([null, null, null]);
    const [dispImgs, setDispImgs] = useState<(string | null)[]>([null, null, null]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        onSearch(text);
    };

    const onAddNewItem = () => {
        if (modalVisible === false) {
            setModalVisible(true)            
        }
    }

    const toggleOption = (option: string, isPro: boolean) => {
        if (isPro) {
            setSelectedPros(prev =>
                prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
            );
        } else {
            setSelectedCons(prev =>
                prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
            );
        }
    };

    const handleRecommend = (value: string) => {
        setRecommend(value);
    };

    const handlePost = async() => {

        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')
        
            const { data, error } = await supabase.from('posts').insert([ 
                { link: linkInput, review: reviewInput, pros: selectedPros, cons: selectedCons, images: images, recommend: recommend, user: session.user.id }
            ]).select()
            
            console.log(data)
            console.log(error)

            if (error) {
                throw error
            }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)

            setLinkInput('')
            setReviewInput('')
            setSelectedPros([])
            setSelectedCons([])
            setImages([null, null, null])
            setDispImgs([null, null, null])
            setRecommend(null)
        }

        setModalVisible(false);
    };

    const pickImage = async (index: number) => {
        console.log(index)
    };

    async function uploadImg(index: number) {
        try {
            setUploading(true)
        
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
                allowsMultipleSelection: false, // Can only select one image
                allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
                quality: 1,
                exif: false, // We don't want nor need that data.
            })
        
            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled image picker.')
                return
            }
        
            const image = result.assets[0]
            console.log('Got image', image)
        
            if (!image.uri) {
                throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
            }
        
            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())
        
            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            const { data, error: uploadError } = await supabase.storage.from('post-imgs').upload(path, arraybuffer, { contentType: image.mimeType ?? 'image/jpeg', })
        
            if (uploadError) {
                throw uploadError
            }

            let intArr = images
            intArr[index] = data.path
            setImages(intArr)

            let intArrDis = dispImgs
            intArrDis[index] = result.assets[0].uri
            setDispImgs(intArrDis)

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            } else {
                throw error
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <ThemedView>

            <View style={styles.container}>
                
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>My Items</Text>

                    <TouchableOpacity onPress={onAddNewItem} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ add new</Text>
                    </TouchableOpacity>

                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Search for your boards, friends, brands, etc..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor='#888'
                />
            </View>
         
            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Item</Text>
                        
                        {/* Media Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Media</Text>
                            <View style={styles.imageContainer}>
                                {dispImgs.map((image, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        onPress={() => pickImage(index)} 
                                        style={[
                                            styles.imageBox, 
                                            image ? { backgroundColor: 'transparent' } : {}
                                        ]}
                                    >
                                        {image ? (
                                            <Image source={{ uri: image }} style={styles.image} />
                                        ) : (
                                            <Button title={uploading ? 'Uploading ...' : 'Add Photo'} onPress={() => uploadImg(index)} disabled={uploading} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Link Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Link</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter a URL"
                                placeholderTextColor="#888"
                                value={linkInput} // Add state for this input if needed
                                onChangeText={(text) => setLinkInput(text)} // Handle state accordingly
                            />
                        </View>

                        {/* Review Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Review</Text>
                            <TextInput
                                style={[styles.textInput, { height: 60 }]}
                                placeholder="Write your review here..."
                                placeholderTextColor="#888"
                                multiline
                                value={reviewInput} // Add state for this input if needed
                                onChangeText={(text) => setReviewInput(text)} // Handle state accordingly
                            />
                        </View>

                        {/* Pros Toggle Buttons */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Pros</Text>
                            <View style={styles.toggleContainer}>
                                {["Comfortable", "High-quality", "Stylish", "Price", "Versatile", "True to Size"].map((pro) => (
                                    <TouchableOpacity 
                                        key={pro} 
                                        onPress={() => toggleOption(pro, true)} 
                                        style={[
                                            styles.toggleButton, 
                                            selectedPros.includes(pro) && styles.toggleButtonSelected
                                        ]}
                                    >
                                        <Text style={[
                                            styles.toggleButtonText,
                                            selectedPros.includes(pro) && styles.toggleButtonTextSelected
                                        ]}>{pro}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Cons Toggle Buttons */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cons</Text>
                            <View style={styles.toggleContainer}>
                                {["Uncomfortable", "Low-quality", "Price", "Runs Small", "Runs Big"].map((con) => (
                                    <TouchableOpacity 
                                        key={con} 
                                        onPress={() => toggleOption(con, false)} 
                                        style={[
                                            styles.toggleButton, 
                                            selectedCons.includes(con) && styles.toggleButtonSelected
                                        ]}
                                    >
                                        <Text style={[
                                            styles.toggleButtonText,
                                            selectedCons.includes(con) && styles.toggleButtonTextSelected
                                        ]}>{con}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Recommend Toggle Buttons */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Recommend to a Friend?</Text>
                            <View style={styles.recommendContainer}>
                                <TouchableOpacity 
                                    onPress={() => handleRecommend('Yes')} 
                                    style={[
                                        styles.toggleButton, 
                                        recommend === 'Yes' && styles.toggleButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.toggleButtonText, 
                                        recommend === 'Yes' && styles.toggleButtonTextSelected
                                    ]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleRecommend('No')} 
                                    style={[
                                        styles.toggleButton, 
                                        recommend === 'No' && styles.toggleButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.toggleButtonText, 
                                        recommend === 'No' && styles.toggleButtonTextSelected
                                    ]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Post and Close Buttons */}
                        <View style={styles.buttonGroup}>
                            <Button title="Post" onPress={handlePost} />
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Align title to the left and button to the right
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        color: '#000',
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageBox: {
        width: '30%',
        height: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: '3.33%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    imagePlaceholder: {
        color: '#888',
        fontSize: 12,
    },
    toggleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    toggleButton: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        margin: 2,
        backgroundColor: '#f9f9f9',
        width: '48%',
        alignItems: 'center',
    },
    toggleButtonSelected: {
        backgroundColor: '#007AFF',
    },
    toggleButtonText: {
        color: '#000',
        fontSize: 12,
    },
    toggleButtonTextSelected: {
        color: '#fff',
    },
    recommendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
});

export default SearchBar;

// <ThemedText style={styles.headerText}>shopshop</ThemedText>
// <View style={styles.searchContainer}>
//     <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
//     <TextInput
//         placeholder="Search..."
//         value={localSearchValue}
//         onChangeText={handleSearchChange}
//         style={styles.searchInput}
//         placeholderTextColor="gray"
//         onSubmitEditing={() => console.log(localSearchValue)}
//     />
// </View>