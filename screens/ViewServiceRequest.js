import { View, Text, TouchableOpacity, StyleSheet,Image,Button ,ScrollView} from 'react-native';
import React, { use } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import { Linking } from 'react-native';
import { useEffect,useState } from 'react';
import { database,DATABASE_ID,COLLECTION_IDs } from '../AppWrite';
import { Query } from 'react-native-appwrite';
export default function ViewServiceRequest() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request, userData } = route.params;
  const [proposals, setProposals] = useState(request.proposals);
  useEffect(() => {
    console.log(request)
  })


  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.proposals, [Query.equal('request', request.$id)]);
       console.log(response.documents)
        setProposals(response.documents);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    fetchProposals();
  },[])
  const openMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url);
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
  return (
    <View style={styles.container}>
    
      <StatusBar style="dark" />
<View style={{backgroundColor:"#f7f9fc"}}>
      <View style={styles.card}>
        <Text style={styles.title}>{request.request_title}</Text>
        <Text style={styles.type}>{serviceTypes[request.service_type]}</Text>
        <Text style={styles.description}>{request.request_description}</Text>
        <Text style={styles.datetime}>Posted on: {convertDate(request.posted_datetime)}</Text>

        <TouchableOpacity onPress={() => openMap(request.latitude, request.longitude)} style={styles.mapButton}>
          <Text style={styles.mapButtonText}>📍 View Location in Maps</Text>
        </TouchableOpacity>
      </View>
      </View>
      <ScrollView>{
        proposals.map((proposal) => {

       
     

          return (
      <View key={proposal.proposal_id} style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      
      {/* User Info */}
      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }} 
        onPress={()=>navigation.navigate('UserProfile', { userData: proposal.proposed_user})}  // Navigate to the user profile screen
      >
        <Image source={require("../assets/icons/user.png")} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{proposal.proposed_user.name}</Text>
      </TouchableOpacity>

      {/* Estimated Amount */}
      <Text style={{ color: '#666' }}>Estimated: ₹{proposal.est_min_amount} - ₹{proposal.est_max_amount}</Text>

      {/* Bid Display */}
      <Text style={{ marginVertical: 8, fontSize: 16 }}>
     {proposal.proposal_description}
      </Text>
      <Button title="Chat" onPress={()=>navigation.navigate("ChatScreen",{receiverData:proposal.proposed_user,senderData:userData})}/>
      {/* Accept Button */}
      <Button title="Accept"/>
    </View>)})}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  backgroundColor:"#fff",
    paddingTop: 20,
    
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
    marginTop: 16,
    margin:10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  type: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  datetime: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
