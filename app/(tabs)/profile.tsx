import { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, Button, FlatList, TouchableOpacity, Alert, TextInput, Pressable, ScrollView, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/components/profileHeader';
import SearchBar from '@/components/search';
import BoardList from '@/components/boardList';
import Favorites from '@/components/favorites';
import ProfileTabs from '@/components/profileTabs';
import { profileData, boards } from '@/constants/testData';
import { useRoute, RouteProp  } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'

// Define the type for the route parameters
type ProfileScreenParams = {
  key: string;
  session: Session | null;
};

// Define the type for the route prop
type ProfileRouteProp = RouteProp<{ Profile: ProfileScreenParams }, 'Profile'>;

export default function Profile() {

  const route = useRoute<ProfileRouteProp>();
  const { key, session } = route.params;

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [followerCount, setFollowerCount ] = useState(0)
  const [followingCount, setFollowingCount ] = useState(0)
  const [friendCount, setFriendCount ] = useState(0)
  const [fullName, setFullName ] = useState("")

  useEffect(() => {
    if (session) getProfile()

    console.log("Auth state changed:", key); // Debugging log

  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, follower_count, following_count, friends_count, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setFollowerCount(data.follower_count)
        setFollowingCount(data.following_count)
        setFriendCount(data.friends_count)
        setFullName(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    avatar_url,
  }: {
    avatar_url: string
  }) {

    console.log(avatar_url)

    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        avatar_url,
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

  const handleSearch = (query: string) => {
    // Implement your search logic here
    console.log('Searching for:', query);
  };

  const handleProductPress = (boardId: string) => {
    console.log('Board pressed:', boardId);
    // Navigate to board details or perform any other action
  };

  return (
    <View style={styles.container}>
      {/*<ScrollView style={styles.container}>*/}

      <ProfileHeader 
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url)
          updateProfile({ avatar_url: url })
        }}
        followerCount={followerCount} 
        followingCount={followingCount} 
        friendCount={friendCount}
        fullName={fullName}
        userName={username}
        session={session!}
      />

      <SearchBar onSearch={handleSearch} session={session!} />

      <ProfileTabs session={session!} onProductPress={handleProductPress} />

      {/*<BoardList boards={boards} onBoardPress={handleBoardPress} />
      <Favorites products={products} onProductPress={handleProductPress} />*/}

      {/*<FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.listContainer}>

            <Link 
              href={{
                pathname: '/list/[id]',
                params: { id: item.id }
              }}
              asChild
            >
              <TouchableOpacity onPress={() => console.log(item)}>
                <ThemedView style={styles.content}>
                  <ThemedText style={styles.title}>{item.title}</ThemedText>
                  <ThemedText style={styles.count}>{item.products.length} products</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </Link>
          </ThemedView>          
        )}
      />*/}
      {/*</ScrollView>*/}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 220
  },
  content: {
    padding: 16,
  },
});
