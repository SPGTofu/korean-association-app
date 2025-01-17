import { createStackNavigator } from "@react-navigation/stack";
import BusinessEditRequests from "../screens/business-edit-screens/BusinessEditRequests";
import RequestDetailsPage from "../screens/business-edit-screens/RequestDetailsPage";
import EditBusinessInfo from "../screens/business-edit-screens/EditBusinessInfo";
import { useContext, useState } from "react";
import { EditBusinessStackContext } from "../contexts/EditBusinessStackContext";
import PreviewEditedBusinessPage from "../screens/business-edit-screens/PreviewEditedBusinessPage";
import { Button } from "react-native";
import { removeBusinessEditRequestByID, updatePublishedBusinessDataWithEdits } from "../dbcalls";
import { SettingStackContext } from "../contexts/SettingStackContext";
import { useTheme } from "@react-navigation/native";

const BusinessEditStack = createStackNavigator();

export default function ReviewBusinessEditStack({ navigation }) {
    const { dark, colors } = useTheme();
    const [editedBusinessData, setEditedBusinessData] = useState(null);
    const editedBusinessDataContext = {editedBusinessData, setEditedBusinessData};
    const { createToastOnSettingStack } = useContext(SettingStackContext);

    const handleSubmission = async () => {
        // update data
        await updatePublishedBusinessDataWithEdits(editedBusinessData);

        // remove from businessEditRequests collection
        await removeBusinessEditRequestByID(editedBusinessData.requestID);

        createToastOnSettingStack('success', 'Business Has Been Edited', 'bottom');
        navigation.goBack(4);
    }

    return (
        <EditBusinessStackContext.Provider value = {editedBusinessDataContext}>
            <BusinessEditStack.Navigator
              screenOptions = {{
                headerStyle: { 
                    backgroundColor: dark ? '#121212' : 'white', 
                    height: 65
                },
                headerTintColor: dark ? 'white' : 'black',
                }}
            >
                <BusinessEditStack.Screen
                    name = "BusinessEditRequestsPage"
                    component = {BusinessEditRequests}
                    options = {{title: "Review Suggestions"}}
                />
                <BusinessEditStack.Screen 
                    name = "RequestDetailsPage"
                    component = {RequestDetailsPage}
                    options = {{title: "Suggestion"}}
                />
                <BusinessEditStack.Screen 
                    name = "EditBusinessInfoPage"
                    component = {EditBusinessInfo}
                    options = {{title: "Edit Business"}}
                />
                <BusinessEditStack.Screen 
                    name = "PreviewEditedBusinessPage"
                    component = {PreviewEditedBusinessPage}
                    options = {{
                        title: "Preview Business",
                        headerRight: () => (
                            <Button 
                                title = 'Submit'
                                color = {dark ? 'black' : 'white'}
                                onPress = {() => handleSubmission()}
                            />
                        )
                    }}
                />
            </BusinessEditStack.Navigator>
        </EditBusinessStackContext.Provider>
    )
}