import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import { useState } from "react";
import {SignPageContext} from "../contexts/SignPageContext";
import AccountSettings from "../screens/AccountSettings";
import Saved from "../screens/Saved";
import SubmitPage from "../screens/SubmitPage";

const SettingsStack = createStackNavigator();

export default function SettingStackScreen() {
    const [signPage, setSignPage] = useState('Login');
    const signPageData = { signPage, setSignPage };

    return (
        <SignPageContext.Provider value = {signPageData}>
            <SettingsStack.Navigator    
                screenOptions = {{
                    headerStyle: { backgroundColor: '#EF5A6F' },
                    headerTintColor: 'white',
                    }}
            >
                <SettingsStack.Screen name = "SettingsScreen" component = {SettingsScreen} options={{title: 'Settings'}}/>
                <SettingsStack.Screen name = "SignPage" component = {LoginScreen} options={{title: signPage}}/>
                <SettingsStack.Screen name = "AccountSettings" component = {AccountSettings} options={{title: 'Account'}}/>
                <SettingsStack.Screen name = "SavedBusinesses" component = {Saved} options={{title: 'Saved'}}/>
                <SettingsStack.Screen name = "SubmitPage" component = {SubmitPage} options={{title: 'Submit a Page'}}/>
            </SettingsStack.Navigator>
        </SignPageContext.Provider>
    )
}