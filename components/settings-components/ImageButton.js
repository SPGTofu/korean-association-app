import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ImageButton(props) {
    const { title, onPress, position } = props;
    return (
        <TouchableOpacity 
            style = {[styles.container, 
                     {borderTopWidth: (position == 'bottom' ? 1 : 0)}
                ]}
            onPress = {()=> onPress? onPress() : null}
        >
            <Text style = {styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    text: {
        fontSize: 18,
        fontWeight: 500
    }
});