import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

interface HomeHeaderProps {
    notificationCount: number;
    cartCount: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ notificationCount, cartCount }) => {
    return (
        <ThemedView style={styles.header}>
            <ThemedText style={styles.welcomeText}>Welcome Back!</ThemedText>
            <View style={styles.iconsContainer}>
                <View style={styles.notificationContainer}>
                    <Ionicons name="notifications-outline" size={28} color="#000" />
                    {notificationCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>{notificationCount}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.notificationContainer}>
                    <Ionicons name="cart-outline" size={28} color="#000" style={styles.cartIcon} />
                    {cartCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>{cartCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationContainer: {
        position: 'relative',
        marginRight: 10,
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cartIcon: {
        marginLeft: 15,
    },
});

export default HomeHeader;
