import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

import { View, Text, Button } from 'react-native';

export default function CheckFile() {
    const [selectedDocuments, setSelectedDocuments] = useState();
  const pickDocuments = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // optional
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      if (selectedDocuments.length < 5) {
        setSelectedDocuments([...selectedDocuments, result]);
      } else {
        console.log('Maximum of 5 documents allowed.');
      }
    } else {
      console.log('Document selection cancelled.');
    }
  } catch (error) {
    console.log('Error picking documents:', error);
  }
};
  return (
    <View>
      <Text>CheckFile</Text>
      <Button title="Pick Document" onPress={() => pickDocuments()} />
    </View>
  )
}