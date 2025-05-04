import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation} from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { logOut } from '../Authentication';
export default function UserProfile() {
  
  const navigation = useNavigation();
    const route = useRoute();
    const {userData} = route.params;

  const handleLogout = () => {
    // logout logic here
    logOut(navigation,userData.userId);
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.profileRow}>
        <Image source={require('../assets/icons/user.png')} style={{ width: 80, height: 80 }} />
        <View style={styles.textSection}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.info}>{userData.email}</Text>
          <Text style={styles.info}>{userData.phone}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 40,
    },
    textSection: {
      marginLeft: 20,
    },
    name: {
      fontSize: 22,
      fontWeight: '700',
      color: '#333',
    },
    info: {
      fontSize: 15,
      color: '#666',
      marginTop: 4,
    },
    bottom: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoutButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 12,
      paddingHorizontal: 50,
      borderRadius: 30,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });