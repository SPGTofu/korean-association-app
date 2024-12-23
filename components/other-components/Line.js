import { useTheme } from "@react-navigation/native";
import { Dimensions, Text, View } from "react-native";

export default function Line({color, width, borderWidth, margin, marginTop, marginBottom}) {
    const screenWidth = Dimensions.get('window').width;
    const { colors } = useTheme();

    return (
        <View style = {{alignItems: 'center', justifyContent: 'center'}}>
            <View
                style = {{
                    borderBlockColor: color || colors.text,
                    borderWidth: borderWidth || .8,
                    width: width || (screenWidth * .96),
                    margin: margin || 12,
                    height: '0',
                    marginTop: marginTop,
                    marginBottom: marginBottom
                }}
            />
        </View>
    )
}
