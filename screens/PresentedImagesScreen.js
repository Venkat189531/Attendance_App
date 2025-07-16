import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, StatusBar } from 'react-native';

export default function PresentedImagesScreen() {
  const [imageNames, setImageNames] = useState([]);

  const fetchImageNames = async () => {
    try {
      const response = await fetch('http://192.168.136.1:8000/presentedImages'); // Replace with your actual IP
      const data = await response.json();
      const names = data.presentedImages.map(item => item.name);
      setImageNames(names);
    } catch (e) {
      console.error(e);
      Alert.alert('❌ Error', 'Failed to fetch image names');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>🖼️ Presented Image Names</Text>

      <TouchableOpacity style={styles.button} onPress={fetchImageNames}>
        <Text style={styles.buttonText}>🔄 Fetch Image Names</Text>
      </TouchableOpacity>

      <FlatList
        data={imageNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.nameBox}>
            <Text style={styles.nameText}>📁 {item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1f6feb',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nameBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  nameText: {
    color: '#ddd',
    fontSize: 16,
  },
});
