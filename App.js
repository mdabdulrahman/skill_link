import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GetStarted from './screens/GetStarted';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import { account } from './AppWrite'; // Import the Appwrite account object
import { useState,useEffect } from 'react';
import Home from './screens/Home';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './utils/registerForPushNotificationsAsync';
// Initialize the Stack navigator
const Stack = createNativeStackNavigator();

// We always surround navigator with NavigationContainer
function StackNavigation() {
  
 


  return (
    <NavigationContainer>
    
      <Stack.Navigator>
      
   
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        
        <Stack.Screen name="GetStarted"  options={{ headerShown: false }} component={GetStarted}/>
        <Stack.Screen name="SignIn"  options={{ headerShown: false }} component={SignIn} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default StackNavigation;
