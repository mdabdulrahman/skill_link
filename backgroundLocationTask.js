// backgroundLocationTask.js
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {database,DATABASE_ID,COLLECTION_IDs} from './AppWrite';
import { use } from 'react';
export const SHARE_SERVICEPROVIDER_LOCATION = 'background-location-task';

let updateLocation = async (latitude,longitude)=>{
    
    let user_document_id = await AsyncStorage.getItem("user_document_id");
    const result = await database.updateDocument(
        DATABASE_ID,
        COLLECTION_IDs.users,
        user_document_id,
        {   
    "latitude": latitude,
    "longitude": longitude, 
        }
    ).then((response) => {
        console.log("Location updated successfully:", response);
    })
    .catch((error) => {
      console.log(user_document_id);
        console.error("Error updating location:", error);
    });
    
}

TaskManager.defineTask(SHARE_SERVICEPROVIDER_LOCATION, ({ data, error }) => {
  if (error) return;

  const location = data?.locations?.[0];
  if (location) {
    const { latitude, longitude } = location.coords;
    // 👉 Send to Appwrite or console log
    updateLocation(latitude,longitude);
    console.log('📍 Background Location:', latitude, longitude);
    // Example: sendToDatabase(latitude, longitude);
  }
});
