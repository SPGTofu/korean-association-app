import { Text, View } from "react-native";

export default function CopyrightText(textColor, size) {
    const currDate = new Date();
    const currYear = currDate.getFullYear();

    return (
        <View style = {{justifyContent: 'center', alignItems: 'center'}}> 
            <Text
                style = {{
                    color: textColor,
                    fontSize: size,
                    margin: 12
                }}
            >
                Copyright @{currYear} Korean Association App
            </Text>
        </View>
    )
}