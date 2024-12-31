
import { createStackNavigator } from "@react-navigation/stack";
import {SubmitPageStackScreenContext} from "../contexts/SubmitPageStackScreenContext";
import { useContext, useState } from "react";
import SubmitPage from "../screens/SubmitPage";
import { UserContext } from "../contexts/UserContext"
import { Button, Keyboard } from "react-native";
import SubmitHoursScreen from "../screens/SubmitHoursScreen";
import SubmitPhotosScreen from "../screens/SubmitPhotosScreen";
import { handleCreateToast } from "../settings-components/Toast";
import Toast from "react-native-toast-message";
import { checkIfBusinessDataFieldsAreMissing, checkIfBusinessHoursAreMissing } from "../settings-components/SubmitPageFunctions";
import { createBusinessRequest } from "../dbcalls";
import { SettingStackContext } from "../contexts/SettingStackContext";

const SubmitPageStack = createStackNavigator();

// setup for a blank business
const defaultBusinessData = { 
    businessName: "",
    businessPhoneNumber: "",
    businessAddress: "",
    businessDescription: "",
    businessWebsite: "",
    instagram: "",
    yelp: "",
    facebook: "",
    hours: [
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
        {isOpen: false, openTime: ""},
    ],
    hoursDescription: "",
    imageUriArray: [],
    isOwner: false
}

export default function SubmitPageStackScreen({ navigation }) {
    const { user } = useContext(UserContext);
    const [businessData, setBusinessData] = useState(defaultBusinessData);
    const submitPageData = { businessData, setBusinessData };
    const { createToastOnSettingStack } = useContext(SettingStackContext);

    // navigate from business details screen to business hours screen

    function handleNavigateToBusinessHours() {
        Keyboard.dismiss();
        const isMissingField = checkIfBusinessDataFieldsAreMissing(businessData);
        if (isMissingField != 'CHECK_PASSED') {
            createToastOnSettingStack( 
                'error',        
                isMissingField,               
                'bottom');
            return;
        }
        navigation.navigate("SubmitHours"); 
        return;
    }

    // navigate from business hours screen to submit photos screen
    function handleSubmitHours() {
        Keyboard.dismiss()
        const isMissingHours = checkIfBusinessHoursAreMissing(businessData.hours);
        if (isMissingHours != 'CHECK_PASSED') {
            createToastOnSettingStack(
                'error', 
                isMissingHours,
                'bottom');
            return;
        }
        navigation.navigate("SubmitPhotos");
        return;
    }

    // fully submits the business
    function handleSubmitBusiness() {
        Keyboard.dismiss()
        const isMissingOnePhoto = businessData.imageUriArray.length < 1;
        if (isMissingOnePhoto) {
            createToastOnSettingStack(
                 'error',               
                 'Please submit at least one photo',              
                 'bottom');
            return;
        }
        try {
            createBusinessRequest(businessData, user);
            setBusinessData(defaultBusinessData);
            handleCreateToast(
                'success', 
                'Reuqest sent. Pending approval', 
                'bottom'
            );
            navigation.pop(3);
        } catch(error) {
            console.error(error);
            handleCreateToast(
                'error', 
                'Error creating request. Try again', 
                'bottom'
            );
        }
    }

    return (
     <SubmitPageStackScreenContext.Provider value = {submitPageData}>
        <SubmitPageStack.Navigator
            screenOptions = {{
                headerStyle: { backgroundColor: '#EF5A6F'},
                headerTintColor: 'white',
            }}
        >
            <SubmitPageStack.Screen 
                name = "SubmitPage" 
                component = {SubmitPage} 
                options = {{
                    title: 'Business Details',
                    headerRight: () => (
                        <Button
                            title = "Next"
                            color = 'white'
                            onPress = {() => handleNavigateToBusinessHours()}
                        />
                    )

                }}
            />
            <SubmitPageStack.Screen 
                name = "SubmitHours"
                component = {SubmitHoursScreen}
                options = {{
                    title: 'Business Hours',
                    headerRight: () => (
                        <Button 
                            title = "Next"
                            color = "white"
                            onPress = {() => handleSubmitHours()}

                        />
                    )
                }}
            />
            <SubmitPageStack.Screen 
                name = "SubmitPhotos"
                component = {SubmitPhotosScreen}
                options = {{
                    title: 'Business Photos',
                    headerRight: () => (
                        <Button 
                            title = "Submit"
                            color = 'white'
                            onPress = {() => handleSubmitBusiness()}
                        />
                    )
                }}
            />
        </SubmitPageStack.Navigator>
     </SubmitPageStackScreenContext.Provider>
    )
}