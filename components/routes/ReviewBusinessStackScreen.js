import { createStackNavigator } from "@react-navigation/stack"
import PublishingPagePreview from "../screens/PublishingPagePreview";
import ReviewPage from "../screens/ReviewPage";
import PendingBusinessPage from "../screens/PendingBusinessPage";
import { Button } from "react-native";
import { useContext, useState } from "react";
import { ReviewBusinessStackScreenContext } from "../contexts/ReviewBusinessStackScreenContext";
import Toast from "react-native-toast-message";
import { sendBusinessDataToDatabase } from "../dbcalls";
import { handleCreateToast } from "../settings-components/Toast";

const ReviewBusinessPageStack = createStackNavigator();

export default function ReviewBusinessStackScreen({ navigation }) {
    const [publishingBusinessData, setPublishingBusinsesData] = useState(null);

    const handleSetPublishingbusinessData = (data) => {
        setPublishingBusinsesData(data);
    }
    const businessDataContext = {handleSetPublishingbusinessData};


    // submits business
    const handleSubmission = async () => {
        await sendBusinessDataToDatabase(publishingBusinessData);
        handleCreateToast('success', 'Business Has Been Published', 'bottom');
        navigation.goBack(3);
    }

    return (
        <ReviewBusinessStackScreenContext.Provider value = {businessDataContext}>
            <ReviewBusinessPageStack.Navigator
                screenOptions = {{
                    headerStyle: { backgroundColor: '#EF5A6F' },
                    headerTintColor: 'white',
                }}
            >
                <ReviewBusinessPageStack.Screen 
                    name = "ReviewPage"
                    component = {ReviewPage}
                    options = {{title: 'Pending Businesses'}}
                />
                <ReviewBusinessPageStack.Screen 
                    name = "PendingBusinessPage" 
                    component = {PendingBusinessPage} 
                    options={{
                        title: 'Review', 
                        headerBackTitle: 'Back',
                    }}
                />
                <ReviewBusinessPageStack.Screen 
                    name = "PublishingPagePreview"
                    component = {PublishingPagePreview}
                    options = {{
                        title: 'Preview', 
                        headerBackTitle: 'Back',
                        headerRight: () => (
                            <Button 
                                title = 'Submit'
                                color = 'white'
                                onPress = {() => handleSubmission()}
                            />
                        )
                    }}
                />
            </ReviewBusinessPageStack.Navigator>
            <Toast />
        </ReviewBusinessStackScreenContext.Provider>

    )
}