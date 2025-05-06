import { View, Text, TouchableOpacity,Image,ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { database,DATABASE_ID,COLLECTION_IDs } from '../../AppWrite'
import { Query } from 'react-native-appwrite'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
export default function AcceptedServiceRequestsProvider({userData}) {
const navigation = useNavigation()
const route = useRoute()
if(!userData){
  userData = route.params.userData
}

 const [AcceptedRequests, setAcceptedRequests] = useState([]);
 


 
 useEffect(() => {
    getAcceptedServiceRequests()
  }, [])
  const getAcceptedServiceRequests = async () => {
    // Fetch open service requests from the database
  
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.proposals, [Query.equal('proposed_user',userData.userId),Query.equal('status', 'accepted')]);
       
        setAcceptedRequests(response.documents.map((proposal) => proposal.request));
     
    } catch (error) {
      console.error('Error fetching open service requests:', error);
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
    <ScrollView>
    <View style={{
      width: '100%',}}>
     
      {AcceptedRequests.map((request) => (
   <TouchableOpacity
   key={request.request_id}
   onPress={() => navigation.navigate('ViewAcceptedServiceRequestProvider', { request: request,userData:userData })}  // Navigate to the request details screen
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
    
   </View>
 </TouchableOpacity>
 
     
      ))}
      {AcceptedRequests.length === 0 && <Text>No open service requests available.</Text>}
    </View>
    </ScrollView>
  )
}