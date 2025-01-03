import './gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import HomeStackScreen from './components/routes/HomeStackScreen';
import SettingsStackScreen from './components/routes/SettingsStackScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {ThemeContext} from './components/contexts/ThemeContext';
import { UserContext } from './components/contexts/UserContext';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() { 
  // setup for dark and light theme
  const [theme, setTheme] = useState('Light');

  // get theme saved in storage
  useEffect(() => {
    console.log('using Effect1 in App');

    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme");
        setTheme(savedTheme == '"Dark"' ? savedTheme : 'Light');
      } catch (error) {
        console.error(error);
      }
    }

    const getUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        setUser(savedUser || null);
      } catch (error) {
        console.error('error fetching user from stroage: ', error);
      }
    }
    getTheme();
    getUserData();
  }, [])

  // handles setting of the theme to save in storage and state
  const handleSetTheme = async () => {
    try {
      const newTheme = (theme == 'Light' ? 'Dark' : 'Light');
      await AsyncStorage.setItem("app_theme", JSON.stringify(newTheme));
      setTheme(newTheme);
      console.log('useing Effect2 in App');
    } catch (error) {
      console.error(error);
    }
  }

  const themeData = {theme, handleSetTheme};

  //setup for user auth
  const [user, setUser] = useState(null);
  useEffect(() => {
    const handleAddUserToAsyncStroage = async (user) => {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    }

    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setUser(user);
        await handleAddUserToAsyncStroage(user);
      }
    })
  }, [])
  const userData = {user, setUser}

  return (
      <UserContext.Provider value = {userData}>
        <ThemeContext.Provider value = {themeData}>
          <NavigationContainer theme = {theme == 'Light' ? DefaultTheme : DarkTheme}>
            <Tab.Navigator
                screenOptions = { ({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === 'Home') {
                          iconName = focused? 'home' : 'home-outline';
                      } else if (route.name === 'Settings') {
                          iconName = focused? 'settings' : 'settings-outline';
                      }
                      return <Ionicons name = {iconName} size = {size} color = {color}/>
                  },
                  tabBarActiveTintColor: '#536493',
                  tabBarInactiveTintColor: '#536493',
              })}
            >
              <Tab.Screen name = "Home" 
                          component = {HomeStackScreen} 
                          options={{ headerShown: false }}
              />
              <Tab.Screen name = "Settings" 
                          component = {SettingsStackScreen} 
                          options={{ headerShown: false }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeContext.Provider>
      </UserContext.Provider>
  );
}
