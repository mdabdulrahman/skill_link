import React, { useContext, useState } from 'react';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ID } from 'react-native-appwrite';
import { database, DATABASE_ID, COLLECTION_IDs } from '../../AppWrite'; // Adjust the import path as necessary
import sendNotificationToNearby from '../../utils/sendNotificationToNearby';
import getCurrentDateTime from '../../utils/getCurrentDateTime';
import Header from '../../components/Header';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
export default function PostServiceRequestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useContext(UserContext) // Get userData from route params
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to post a job.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };
/*    const updateUserPostedRequest = async (requestId) => {
    
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_IDs.users,
        userData.$id, // Use the document ID of the user
        {
          posted_requests: requestId, // Add the request ID to the user's posted requests
        }
      ).then(() => {
        console.log('User posted requests updated successfully!');
      }).catch((error) => {
        console.error('Error updating user posted requests:', error);
      })
   
   } */
  const handlePostRequest = async () => {
    if (!title || !description || !serviceType) {
      Alert.alert('Missing Fields', 'Please fill in all the fields.');
      return;
    }
    if (!location) {
      Alert.alert('Location Missing', 'Please fetch your location first.');
      return;
    }

    setLoading(true);

    const serviceRequest = {
      request_id: ID.unique(),
      requested_user: userData.userId,    // Replace with actual user ID later
      request_title: title,
      request_description: description,
      service_type: serviceType,
      latitude: location.latitude,
      longitude: location.longitude,
      posted_datetime:getCurrentDateTime(),
      status: 'open',
    };

  

     await database.createDocument(
                DATABASE_ID,
                COLLECTION_IDs.service_requests, 
                serviceRequest.request_id, // Unique document ID
                serviceRequest,
              ).then(() => {
                setLoading(false);
                
                sendNotificationToNearby(location.latitude, location.longitude, serviceRequest);

    Alert.alert('Success', 'Your service request has been posted!');
              //  navigation.navigate('SignIn'); // Navigate to Sign In screen after successful signup
              }).catch((error) => {
                Alert.alert('Error creating document:', error.message);
              });

   navigation.navigate('ServiceSeekerHome'); // Navigate to the home screen after posting the request
    setTitle('');
    setDescription('');
    setServiceType('');
    setLocation(null);
  };

  return (
    <View style={{ paddingTop:20,backgroundColor:"#fff" }}>
    <Header  userData={userData}/>
    <StatusBar style='auto' />
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.header}> Service Request</Text>

      <TextInput
        style={styles.input}
        placeholder="Request Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the issue..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={8}
      />

<Picker

        selectedValue={serviceType}
        onValueChange={(itemValue) => setServiceType(itemValue)}
        style={styles.input}
      >
         <Picker.Item label="Select Service Type" value='' />
        <Picker.Item label="Mechanic" value="mechanic" />
        <Picker.Item label="Plumber" value="plumber" />
        <Picker.Item label="Electrician" value="electrician" />
        <Picker.Item label="Construction Worker" value="construction_worker" />
        <Picker.Item label="Painter" value="painter" />
        <Picker.Item label="Carpenter" value="carpenter" />
        <Picker.Item label="AC Technician" value="ac_technician" />
      </Picker>

      <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
        <Text style={styles.locationButtonText}>
          {location ? '✅ Location Selected' : '📍 Get Current Location'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.postButton} onPress={handlePostRequest} disabled={loading}>
        <Text style={styles.postButtonText}>
          {loading ? 'Posting...' : 'Post Request'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
   
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
    justifyContent: 'center'
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
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
    height: 200,
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
  postButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  }
});
