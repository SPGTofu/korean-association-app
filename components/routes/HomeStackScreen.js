import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BusinessInfoScreenHome from "../screens/BusinessInfoScreenHome";
import { KeyboardAvoidingView, Platform } from "react-native";
const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
        <KeyboardAvoidingView
            behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
            style = {{flex: 1}}
            keyboardVerticalOffset = '90'
        >
            <HomeStack.Navigator 
                screenOptions = {{ 
                    headerStyle: { backgroundColor: '#EF5A6F'},
                    headerTintColor: 'white',
                    }}
            >
                <HomeStack.Screen name = "HomeScreen" 
                                component = {HomeScreen} 
                                options={{ title: 'Home'}}
                />
                <HomeStack.Screen name = "InformationScreen" 
                                component = {BusinessInfoScreenHome} 
                                options={{ title: 'Information'}}
                />
            </HomeStack.Navigator>
        </KeyboardAvoidingView>
    )
}