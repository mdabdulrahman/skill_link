import { View, Text, TouchableOpacity, StyleSheet ,ScrollView,Image} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header';
import { Linking } from 'react-native';
import ProposalForm from './ProposalForm';
export default function ViewServiceRequestsProvider() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request, userData } = route.params;

  const openMap = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url);
  };
  let checkUserProposed = () => {
    let proposed = false
    request.proposals.forEach((proposal) => {
      if(proposal.proposed_user.userId == userData.userId){
        proposed = true
      }
    })
    return proposed
  }
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
    <ScrollView>
    <View style={styles.container}>
    
      <StatusBar style="dark" />
<View style={{backgroundColor:"#f7f9fc"}}>
   
      <View style={styles.card}>
        <Text style={styles.title}>{request.request_title}</Text>
        <Text style={styles.type}>{serviceTypes[request.service_type]}</Text>
        <Text style={styles.description}>{request.request_description}</Text>
        <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} >
        <Image source={require("../../assets/icons/user.png")} style={{width: 20, height: 20}} />
        <Text >{"\t"+request.requested_user.name}</Text>
        </TouchableOpacity>
        <Text style={styles.datetime}>Posted on: {convertDate(request.posted_datetime)}</Text>
        
        <TouchableOpacity onPress={() => openMap(request.latitude, request.longitude)} style={styles.mapButton}>
          <Text style={styles.mapButtonText}>📍 View Location in Maps</Text>
        </TouchableOpacity>
      </View>
      {checkUserProposed()?<Text style={{textAlign:"center",fontSize:20,fontWeight:"bold"}}>You have already proposed for this request</Text>:
      <ProposalForm userData={userData} request={request}/>}
      </View>
    </View>
    </ScrollView>
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
