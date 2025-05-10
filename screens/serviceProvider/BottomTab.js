import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function BottomTab() {
  const navigation = useNavigation();
  

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tabBox} onPress={() => navigation.navigate('OpenServiceRequestsProvider')}>
        <Ionicons name="open" size={26} color="green" />
        <Text style={styles.label}>Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBox} onPress={() => navigation.replace('ServiceProviderHome')}>
        <Ionicons name="home" size={26} color="" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabBox} onPress={() => navigation.navigate('Conversations')}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#333" />
        <Text style={styles.label}>Chats</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  tabBox: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
});
