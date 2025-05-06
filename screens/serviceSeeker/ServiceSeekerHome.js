import React, { useState ,useEffect, useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,Image ,BackHandler} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header';
import PostServiceRequestForm from './PostServiceRequestForm';
import OpenServiceRequests from './OpenServiceRequests';
import { useNavigation } from '@react-navigation/native';
import { database,DATABASE_ID,COLLECTION_IDs } from '../../AppWrite';
import * as Notifications from 'expo-notifications';
import { ID } from 'react-native-appwrite';
import { Query } from 'react-native-appwrite';
import { useRoute } from '@react-navigation/native';

import { UserContext } from '../../context/UserContext';
import BottomTab from './BottomTab';
import AcceptedServiceRequests from './AcceptedServiceRequests';

export default function ServiceSeekerHome() {
const navigation = useNavigation();

const { userData} = useContext(UserContext);
const token = userData.push_token;
  const [currScreen, setCurrScreen] = useState('home');

  const [loading, setLoading] = useState(false);
  const getSenderData = async (senderId) => {
    try {
      const response = await database.getDocument(DATABASE_ID, COLLECTION_IDs.users, senderId);
      
      navigation.navigate("ChatScreen", { receiverData: response, senderData: userData });
    } catch (error) {
      console.error('Error fetching receiver data:', error);
    }
  }
useEffect(() => {
 
 /*  Notifications.addNotificationReceivedListener(notification => {
    console.log("Notification received: ", notification);
  }); */
  Notifications.addNotificationResponseReceivedListener(response => {
    
    if( response.notification.request.content.data.type ==="message"){
      getSenderData(response.notification.request.content.data.sender_id);
    }
   
   //getReceiverData(response.notification.request.content.data.receiver_id);
  });
},[])
  
  const updateToken = async () => {
    try {
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_IDs.users,
        userData.$id, // Use the document ID of the user
        {
          push_token: token,
        }
      );
    } catch (error) {
      console.error('Error updating token:', error);
    }
  }
    useEffect(()=>{
     
     
      updateToken();
      
      
  },[])
  return (
    <View style={{paddingTop:20,backgroundColor:"white",flex:1}}>
    <Header userData={userData}/>
    <StatusBar style='auto' />

   
      <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>👋Hello {userData.name} ,</Text>
      <View style={{ backgroundColor:"black", padding: 20, borderRadius: 10, marginBottom: 20 , marginTop: 20}}>
        <Text style={{fontSize:18,fontWeight:"bold",color:"white",fontFamily:"monospace"}}>Don’t search, just post!{"\n\n"}Experts are ready to assist you.</Text>
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("PostServiceRequestForm",{userData:userData})} >
          <Image source={require('../../assets/icons/send.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
      <Text style={styles.buttonText}>Post & Find</Text>
    </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button,{marginHorizontal:"auto",marginBottom:20}]} onPress={()=>navigation.navigate("OpenServiceRequests")} >
          
      <Text style={styles.buttonText}>Open Posted Requests</Text>
    </TouchableOpacity>
      <AcceptedServiceRequests userData={userData}/>
    

      </View></ScrollView>
  
<BottomTab/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#f7f9fc',
    flex: 1,
    alignItems: 'flex-start',
    padding: 20,
    
    justifyContent:"flex-start"
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
  

    color: '#333'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  locationButton: {
    backgroundColor: '#34a853',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  button: {
    backgroundColor: '#00b0ff',  // Modern blue color
    borderRadius: 10,             // Rounded corners
    paddingVertical: 10,          // Vertical padding
    paddingHorizontal: 20,        // Horizontal padding
    marginTop: 10,                // Space above the button 
    alignItems: 'center',         // Center text inside button
    justifyContent: 'center',     // Center text inside button
    flexDirection: 'row',      // Align icon and text in a row
  },
  buttonText: {
    color: '#fff',                // White text color
    fontSize: 18,                 // Font size
    fontWeight: '600',            // Bold text
  },
});
