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

const Tab = createBottomTabNavigator();

export default function App() { 
  //setup for dark and light theme
  const [theme, setTheme] = useState('Light');
  const themeData = {theme, setTheme};

  //setup for user auth
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUser(user);
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
