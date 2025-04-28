import { View, Text, TouchableOpacity,Image } from 'react-native'
import React, { useState,useEffect } from 'react'
import { database,DATABASE_ID,COLLECTION_IDs } from '../AppWrite'
import { Query } from 'react-native-appwrite'
export default function OpenServiceRequests({userData}) {

 const [OpenRequests, setOpenRequests] = useState([])
 useEffect(() => {
    getOpenServiceRequests()
  }, [])
  const getOpenServiceRequests = async () => {
    // Fetch open service requests from the database
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.service_requests, [Query.equal('requested_user_id',userData.userId),Query.equal('status', 'open')]);
       setOpenRequests(response.documents);
    } catch (error) {
      console.error('Error fetching open service requests:', error);
    }
  };
  const convertDate = (isoString) => {
    const date = new Date(isoString);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    let hours = date.getUTCHours(); // <-- Use UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
  
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
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
            <Image source={require('../assets/icons/open.png')} style={{width: 60, height: 60}} />
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
       Proposals: {request.proposal_ids.length}
     </Text>
   </View>
 </TouchableOpacity>
 
   
   
    
    
    
     
     
     
     
      ))}
      {OpenRequests.length === 0 && <Text>No open service requests available.</Text>}
    </View>
  )
}