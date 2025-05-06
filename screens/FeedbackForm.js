import React, { useState ,useContext} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-paper';  // Avatar for profile picture
import { database, DATABASE_ID,COLLECTION_IDs } from '../AppWrite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';  // User context for accessing user data
import { ID } from 'react-native-appwrite';  // For generating unique IDs
import { sendPushNotification } from '../utils/sendPushNotification';
const ReviewForm = () => {
  
  const navigation = useNavigation();  // Navigation object for navigation
  const route = useRoute();  // Route object for accessing route parameters
  const {request,provider} = route.params;  // Destructure request and provider from route parameters
  const { userData } = useContext(UserContext);  // User context for accessing user data
  const [rating, setRating] = useState(0);  // Rating state (1 to 5)
  const [comment, setComment] = useState('');  // Comment state
let userName =provider.name
  // Handle rating selection
  const handleRatingSelect = (rate) => {
    setRating(rate);
  };
  let updateRequestStatus = async() => {
    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_IDs.service_requests,
      request.request_id,
      {
        status: "completed",
      }
    ).then(() => {
      console.log("Service request status updated to completed.");
    }).catch((error) => {
      console.error('Error updating service request status:', error);
    });
  }
  let updateProposalStatus = async() => {
    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_IDs.proposals,
      request.accepted_proposal.proposal_id,
      {
        status: "completed",
      }
    ).then(() => {
      console.log("Proposal status updated to completed.");
    }).catch((error) => {
      console.error('Error updating proposal status:', error);
    });
  }
  // Handle form submission
  const handleSubmit = async() => {
    if (rating === 0 || comment === '') {
      alert("Please provide a rating and a comment.");
      return;
    }
    let review_id = ID.unique()
    await database.createDocument(
      DATABASE_ID,
      COLLECTION_IDs.reviews,
      review_id,
      {
        review_id: review_id,
        rating: rating.toString(),  // Convert rating to string for storage
        review: comment,
        proposal_id: request.accepted_proposal.proposal_id,  // Link to the service request
        provider: provider.userId,  // Link to the service provider
        reviewer: userData.userId,  // Link to the user who is giving the review
      }
    ).then(() => {
      let message = {
        to: provider.push_token,
        title: userData.name+", Gave you a review "+rating+" stars",
        body: comment,
        data: { type:"review",request_id: request.request_id,review_id:review_id },
        
      }
      sendPushNotification(message);
      updateProposalStatus()
      updateRequestStatus()
      alert("Review submitted!");
      navigation.navigate("ServiceSeekerHome");
  }).catch((error) => {
      console.error('Error creating review:', error);
    })

    // Submit the review (you can integrate API here)
    console.log("Review Submitted:", { rating, comment });
   
    setRating(0);  // Reset rating after submission
    setComment('');  // Reset comment after submission
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* Avatar and User Name */}
        <View style={styles.header}>
          <Avatar.Text label={userName.charAt(0).toUpperCase()} size={40} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <Text style={styles.title}>Give Your Rating</Text>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingSelect(index + 1)}>
              <Ionicons
                name={index < rating ? 'star' : 'star-outline'}
                size={30}
                color="#FFD700"
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Review Comment */}
        <TextInput
          label="Your Review"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          style={styles.textInput}
          placeholder="Write your comment here"
        />

        {/* Submit Button */}
        <Button mode="contained" onPress={()=>handleSubmit()} style={styles.submitButton}>
          Submit Review
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  card: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: '#4caf50', // Green background for the avatar
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',  // Light blue button
  },
});

export default ReviewForm;
