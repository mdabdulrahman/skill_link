// ServiceProviderPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { startBackgroundLocation, stopBackgroundLocation } from '../locationService';
import { database } from '../AppWrite';
import { COLLECTION_IDs, DATABASE_ID } from '../AppWrite'; // Adjust the import path as necessary
const ServiceProviderPage = ({ userData,token }) => {
  const [isAvailable, setIsAvailable] = useState(false);
async function updateDocumentAvailability() {


  await database.updateDocument(
    DATABASE_ID,
    COLLECTION_IDs.users,
    userData.$id, // Use the document ID of the user
    {
      isAvailable: isAvailable,
    }
  );}
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
    console.log("Token updated successfully")
    
    
},[])
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.service}>Service: {userData.service_type}</Text>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Available for Service</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>
    </View>
  );
};

export default ServiceProviderPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold' },
  service: { fontSize: 18, marginBottom: 20 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 16 }
});
