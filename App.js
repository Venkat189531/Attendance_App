import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import TakeImageScreen from './screens/TakeImageScreen';
import MarkAttendanceScreen from './screens/MarkAttendanceScreen';
import ShowAttendanceScreen from './screens/ShowAttendanceScreen';
import PresentedImagesScreen from './screens/PresentedImagesScreen';
import GalleryPicker from './screens/GalleryPicker';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1f1f1f', // Dark header background
          },
          headerTintColor: '#fff', // Text color (white)
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            letterSpacing: 1,
            textTransform: 'uppercase',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gallery Picker" component={GalleryPicker} />
        <Stack.Screen name="Take Image" component={TakeImageScreen} />
        <Stack.Screen name="Mark Attendance" component={MarkAttendanceScreen} />
        <Stack.Screen name="Show Attendance" component={ShowAttendanceScreen} />
        <Stack.Screen name="Presented Images" component={PresentedImagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
