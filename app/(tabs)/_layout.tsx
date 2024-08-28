import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { Session } from '@supabase/supabase-js'
import { useRoute, RouteProp  } from '@react-navigation/native';

// Define the type for the route parameters
type ProfileScreenParams = {
  key: string;
  session: Session | null;
};

// Define the type for the route prop
type ProfileRouteProp = RouteProp<{ Profile: ProfileScreenParams }, 'Profile'>;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const route = useRoute<ProfileRouteProp>();
  const { key, session } = route.params;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
        initialParams={{ key, session }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
        initialParams={{ key, session }}
      />
    </Tabs>
  );
}
