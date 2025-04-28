import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert,Image ,BackHandler} from 'react-native';
import * as Location from 'expo-location';
import { ID } from 'react-native-appwrite';
import { database, DATABASE_ID, COLLECTION_IDs } from '../AppWrite'; // Adjust the import path as necessary
import sendNotificationToNearby from '../utils/sendNotificationToNearby';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import PostServiceRequestForm from './PostServiceRequestForm';
import OpenServiceRequests from './OpenServiceRequests';
export default function ServiceSeekerHome({userData}) {


  const [currScreen, setCurrScreen] = useState('home');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      setCurrScreen("home")
      return true; // or false, depending on your needs
    };
  
    // Add the event listener
    BackHandler.addEventListener("hardwareBackPress", backAction);
  
    // Return cleanup function to remove event listener
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);  // Empty dependency array means this effect only runs once on mount and cleanup happens on unmount
  
  return (
    <>
    <Header/>
    <StatusBar style='auto' />

    { currScreen === "home"?(
      <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>👋Hello {userData.name} ,</Text>
      <View style={{ backgroundColor:"black", padding: 20, borderRadius: 10, marginBottom: 20 , marginTop: 20}}>
        <Text style={{fontSize:18,fontWeight:"bold",color:"white",fontFamily:"monospace"}}>Don’t search, just post!{"\n\n"}Experts are ready to assist you.</Text>
        <TouchableOpacity style={styles.button} onPress={()=>setCurrScreen("postForm")} >
          <Image source={require('../assets/icons/send.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
      <Text style={styles.buttonText}>Post & Find</Text>
    </TouchableOpacity>
      </View>
     <OpenServiceRequests userData={userData}/>

      </View></ScrollView>):currScreen === "postForm"?(<PostServiceRequestForm userData={userData}/>)
      :null
}
      </>
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
