import React, { use, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { account, COLLECTION_IDs, database, DATABASE_ID } from '../AppWrite';
import { ID } from 'react-native-appwrite';
import { Alert } from 'react-native';
import { createAccount,logIn } from '../Authentication';
export default function SignUp({ navigation }) {
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phno:'',
    password: '',
    confirmPassword: '',
    role: '',
    profession: '',
  });

  const professions = ['Mechanic', 'Plumber', 'Electrician', 'AC Technician', 'Carpenter', 'Construction Worker', 'Painter'];

  const handleSignup = async() => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    createAccount(navigation,form);
      

    
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
    if (role === 'service_provider') {
      setStep(2); // Move to profession selection
    } else {
      // Save service seeker data
      setStep(3); // Move to final step
    }
  };

  const handleProfessionSelect = (profession) => {
    setForm({ ...form, profession });
    // Save service provider data with profession
    setStep(3); // Move to final step
  };

  return (
    <View style={styles.container}>
          {/* Title */}
                <Text style={styles.title}>Sign Up</Text>
      {step === 3 && (
        <>
          <TextInput style={styles.input} placeholder="Name" onChangeText={(v) => setForm({ ...form, name: v })} />
          <TextInput  style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={(v) => setForm({ ...form, email: v })} />
          <TextInput  style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" onChangeText={(v) => setForm({ ...form, phno: v })} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry  onChangeText={(v) => setForm({ ...form, password: v })} />
          <TextInput  style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={(v) => setForm({ ...form, confirmPassword: v })} />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.label}>Select Role</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('service_seeker')}>
            <Text style={styles.buttonText}>Service Seeker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('service_provider')}>
            <Text style={styles.buttonText}>Service Provider</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.label}>Select Profession</Text>
          {professions.map((p) => (
            <TouchableOpacity key={p} style={styles.button} onPress={() => handleProfessionSelect(p.toLowerCase().replace(' ', '_'))}>
              <Text style={styles.buttonText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center',  backgroundColor: '#1F2937' },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: { borderWidth: 1, borderColor: '#ccc',padding: 10, marginVertical: 5, borderRadius: 8 ,backgroundColor: '#fff' },
  button: { backgroundColor: '#1E3A8A', padding: 12, marginVertical: 5, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 ,color: '#ffffff' },
});
