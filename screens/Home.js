import {React,useState,useEffect, use} from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,ActivityIndicator} from 'react-native';
import { account,database } from '../AppWrite';
import { Query } from 'react-native-appwrite';
import { COLLECTION_IDs, DATABASE_ID } from '../AppWrite';
import { logOut } from '../Authentication';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import * as Notifications from 'expo-notifications';

import { UserContext } from '../context/UserContext';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';

export default function Home({ navigation }) {
  const {setUserData} = useContext(UserContext);

 Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const [token, setToken] = useState(null);
useEffect(() => {
  
/*   registerForPushNotificationsAsync().then(async token => {
    
   setToken(token);
  
  }); */
  /* const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log(notification);
  }); */
 /*  return () => subscription.remove(); */ // Clean up the subscription on unmount

}, [])

  
  let userid ; 
  let getuserData = async(pushtoken)=>
      {
          await account.get().then((response) => {
  
    userid = response.$id; // Get the user ID from the response
  }).catch((error) => {
    console.error('Error fetching user data:', error);
  }   );
  await database.listDocuments(DATABASE_ID, COLLECTION_IDs.users, [Query.equal('userId', userid)]).then((response) => {
      
      let userData = response.documents[0];
      AsyncStorage.setItem("user_document_id", response.documents[0].$id);
      userData.push_token = pushtoken;
     
      setUserData(userData);
      if(userData.role == "service_provider") navigation.replace("ServiceProviderHome");
      else navigation.replace("ServiceSeekerHome");

    }).catch((error) => {
      console.error('Error fetching user data:', error);
    }
    );
}
    useEffect(() => {
      const checkLoginStatus = async (pushtoken) => {
        try {
          const response = await account.get();
         
          getuserData(pushtoken);
        } catch (error) {
            navigation.replace('GetStarted'); // Navigate to GetStarted screen if user is logged in
          
        }
     
      };
      registerForPushNotificationsAsync().then( pushtoken => {
   
        checkLoginStatus(pushtoken);
       });
    

      
     
    }
    , []);
 
   
  const handleLogout = async() => {
    // Clear session if needed
   logOut(navigation);


  };

  return (<>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#000" />
    </View></>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 ,paddingTop:20,backgroundColor:"#fff"},
  text: { fontSize: 24, fontWeight: 'bold' },
  subText: { fontSize: 18, marginVertical: 10 },
  button: { backgroundColor: '#ff4444', padding: 10, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
