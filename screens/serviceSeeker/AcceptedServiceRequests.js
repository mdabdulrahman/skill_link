import { View, Text, TouchableOpacity,Image } from 'react-native'
import React, { useState,useEffect } from 'react'
import { database,DATABASE_ID,COLLECTION_IDs } from '../../AppWrite'
import { Query } from 'react-native-appwrite'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
export default function AcceptedServiceRequests({userData}) {
const navigation = useNavigation()


 const [AcceptedRequests, setAcceptedRequests] = useState([])
 useEffect(() => {
    getAcceptedServiceRequests()
  }, [])
  const getAcceptedServiceRequests = async () => {
    // Fetch open service requests from the database
  
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.service_requests, [Query.equal('requested_user',userData.userId),Query.equal('status', 'accepted')]);
   
      setAcceptedRequests(response.documents);
    } catch (error) {
      console.error('Error fetching accepted service requests:--', error);
    }
  
 
  };
 
  
  
 
  const serviceTypes = {
    mechanic: "Mechanic",
    plumber: "Plumber",
    electrician: "Electrician",
    construction_worker: "Construction Worker",
    painter: "Painter",
    carpenter: "Carpenter",
    ac_technician: "AC Technician",
  };
  return (
    <View style={{
      width: '100%',}}>
        <View style={{
  flexDirection: 'row', alignItems:'center', justifyContent:"center"}}>
            <Image source={require('../../assets/icons/active-user.png')} style={{width: 35, height: 35,marginRight:10}} /> 
      <Text style={{
  fontSize: 20,  // A bigger font size to make it stand out
  fontWeight: 'bold',  // Bold for emphasis
  color: '#333',  // Dark grey text color for a clean, professional look
 
  marginBottom: 10,  // Space below the text
 
}}>
    Ongoing{"\t"}Service Requests
</Text>
</View>
      {AcceptedRequests.map((request) => (
   <TouchableOpacity
   key={request.request_id}
   onPress={() => navigation.navigate('ViewAcceptedServiceRequest', { request: request,userData:userData })}  // Navigate to the request details screen
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
      {AcceptedRequests.length === 0 && <Text>No accepted service requests available.</Text>}
    </View>
  )
}