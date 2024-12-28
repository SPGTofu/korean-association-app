import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import BusinessInfoScreenHome from "../screens/BusinessInfoScreenHome";
const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
    return (
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
    )
}