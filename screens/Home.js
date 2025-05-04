import {React,useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,ActivityIndicator} from 'react-native';
import { account,database } from '../AppWrite';
import { Query } from 'react-native-appwrite';
import { COLLECTION_IDs, DATABASE_ID } from '../AppWrite';
import { logOut } from '../Authentication';
import { Alert } from 'react-native';
import ServiceProviderPage from './ServiceProviderHome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';
import ServiceSeekerHome from './ServiceSeekerHome';
import Header from '../components/Header';
export default function Home({ navigation }) {
  

 Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const [token, setToken] = useState(null);
useEffect(() => {
  
  registerForPushNotificationsAsync().then(async token => {
    
   setToken(token);
  
  });
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log(notification);
  });
  return () => subscription.remove(); // Clean up the subscription on unmount

}, [])

  const [userData, setUserData] = new useState(null);
  let userid ; 
  let getuserData = async()=>
      {
          await account.get().then((response) => {
    console.log('User data:', response);
    userid = response.$id; // Get the user ID from the response
  }).catch((error) => {
    console.error('Error fetching user data:', error);
  }   );
  await database.listDocuments(DATABASE_ID, COLLECTION_IDs.users, [Query.equal('userId', userid)]).then((response) => {
      console.log('User data:', response.documents[0]);
      setUserData(response.documents[0]);
      AsyncStorage.setItem("user_document_id", response.documents[0].$id);

    }).catch((error) => {
      console.error('Error fetching user data:', error);
    }
    );
}
    useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const response = await account.get();
          console.log(response);
          getuserData();
        } catch (error) {
            navigation.replace('GetStarted'); // Navigate to GetStarted screen if user is logged in
          console.log("no user found");
        }
     
      };
      checkLoginStatus();

      
     
    }
    , []);
 
   
  const handleLogout = async() => {
    // Clear session if needed
   logOut(navigation);


  };

  return (<>
    {userData == null?(   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>):(
    <View style={styles.container}>
           
      {userData.role=="service_provider"?<ServiceProviderPage token={token} userData={userData} />:
      <ServiceSeekerHome userData={userData} token={token} />
      }
     {/*  <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity> */}
        
    </View>)}</>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 ,paddingTop:20,backgroundColor:"#fff"},
  text: { fontSize: 24, fontWeight: 'bold' },
  subText: { fontSize: 18, marginVertical: 10 },
  button: { backgroundColor: '#ff4444', padding: 10, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
