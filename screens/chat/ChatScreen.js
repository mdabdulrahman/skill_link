import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { database,DATABASE_ID,COLLECTION_IDs,client } from '../../AppWrite';
import { ID, Query } from 'react-native-appwrite';
import getCurrentDateTime from '../../utils/getCurrentDateTime';
import { Avatar } from 'react-native-paper';
const ChatScreen = () => {
  const [messageText, setMessageText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const {receiverData,senderData} = route.params;
  // Sample data for demonstration purposes
  
 
  const getChatHistory = async (userA, userB) => {
   
    const messages = await database.listDocuments(DATABASE_ID, COLLECTION_IDs.messages, [
      Query.or([
        Query.and([Query.equal('sender_id', userA), Query.equal('receiver_id', userB)]),
        Query.and([Query.equal('sender_id', userB), Query.equal('receiver_id', userA)]),
      ]),
      Query.orderDesc('timestamp')
    ])
    
    setMessages( messages.documents);
  };
  const [messages,setMessages] = useState( [
   
    ]);
  useEffect(()=>{
    getChatHistory(senderData.userId,receiverData.userId);
    client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_IDs.messages}.documents`, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        if((response.payload.sender_id === receiverData.userId && response.payload.receiver_id === senderData.userId)){
          setMessages(prev=>[response.payload,...prev]);
        } 
      }}
     ) ;
  

},[])
  // Function to render message bubble
  const renderMessage = ({ item }) => {
    const isSender = item.sender_id === senderData.userId; // Check if the message is sent by the current user
    
    return (
      <View style={[styles.messageContainer, isSender ? styles.senderMessage : styles.receiverMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };
  const updateConversations = async() => {
      let conversation =  await database.listDocuments(DATABASE_ID, COLLECTION_IDs.conversations, [Query.equal('sender',senderData.userId),Query.equal('receiver',receiverData.userId)])
      
      if(conversation.documents.length === 0){
        await database.createDocument(
          DATABASE_ID,
          COLLECTION_IDs.conversations,
          ID.unique(), // Unique ID for the message
          {
            sender:senderData.userId,
            receiver:receiverData.userId,
            last_message:messageText,
            timestamp:getCurrentDateTime()
          }
        ).then(
          ()=>{
              
              
        }
        )
      }
      else{
        await database.updateDocument(
          DATABASE_ID,
          COLLECTION_IDs.conversations,
          conversation.documents[0].$id, // Unique ID for the message
          {
            last_message:messageText,
            timestamp:getCurrentDateTime()
          }
        ).then(
          ()=>{
             
              
        }
        )
      }
    }
    async function sendPushNotification() {
      
      const messages = {
              to: receiverData.push_token,
              title: "New Message from "+senderData.name,
              body: messageText,
              data: { type:"message",sender_id: senderData.userId },
              
      }
      await fetch('https://exp.host/--/api/v2/push/send', {
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
  const sendMessage = async() => {
    if (messageText.trim() !== '') {


      const newMessage = {
        sender_id:senderData.userId,
        receiver_id:receiverData.userId,
        text: messageText,
        timestamp:getCurrentDateTime(), 
      }
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_IDs.messages,
        ID.unique(), // Unique ID for the message
        newMessage
      ).then(
        ()=>{
            
            updateConversations();
            sendPushNotification();
            setMessages([newMessage, ...messages]);
   
      setMessageText(''); 

        // Optionally, you can also send a push notification to the receiver here


        }
      )
      // Call your message sending function here (e.g., sendMessage())
// Clear input after sending
    }
  };

  return (
    <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
     <View style={styles.header}>
  <Avatar.Text size={40} label={receiverData.name[0]} style={styles.avatar} />
  <Text style={styles.headerText}>{receiverData.name}</Text>
</View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        inverted={true} // To make new messages appear at the bottom
        style={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={()=>getChatHistory(senderData.userId,receiverData.userId)} style={styles.sendButton}>
          <IconButton icon="refresh" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <IconButton icon="send" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#1F2937',
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  senderMessage: {
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-end',
  },
  receiverMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
  },
  sendButton: {
   
  
  },
});



export default ChatScreen;
