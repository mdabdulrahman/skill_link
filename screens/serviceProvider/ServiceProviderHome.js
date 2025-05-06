// ServiceProviderPage.js
import React, {  useContext, useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet,Image,TextInput,Button,Alert, TouchableOpacity,ScrollView } from 'react-native';
import { startBackgroundLocation, stopBackgroundLocation } from '../../locationService';
import { database } from '../../AppWrite';
import Header from '../../components/Header';
import { COLLECTION_IDs, DATABASE_ID } from '../../AppWrite'; // Adjust the import path as necessary
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useRoute } from '@react-navigation/native';
import ViewServiceRequest from '../serviceSeeker/ViewServiceRequest';
import { UserContext } from '../../context/UserContext';
import BottomTab from './BottomTab';
const ServiceProviderPage = () => {
  const navigation = useNavigation();
  const {userData} = useContext(UserContext);
  const token = userData.push_token;
  const [isAvailable, setIsAvailable] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [availableDistance, setAvailableDistance] = useState(userData.available_distance); // Default distance in km
  const serviceTypes = {
    mechanic: "👨‍🔧 Mechanic",
    plumber: "👨‍🔧 Plumber",
    electrician: "⚡Electrician",
    construction_worker: "👷‍♂️ Construction Worker",
    painter: "🖌️ Painter",
    carpenter: "🪚 Carpenter",
    ac_technician: "🧰 AC Technician",
  };
async function updateDocumentAvailability() {


  await database.updateDocument(
    DATABASE_ID,
    COLLECTION_IDs.users,
    userData.$id, // Use the document ID of the user
    {
      isavailable: isAvailable,
    }
  );
}
  useEffect(() => {
    if (isAvailable) {

      startBackgroundLocation();
      updateDocumentAvailability();
    } else {
      stopBackgroundLocation();
      updateDocumentAvailability();
    }

    return () => stopBackgroundLocation();
  }, [isAvailable]);

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
const updateAvailableDistance = () => {
  const num = parseInt(availableDistance);

  if (num >= 1 && num <= 15) {
    
    setAvailableDistance(num);
    database.updateDocument(
      DATABASE_ID,
      COLLECTION_IDs.users,
      userData.$id, // Use the document ID of the user
      {
        available_distance: num,
      }
    ).then(() => {
      Alert.alert('Distance updated successfully!');
    }).catch((error) => {
      console.error('Error updating distance:', error);
    });

  } else {
    Alert.alert('Enter a number between 1 and 15');
  }
};
const getServiceRequestData=async(request_id)=>{
   await database.getDocument(DATABASE_ID,COLLECTION_IDs.service_requests,request_id).then((response) => {
    setServiceRequests([...serviceRequests,response])
    navigation.navigate('ViewServiceRequestsProvider', { request: response,userData:userData });
    });
}
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
   else if(response.notification.request.content.data.type ==="service_request"){
   
   getServiceRequestData(response.notification.request.content.data.requestId);
  }
  });
},[])
  return (
    <View style={{paddingTop:20,backgroundColor:"white",flex:1}}>
       <Header userData={userData}/>
       <StatusBar style="auto" />
       <ScrollView >
       <View style={styles.container}>
  
   
    <Text style={styles.header}>👋Greetings, {userData.name}! {"\n"}Ready for requests❓</Text>
    <Text style={styles.service}>{serviceTypes[userData.service_type]}</Text>

    <View style={styles.switchRow}>
    
      <Text style={styles.label}>Available for Service</Text>
      <Switch 
    value={isAvailable} 
    onValueChange={setIsAvailable} 
    trackColor={{ false: 'red', true: 'green' }} 
    thumbColor={isAvailable ? 'white' : 'white'} // You can customize thumb color if needed
  />

    </View>
    <View style={{flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,}}>
      <Text style={{fontWeight:"bold",}}>Set Availability Distance:</Text>
      <TextInput
        style={{ width: 45,
          height: 40,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          fontSize: 16,}}
        keyboardType="numeric"
        maxLength={2}
      
        onChangeText={(val)=>setAvailableDistance(val)}
        placeholder="5"
      />
      <Text style={{fontWeight:"bold",}}>KM</Text>
      <Button title="Set" onPress={()=>updateAvailableDistance()} color="#4CAF50" />
    </View>
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('OpenServiceRequestsProvider', { userData: userData })}>
        <View style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 }}>
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>View Open Service Requests</Text>
          </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AcceptedServiceRequestsProvider', { userData: userData })}>
        <View style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginTop: 20 }}>
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Accepted Service Requests</Text>
          </View>
      </TouchableOpacity>
    </View>
    
    {isAvailable&&
    <View>
    <Image source={require('../../assets/gifs/radar.gif')} style={{width:150,height:150,alignSelf:'center',marginTop:20,borderRadius:75}}/>
    <Text style={{fontWeight:"bold",textAlign:"center", color:"grey",fontSize:19}}>You will receive notifications for service requests within {availableDistance} KM</Text>
  </View>}

  {serviceRequests.length > 0 ? (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.name}>Open Service Requests</Text>
      {serviceRequests.map((request) => (
           <TouchableOpacity
           key={request.request_id}
           onPress={() => navigation.navigate('ViewServiceRequestsProvider', { request: request,userData:userData })}  // Navigate to the request details screen
           style={{
               // White background for a clean look
             borderBottomWidth: 1,  // Only the bottom border
             borderBottomColor: '#B0B0B0',  // Light gray border color
             padding: 20,
                
           }}
         >
           <View >
             <Text style={{ fontWeight: 'bold', color: '#333' }}>
               {request.request_title}
             </Text>
           </View>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
             <Text style={{ color: '#666' }}>
               {serviceTypes[request.service_type]}
             </Text>
             <Text style={{ fontWeight: 'bold', color: '#333' }}>
               Proposals: {request.proposals.length}
             </Text>
           </View>
         </TouchableOpacity>
      ))}
    </View>
  ) : (
    <Text style={{ marginTop: 20, fontSize: 16, color: '#888' }}>No open service requests.</Text>
  )}
  
 
  </View>
  </ScrollView>
  <BottomTab />
  </View>
  );
};

export default ServiceProviderPage;

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: '700',
   lineHeight:35,

    color: '#333'
  },
  container: {
    padding:20,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  service: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: "bold",
    fontFamily:'monospace'
  },
});
