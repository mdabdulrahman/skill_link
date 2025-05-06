import React, { useContext,useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../../context/UserContext';
import { database , DATABASE_ID,COLLECTION_IDs} from '../../AppWrite';
import { Query } from 'react-native-appwrite';
import { useNavigation } from '@react-navigation/native';
export default function Conversations() {
    const navigation = useNavigation();
    const {userData} = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.conversations, [Query.equal('sender', userData.userId)]);
                setConversations(response.documents);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, []);
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
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatScreen', { receiverData: item.receiver, senderData: userData })}>
      {/* Replace with actual image source */}
      <Image source={require("../../assets/icons/user.png")} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.receiver.name}</Text>
        <Text style={styles.message}>{item.last_message}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{convertDate(item.timestamp)}</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.receiver.userId}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
      paddingHorizontal: 15,
      paddingTop: 20,
    },
    chatItem: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      padding: 12,
      
      
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 25,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontWeight: '600',
      fontSize: 16,
    },
    message: {
      color: '#555',
      marginTop: 2,
      fontSize: 14,
    },
    meta: {
      alignItems: 'flex-end',
    },
    time: {
      color: '#888',
      fontSize: 12,
      marginBottom: 4,
    },
  });
  