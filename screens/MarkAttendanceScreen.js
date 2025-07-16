import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, StatusBar } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function MarkAttendanceScreen() {
  const [photo, setPhoto] = useState(null);

  const takeImage = async () => {
    const response = await launchImageLibrary({ mediaType: 'photo' });
    if (response.assets) {
      setPhoto(response.assets[0]);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return Alert.alert('⚠️ Error', 'Please select an image first!');
    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      type: "image/jpeg",
      name: `attendance.jpg`
    });

    try {
      const response = await fetch('http://192.168.136.1:8000/recognize', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = await response.json();

      Alert.alert('✅ Attendance Marked', `${data.filename} marked successfully`);
      setPhoto(null);
    } catch (e) {
      console.error(e);
      Alert.alert('❌ Error', 'Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>✅ Mark Attendance</Text>

      <TouchableOpacity style={styles.button} onPress={takeImage}>
        <Text style={styles.buttonText}>🖼️ Select Image</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}

      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
        <Text style={styles.buttonText}>📤 Upload & Recognize</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#1f6feb',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: 220,
    height: 220,
    marginVertical: 15,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#444',
  },
});
