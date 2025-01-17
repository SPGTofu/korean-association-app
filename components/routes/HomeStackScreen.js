import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BusinessInfoScreenHome from "../screens/BusinessInfoScreenHome";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    const { dark, colors } = useTheme();
    return (
        <KeyboardAvoidingView
            behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
            style = {{flex: 1}}
            keyboardVerticalOffset = '90'
        >
            <HomeStack.Navigator 
                screenOptions = {{ 
                    headerShown: false,
                    headerStyle: { 
                        backgroundColor: dark ? '#121212' : 'white'
                    },
                    headerTintColor: dark ? 'white' : 'black',
                    }}
            >
                <HomeStack.Screen 
                    name = "HomeScreen" 
                    component = {HomeScreen} 
                    options={{ title: 'Home'}}
                />
                <HomeStack.Screen 
                    name = "InformationScreen" 
                    component = {BusinessInfoScreenHome} 
                    options={{ title: 'Information', headerShown: true}}
                />
            </HomeStack.Navigator>
        </KeyboardAvoidingView>
    )
}