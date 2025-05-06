import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
const Header = ({userData}) => {
  const navigation = useNavigation();
  const route = useRoute();
  
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Skill Link</Text>
    
      <TouchableOpacity onPress={()=>{
        if(userData.role=="service_seeker")
        navigation.navigate("UserProfile",{userData:userData})
      else navigation.navigate("ProviderProfile",{providerData:userData})
        }} >
        <Image 
          source={require('../assets/icons/user.png')} 
          style={styles.profileIcon}
        />
      
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default Header;
