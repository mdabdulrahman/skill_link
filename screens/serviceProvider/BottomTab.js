import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
export default function BottomTab() {
  const navigation = useNavigation();
  return (
    <View style={styles.tabContainer}>

      <TouchableOpacity style={styles.tabBox} onPress={() => navigation.navigate('Conversations')}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
   
    backgroundColor: '#ffffff',
   
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  tabBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
   
    justifyContent: 'center',
    alignItems: 'center',
  },
});
