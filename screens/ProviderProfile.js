import React, { useEffect,useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database, DATABASE_ID, COLLECTION_IDs } from '../AppWrite'; // Adjust the import path as necessary
import { ID } from 'react-native-appwrite';
import { Query } from 'react-native-appwrite';
const ProviderProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerData } = route.params; // Assuming provider data is passed as a parameter
  const [reviews, setReviews] = useState([]); 

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.reviews, [Query.equal('provider', providerData.userId)]);
        
        setReviews(response.documents);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    fetchReviews();
  },[])
  
  const getStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <View style={{ flexDirection: 'row' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={16} color="#f1c40f" />
        ))}
        {halfStar && <Ionicons name="star-half" size={16} color="#f1c40f" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#f1c40f" />
        ))}
      </View>
    );
  };

  
  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <Avatar.Text 
        size={40} 
        label={item.reviewer.name.charAt(0).toUpperCase()} 
        style={{ backgroundColor: '#ccc', marginRight: 10 }} 
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.reviewer.name}</Text>
        {getStars(item.rating)}
        <Text style={styles.comment}>{item.review}</Text>
      </View>
    </View>
  );
let calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (parseInt(review.rating)), 0);
  
    return totalRating / reviews.length;
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Text 
          size={70} 
          label={providerData.name.charAt(0).toUpperCase()} 
          style={{ backgroundColor: '#007aff' }} 
        />
        <Text style={styles.name}>{providerData.name}</Text>
        <Text style={styles.service}>{providerData.service_type}</Text>
        {getStars(calculateAverageRating())}
        <Text style={styles.avgRating}>{calculateAverageRating()} / 5</Text>
      </View>

      <Text style={styles.sectionTitle}>Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={(item)=>renderReview(item)}
        keyExtractor={(item) => item.review_id}
        contentContainerStyle={styles.reviewList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  service: { fontSize: 16, color: '#555' },
  avgRating: { marginTop: 5, fontSize: 14, color: '#888' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  reviewList: { paddingBottom: 20 },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: { fontWeight: 'bold', fontSize: 14 },
  comment: { fontSize: 14, marginTop: 2, color: '#444' },
});

export default ProviderProfile;
