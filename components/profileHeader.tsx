import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Button, ActivityIndicator, View, TextInput, Image, TouchableOpacity, Alert, Modal, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install and import this package
import { ProfileHeaderProps } from '@/constants/types';
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ url, size = 150, onUpload, followerCount, followingCount, friendCount, userName, fullName, session }) => {
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [username, setUsername] = useState('')
    const [modalVisible, setModalVisible] = useState(false); 

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    useEffect(() => {
        setUsername(userName)
    }, [userName])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
        
            if (error) {
                throw error
            }
        
            const fr = new FileReader()
            fr.readAsDataURL(data)
            fr.onload = () => {
                setAvatarUrl(fr.result as string)
            }

        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message)
            }
        }
    }

    async function uploadAvatar() {
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
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer, {
                contentType: image.mimeType ?? 'image/jpeg',
                })
        
            if (uploadError) {
                throw uploadError
            }
        
            onUpload(data.path)
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

    const onEditProfile = () => {
        if (modalVisible === false) {
            setModalVisible(true)            
        }
    }

    async function updateProfile({ username }: { username: string }) {
            
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')
        
            const updates = {
                id: session?.user.id,
                username,
                updated_at: new Date(),
            }
        
            const { error } = await supabase.from('profiles').upsert(updates)
        
            if (error) {
                throw error
            }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <ThemedView style={styles.container}>
            <View style={styles.profileContainer}>

                {avatarUrl ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        accessibilityLabel="Avatar"
                        style={styles.profilePic}
                    />
                ) : (
                    <View style={[styles.profilePic, styles.noImage]} >
                        <Ionicons name="camera-outline" size={28} color="#000" />
                    </View>
                )}
                
                <ThemedText style={styles.userHandle}>{username}</ThemedText>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <ThemedText style={styles.userName}>{fullName}</ThemedText>
                    <TouchableOpacity style={styles.editProfileButton} onPress={onEditProfile}>
                        <ThemedText style={styles.editProfileText}>edit profile</ThemedText>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>{followerCount}</ThemedText>
                        <ThemedText style={styles.statLabel}>Followers</ThemedText>
                    </View>
                    
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>{followingCount}</ThemedText>
                        <ThemedText style={styles.statLabel}>Following</ThemedText>
                    </View>

                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>{friendCount}</ThemedText>
                        <ThemedText style={styles.statLabel}>Friends</ThemedText>
                    </View>
                </View>
            </View>



            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Close modal on request
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <Button title={uploading ? 'Uploading ...' : 'New Profile Pic'} onPress={uploadAvatar} disabled={uploading} />
                        
                        <View style={styles.verticallySpaced}>
                            <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
                        </View>

                        <Button title="Close" onPress={() => 
                            {
                                setModalVisible(false)
                                updateProfile({username})
                            }}
                        />

                    </View>
                </View>
            </Modal>
        </ThemedView>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 20
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    userHandle: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'gray',
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10
    },
    editProfileText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    statItem: {
        alignItems: 'baseline',
        marginRight: 16,
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    avatar: {
        borderRadius: 5,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    noImage: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgb(200, 200, 200)',
        justifyContent: 'center', // Center the icon horizontally
        alignItems: 'center', // Center the icon vertically
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
});
  