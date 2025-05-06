import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostServiceRequestForm from './screens/serviceSeeker/PostServiceRequestForm';
import GetStarted from './screens/GetStarted';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import { account } from './AppWrite'; // Import the Appwrite account object
import { useState,useEffect } from 'react';
import Home from './screens/Home';
import ViewServiceRequest from './screens/serviceSeeker/ViewServiceRequest';
import UserProfile from './screens/UserProfile';
import OpenServiceRequestsProvider from './screens/serviceProvider/OpenServiceRequestsProvider';
import ViewServiceRequestsProvider from './screens/serviceProvider/ViewServiceRequestsProvider';
import ChatScreen from './screens/chat/ChatScreen';
import ServiceSeekerHome from './screens/serviceSeeker/ServiceSeekerHome';
import ServiceProviderHome from './screens/serviceProvider/ServiceProviderHome';
import { UserContext } from './context/UserContext'; // Import the UserContext
import Conversations from './screens/chat/Conversations';
import FeedbackForm from './screens/FeedbackForm';
import ProviderProfile from './screens/ProviderProfile';
import OpenServiceRequests from './screens/serviceSeeker/OpenServiceRequests';
import ViewAcceptedServiceRequest from './screens/serviceSeeker/ViewAcceptedServiceRequest';
import AcceptedServiceRequestsProvider from './screens/serviceProvider/AcceptedServiceRequestsProvider';
import ViewAcceptedServiceRequestProvider from './screens/serviceProvider/ViewAcceptedServiceRequestProvider';
// Initialize the Stack navigator
const Stack = createNativeStackNavigator();

// We always surround navigator with NavigationContainer
function App() {
  
 
const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      
    <NavigationContainer>
    
      <Stack.Navigator>
      
   
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Stack.Screen name="PostServiceRequestForm" options={{ headerShown: false }} component={PostServiceRequestForm} />
        <Stack.Screen name="Conversations" options={{ headerShown: true,title:"Messages" }} component={Conversations} />
        <Stack.Screen name="ProviderProfile" options={{ headerShown: true,title:"Profile" }} component={ProviderProfile} />
        <Stack.Screen name="ViewAcceptedServiceRequestProvider" options={{ headerShown: true,title:"Service Requests" }} component={ViewAcceptedServiceRequestProvider} />
        <Stack.Screen name="AcceptedServiceRequestsProvider" options={{ headerShown: true,title:"Accepted Service Requests" }} component={AcceptedServiceRequestsProvider} />
        <Stack.Screen name="FeedbackForm" options={{ headerShown: true,title:"Feedback" }} component={FeedbackForm} />
        <Stack.Screen name="ViewAcceptedServiceRequest" options={{ headerShown: true,title:"Accepted Service Request" }} component={ViewAcceptedServiceRequest} />
        <Stack.Screen name="ServiceSeekerHome" options={{ headerShown: false }} component={ServiceSeekerHome} />
        <Stack.Screen name="ServiceProviderHome" options={{ headerShown: false }} component={ServiceProviderHome} />
        <Stack.Screen name="ViewServiceRequest"  options={{ headerShown: true, title:"Service Request" }} component={ViewServiceRequest} />
       <Stack.Screen name= "OpenServiceRequests" options={{ headerShown: true, title:"Open Service Requests" }} component={OpenServiceRequests} />
        <Stack.Screen name="OpenServiceRequestsProvider"  options={{ headerShown: true, title:"Open Service Requests" }} component={OpenServiceRequestsProvider} />
       <Stack.Screen name="ViewServiceRequestsProvider"  options={{ headerShown: true, title:"Service Request" }} component={ViewServiceRequestsProvider} />
       <Stack.Screen name="ChatScreen" options={{ headerShown: true, title:"Chat" }} component={ChatScreen} />
        <Stack.Screen name="UserProfile" options={{ headerShown: true, title:"Account" }} component={UserProfile} />
        <Stack.Screen name="GetStarted"  options={{ headerShown: false }} component={GetStarted}/>
        <Stack.Screen name="SignIn"  options={{ headerShown: false }} component={SignIn} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUp} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </UserContext.Provider>
  );
}


export default App;
