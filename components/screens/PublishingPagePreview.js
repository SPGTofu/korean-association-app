import { ScrollView, Text, View } from "react-native";
import BusinessInfoScreen from "./BusinessInfoScreen";

export default function PublishingPagePreview({ route }) {
    const { previewData } = route.params;

    return (
        <View>
            <BusinessInfoScreen businessData = {previewData} isPreview = {true}/>
        </View>
    )
}