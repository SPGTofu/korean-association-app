import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LanguageButton({ title, language, changeLanguage }) {
    const buttonLang = title.toLowerCase();

    const getColor = () => {
        return buttonLang === language ? '#EF5A6F' : 'lightgray';
    }

    return (
        <TouchableOpacity style = {{
                                backgroundColor: getColor(),
                                padding: 10
                            }}
                          onPress = {() => changeLanguage(buttonLang)}
        >
            <Text>{title}</Text>
        </TouchableOpacity>
    )
}