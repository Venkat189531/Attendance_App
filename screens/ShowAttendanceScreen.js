import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, StatusBar } from 'react-native';

export default function ShowAttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://192.168.136.1:8000/attendance'); // replace with actual IP
      const result = await response.json();
      setAttendanceData(result.attendance || []);
    } catch (e) {
      console.error(e);
      Alert.alert('❌ Error', 'Failed to fetch attendance');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>📋 Attendance Records</Text>

      <TouchableOpacity style={styles.button} onPress={fetchAttendance}>
        <Text style={styles.buttonText}>🔄 Fetch Attendance</Text>
      </TouchableOpacity>

      {attendanceData.length > 0 && (
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerText]}>🧑 Name</Text>
          <Text style={[styles.cell, styles.headerText]}>⏰ Time</Text>
        </View>
      )}

      <FlatList
        data={attendanceData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
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
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff33',
    paddingVertical: 8,
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#444'
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#ddd',
  }
});
