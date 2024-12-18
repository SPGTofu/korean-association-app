import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import { useState } from "react";
import {SignPageContext} from "../contexts/SignPageContext";
import AccountSettings from "../screens/AccountSettings";
import Saved from "../screens/Saved";
import ReviewPage from "../screens/ReviewPage";
import PendingBusinessPage from "../screens/PendingBusinessPage";
import SubmitPageStackScreen from "./SubmitPageStackScreen";
import Toast from "react-native-toast-message";
import { handleCreateToast } from "../settings-components/Toast";
import { SettingStackContext } from "../contexts/SettingStackContext"

const SettingsStack = createStackNavigator();

export default function SettingStackScreen() {
    const [signPage, setSignPage] = useState('Login');
    
    const createToastOnSettingStack = (type, message, location) => {
        handleCreateToast(type, message, location);
    }
    
    // provides a context for the following variables
    const signPageData = { signPage, setSignPage };
    const settingContextData = { createToastOnSettingStack };
    
    return (
        <SettingStackContext.Provider value = {settingContextData}>
            <SignPageContext.Provider value = {signPageData}>
                <SettingsStack.Navigator    
                    screenOptions = {{
                        headerStyle: { backgroundColor: '#EF5A6F' },
                        headerTintColor: 'white',
                        }}
                >
                    <SettingsStack.Screen 
                        name = "SettingsScreen" 
                        component = {SettingsScreen} 
                        options={{title: 'Settings'}}
                    />
                    <SettingsStack.Screen 
                        name = "SignPage" 
                        component = {LoginScreen} 
                        options={{title: signPage}}
                    />
                    <SettingsStack.Screen 
                        name = "AccountSettings" 
                        component = {AccountSettings} 
                        options={{title: 'Account'}}
                    />
                    <SettingsStack.Screen 
                        name = "SavedBusinesses" 
                        component = {Saved} 
                        options={{title: 'Saved'}}
                    />
                    <SettingsStack.Screen 
                        name = "SubmitPageStack" 
                        component = {SubmitPageStackScreen} 
                        options={{title: 'Submit a Page', headerShown: false}}
                    />
                    <SettingsStack.Screen 
                        name = "ReviewPage"
                        component = {ReviewPage} 
                        options={{title: 'Review Pages'}}
                    />
                    <SettingsStack.Screen 
                        name = "PendingBusinessPage" 
                        component = {PendingBusinessPage} 
                        options={{title: 'Review Pages'}}
                    />
                </SettingsStack.Navigator>
                <Toast />
            </SignPageContext.Provider>
        </SettingStackContext.Provider>
    )
}