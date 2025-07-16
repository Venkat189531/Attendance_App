import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerCard}>
        <Text style={styles.header}>🧠 FACE RECOGNITION ATTENDANCE</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery Picker')}>
        <Text style={styles.buttonText}>🗑️ Delete Image from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Take Image')}>
        <Text style={styles.buttonText}>📸 Take & Upload New Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mark Attendance')}>
        <Text style={styles.buttonText}>✅ Mark Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Show Attendance')}>
        <Text style={styles.buttonText}>📋 Show Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Presented Images')}>
        <Text style={styles.buttonText}>🖼️ Show Presented Images</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginVertical: 8,
    width: '85%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
