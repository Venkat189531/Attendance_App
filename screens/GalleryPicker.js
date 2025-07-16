import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function DeleteImageScreen() {
  const [filename, setFilename] = useState('');

  const handleDelete = async () => {
    if (!filename) {
      Alert.alert('Error', 'Please enter a filename to delete.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.136.1:8000/delete/${filename}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Success', `${data.filename} deleted successfully.`);
        setFilename('');
      } else {
        Alert.alert('❌ Error', data.detail || 'Failed to delete file');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>🗑️ Delete Image from Server</Text>
        <TextInput
          placeholder="Enter filename (e.g., harry.jpg)"
          value={filename}
          onChangeText={setFilename}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete File</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e53935',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
