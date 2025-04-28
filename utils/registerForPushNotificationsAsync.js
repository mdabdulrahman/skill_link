import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    if(Platform.OS ==="android"){
        await Notifications.setNotificationChannelAsync("default",{
            name:"default",
            importance:Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern:[0,250,250,250],
            lightColor:"#FF231F7C",
        });
    }

    if(Device.isDevice){
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if(existingStatus !== "granted"){
            const {status: requestedStatus} = await Notifications.requestPermissionsAsync();
            finalStatus = requestedStatus;
        }

        if(finalStatus !== "granted"){
            alert("Failed to get push token for push notification!");
            return;
        }
const projectId = Constants.expoConfig?.extra?.eas?.projectId ??
Constants?.easConfig?.projectId ;
if(!projectId){
    alert("Push notifications are not enabled in this project. Please enable them in the Expo dashboard.");
    return;
}
try{
    const pushTokenString =(await Notifications.getExpoPushTokenAsync({
        projectId,
    })).data;
    console.log("Push token: ", pushTokenString);
    return pushTokenString;
}
catch(e){
    console.error(e);
    alert("Failed to get push token for push notification!");
    return;
}
    }
else{
        alert("Must use physical device for Push Notifications");
    }
}