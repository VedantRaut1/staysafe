import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from './components/screens/HomeScreen';
import NotificationsScreen from './components/screens/NotificationsScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import SOSScreen from './components/screens/SOSScreen';
import ManageContacts from './components/ManageContacts'; // Import the Manage Contacts screen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for SOS and Manage Contacts
function SOSStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SOSScreen" component={SOSScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ManageContacts" component={ManageContacts} options={{ title: 'Manage Contacts' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'SOS') {
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="SOS" component={SOSStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
