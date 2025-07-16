import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, StyleSheet, StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function TakeImageScreen() {
  const [photo, setPhoto] = useState(null);
  const [prompt, setPrompt] = useState('');

  const takeImage = async () => {
    const response = await launchImageLibrary({ mediaType: 'photo' });
    if (response.assets) {
      setPhoto(response.assets[0]);
    }
  };

  const uploadNewPhoto = async () => {
    if (!photo) return Alert.alert('Error', 'Please select a photo first');
    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      type: "image/jpeg",
      name: `${prompt || 'image'}.jpg`
    });
    try {
      let response = await fetch('http://192.168.136.1:8000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const data = await response.json();
      Alert.alert('✅ Success', `${data.filename} uploaded successfully`);
      setPrompt('');
      setPhoto(null);
    } catch (e) {
      console.error(e);
      Alert.alert('❌ Error', 'Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>📸 Upload New Face Image</Text>

      <TouchableOpacity style={styles.button} onPress={takeImage}>
        <Text style={styles.buttonText}>Select Image from Gallery</Text>
      </TouchableOpacity>

      {photo && (
        <Image source={{ uri: photo.uri }} style={styles.image} />
      )}

      <TextInput 
        placeholder="Enter a name (e.g., harry)"
        placeholderTextColor="#bbb"
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadNewPhoto}>
        <Text style={styles.buttonText}>🚀 Upload Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding:20,
    backgroundColor:'#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
    textAlign: 'center',
  },
  button:{
    backgroundColor:'#1f6feb',
    padding:14,
    borderRadius:12,
    marginBottom:12,
    width: '90%',
    alignItems: 'center',
  },
  uploadButton:{
    backgroundColor:'#28a745',
    padding:14,
    borderRadius:12,
    marginTop:12,
    width: '90%',
    alignItems: 'center',
  },
  buttonText:{
    color:'#fff',
    fontWeight:'600',
    fontSize:16,
  },
  image:{
    width:220,
    height:220,
    marginVertical:15,
    borderRadius:14,
    borderWidth:2,
    borderColor:'#444'
  },
  input:{
    width:'90%',
    height:50,
    borderWidth:1,
    borderColor:'#444',
    borderRadius:12,
    paddingHorizontal:15,
    backgroundColor:'#1e1e1e',
    color:'#fff',
    marginVertical:10,
    fontSize:16,
  }
});
