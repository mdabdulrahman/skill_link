import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostServiceRequestForm from './screens/PostServiceRequestForm';
import GetStarted from './screens/GetStarted';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import { account } from './AppWrite'; // Import the Appwrite account object
import { useState,useEffect } from 'react';
import Home from './screens/Home';
import ViewServiceRequest from './screens/ViewServiceRequest';
import UserProfile from './screens/UserProfile';
import OpenServiceRequestsProvider from './screens/OpenServiceRequestsProvider';
import ViewServiceRequestsProvider from './screens/ViewServiceRequestsProvider';
import ChatScreen from './screens/chat/ChatScreen';
// Initialize the Stack navigator
const Stack = createNativeStackNavigator();

// We always surround navigator with NavigationContainer
function StackNavigation() {
  
 


  return (
    <NavigationContainer>
    
      <Stack.Navigator>
      
   
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Stack.Screen name="PostServiceRequestForm" options={{ headerShown: false }} component={PostServiceRequestForm} />
        <Stack.Screen name="ViewServiceRequest"  options={{ headerShown: true, title:"Service Request" }} component={ViewServiceRequest} />
        <Stack.Screen name="OpenServiceRequestsProvider"  options={{ headerShown: true, title:"Open Service Requests" }} component={OpenServiceRequestsProvider} />
       <Stack.Screen name="ViewServiceRequestsProvider"  options={{ headerShown: true, title:"Service Request" }} component={ViewServiceRequestsProvider} />
       <Stack.Screen name="ChatScreen" options={{ headerShown: true, title:"Chat" }} component={ChatScreen} />
        <Stack.Screen name="UserProfile" options={{ headerShown: true, title:"Account" }} component={UserProfile} />
        <Stack.Screen name="GetStarted"  options={{ headerShown: false }} component={GetStarted}/>
        <Stack.Screen name="SignIn"  options={{ headerShown: false }} component={SignIn} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default StackNavigation;
