import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ImageButton(props) {
    const { title, onPress } = props;

    return (
        <TouchableOpacity 
            style = {styles.container}
            onPress = {()=> onPress? onPress() : null}
        >
            <Text>
                {title}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        height: '100%'
    }
});