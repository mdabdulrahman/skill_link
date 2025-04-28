import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
export default function GetStarted({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.innerContainer}>
        
        {/* Title */}
        <Text style={styles.title}>Let's Get Started!</Text>

        {/* Image */}
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.image} 
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
         {/*  <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => console.log('Sign In')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity> */}

          {/* Already have an account? */}
          <View style={styles.signInLinkContainer}>
            <Text style={styles.text}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // Dark background color
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: '#1E3A8A', // Blue color
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#4B5563', // Gray color
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  signInLink: {
    color: '#3B82F6', // Blue color
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 5,
  },
});
