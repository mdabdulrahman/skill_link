import { View, Text, TouchableOpacity,Image } from 'react-native'
import React, { useState,useEffect,useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { database,DATABASE_ID,COLLECTION_IDs } from '../../AppWrite'
import { Query } from 'react-native-appwrite'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
export default function OpenServiceRequests() {
const navigation = useNavigation()

const {userData} = useContext(UserContext);
 const [OpenRequests, setOpenRequests] = useState([])
 useEffect(() => {
    getOpenServiceRequests()
  }, [])
  const getOpenServiceRequests = async () => {
    // Fetch open service requests from the database
  
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.service_requests, [Query.equal('requested_user',userData.userId),Query.equal('status', 'open')]);
   
      setOpenRequests(response.documents);
    } catch (error) {
      console.error('Error fetching open service requests:--', error);
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
  flexDirection: 'row', alignItems:'flex-end'}}>
            <Image source={require('../../assets/icons/open.png')} style={{width: 60, height: 60}} />
      <Text style={{
  fontSize: 20,  // A bigger font size to make it stand out
  fontWeight: 'bold',  // Bold for emphasis
  color: '#333',  // Dark grey text color for a clean, professional look
 
  marginBottom: 10,  // Space below the text
 
}}>
    {"\t"}Service Requests
</Text>
</View>
      {OpenRequests.map((request) => (
   <TouchableOpacity
   key={request.request_id}
   onPress={() => navigation.navigate('ViewServiceRequest', { request: request,userData:userData })}  // Navigate to the request details screen
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
      {OpenRequests.length === 0 && <Text>No open service requests available.</Text>}
    </View>
  )
}