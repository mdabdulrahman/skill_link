import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { ID } from 'react-native-appwrite';
import { database ,DATABASE_ID,COLLECTION_IDs} from '../../AppWrite'; // Adjust the import path as necessary
import getCurrentDateTime from '../../utils/getCurrentDateTime';
import { useNavigation } from '@react-navigation/native';
export default function ProposalForm({userData,request}) {

  const [description, setDescription] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  function sendPushNotification(token,proposal_id) {
    const messages = 
        {
            to: token,
            title: userData.name+", Send a Proposal for your request",
            body: description,
            data: { type:"proposal",requestId: request.request_id,proposal_id:proposal_id },
            priority: 'high',
            
        };
  
  fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      }).then((response) => {
       
      } )
    }
  const handleSubmit = async () => {
    if ( !description || !minAmount || !maxAmount) {
      Alert.alert('All fields are required');
      return;
    }
    const data = {
      proposal_id:ID.unique(),
   
      proposal_description: description,
      est_min_amount: parseInt(minAmount),
      est_max_amount: parseInt(maxAmount),
    
      request: request.request_id,
      status: 'pending',
      submitted_at:getCurrentDateTime(),
      proposed_user:userData.userId,
    };
   
   await database.createDocument(
      DATABASE_ID,
      COLLECTION_IDs.proposals,
      data.proposal_id,
      data
    )
      .then(() => {
        Alert.alert('Proposal submitted successfully!');
      
        sendPushNotification(request.requested_user.push_token,data.proposal_id);
        
        // Optionally, navigate back or reset the form
      })
      .catch((error) => {
        console.error('Error submitting proposal:', error);
        Alert.alert('Error', 'Failed to submit proposal. Please try again.');
      });

      
    
  };

  return (
    <View style={styles.container}>
         <Text style={{textAlign:"center",fontWeight:"bold",fontSize:20}}>Submit Your Proposal</Text>
      

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      <Text style={styles.label}>Min Amount</Text>
      <TextInput
        style={styles.input}
        value={minAmount}
        onChangeText={setMinAmount}
        keyboardType="numeric"
        placeholder="Minimum amount"
      />

      <Text style={styles.label}>Max Amount</Text>
      <TextInput
        style={styles.input}
        value={maxAmount}
        onChangeText={setMaxAmount}
        keyboardType="numeric"
        placeholder="Maximum amount"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 40,
  },
  buttonWrapper: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
});
