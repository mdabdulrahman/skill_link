import { account ,database,DATABASE_ID,COLLECTION_IDs} from './AppWrite'; // Import the Appwrite account object
import { Alert } from 'react-native';
import { ID } from 'react-native-appwrite'; // Import the ID module from Appwrite

async function logIn (email,password,navigation){
    
    await account.createEmailPasswordSession(
        email, // email
        password // password
    ).then((res)=>{
        console.log(res);
       navigation.replace('Home'); // Navigate to Home screen after successful login 
    }  
    ).catch((error) => {
        console.error('Error creating session:', error);
        Alert.alert(error.message);
        
      });
      
}

async function createAccount(navigation,form){

     let userid = ID.unique();
        // Call Appwrite signup API
        await account.create(
          userid, // Unique user ID
            form.email, // User email
            form.password, // User password
            form.name, // User name
        ).then((response) => {   
    userid = response.$id; // Get the user ID from the response
    console.log('User created successfully:', response);
            
        }).catch((error) => {
          console.error('Error creating user:', error);
          Alert.alert('Error creating user:', error.message);
        });
        
        let data = {
            userId: userid, // User ID from Appwrite response
            name: form.name,
            email: form.email,
            phone: form.phno,
            role: form.role,
        }
        if(form.role === 'service_provider'){
            data.service_type = form.profession; // Add service type for service providers
        }
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_IDs.users, 
            userid, // Unique document ID
            data,
          ).then(() => {
            Alert.alert('User created successfully!');
            logIn(form.email,form.password,navigation); // Call logIn function after successful signup
          //  navigation.navigate('SignIn'); // Navigate to Sign In screen after successful signup
          }).catch((error) => {
            Alert.alert('Error creating document:', error.message);
          });
    
}

async function logOut(navigation,userId){
    await database.updateDocument(
        DATABASE_ID,
        COLLECTION_IDs.users,
        userId, // Use the document ID of the user
        {
          push_token: "", // Clear the push token on logout
        }
      ).then(() => {
        console.log('Push token cleared successfully!');
      }).catch((error) => {
        console.error('Error clearing push token:', error);
      });
    await account.deleteSessions().then((res)=>{
        console.log(res);
        navigation.replace('GetStarted'); // Navigate to Get Started screen after successful logout 
    }).catch((error) => {
        console.error('Error deleting session:', error);
        Alert.alert(error.message);
        
      });
}

export {logIn,logOut,createAccount};