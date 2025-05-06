import { View, Text, TouchableOpacity,Image,ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { database,DATABASE_ID,COLLECTION_IDs } from '../../AppWrite'
import { Query } from 'react-native-appwrite'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
export default function OpenServiceRequestsProvider({userData}) {
const navigation = useNavigation()
const route = useRoute()
if(!userData){
  userData = route.params.userData
}

 const [OpenRequests, setOpenRequests] = useState([]);
 function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
 let findRequestsWithinDistance =  (requests) => {
           const nearbyRequests = requests.filter(request => {
    const distance = getDistanceFromLatLonInKm(userData.latitude, userData.longitude, request.latitude, request.longitude);
    return distance <= userData.available_distance; // Filter requests within 5 km radius
           });
           setOpenRequests(nearbyRequests);
 }
 useEffect(() => {
    getOpenServiceRequests()
  }, [])
  const getOpenServiceRequests = async () => {
    // Fetch open service requests from the database
  
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.service_requests, [Query.equal('service_type',userData.service_type),Query.equal('status', 'open')]);
       
      findRequestsWithinDistance(response.documents);
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
     
      {OpenRequests.map((request) => (
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
      {OpenRequests.length === 0 && <Text>No open service requests available.</Text>}
    </View>
    </ScrollView>
  )
}