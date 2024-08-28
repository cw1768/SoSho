import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem, View, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { HomeHeader } from '@/components/homeHeader';
import FriendUpdatesSlider from '@/components/homeFriends';
import { recentActions, browsingHistData } from '@/constants/testData';
import BrowseHist from '@/components/browsingHistory';
import HomeFeed from '@/components/homeFeed';
import { useRoute, RouteProp  } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'

type Section = 'header' | 'friendUpdates' | 'browseHistory' | 'feed';
type ProfileScreenParams = {
  key: string;
  session: Session | null;
};
type ProfileRouteProp = RouteProp<{ Profile: ProfileScreenParams }, 'Profile'>;
type PostParam = { id: any, date: any; link: any; review: any; pros: any; cons: any; images: any; recommend: any; likes: any; }

const HomeScreen: React.FC = () => {

  const route = useRoute<ProfileRouteProp>();
  const { key, session } = route.params;

  // Create an array of sections to render
  const sections: Section[] = ['header', 'friendUpdates', 'browseHistory', 'feed'];

  const renderItem: ListRenderItem<Section> = ({ item }) => {
    switch (item) {
      case 'header':
        return <HomeHeader notificationCount={3} cartCount={5} />;
      case 'friendUpdates':
        return <FriendUpdatesSlider updates={recentActions} />;
      case 'browseHistory':
        return <BrowseHist history={browsingHistData} />;
      case 'feed':
        return <HomeFeed session={session!} />;
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/*<FlatList 
        data={posts} 
        scrollEventThrottle={16}
        renderItem={({item}) => <HomePost item={item}/>} 
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 35 }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />*/}
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        scrollEventThrottle={16}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;