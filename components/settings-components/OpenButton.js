import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OpenButton(props) {
    const { 
        defaultValue, 
        setPublishingHours, 
        index,
        day
    } = props;
    const [isOpen, setIsOpen] = useState(defaultValue || false);
    const { colors } = useTheme();

    // used to map the index of the day to the actual day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const offColor = 'gray';
    return (
        <View key = {days[index]} style = {styles.hoursWrapper}>
            <View style = {{flexDirection: 'row', margin: 4}}> 
                <Text style = {[styles.timeTitle, {color: colors.text}]}>{days[index]}</Text>
                <TouchableOpacity
                    style = {[styles.container, {backgroundColor: (isOpen ? '#6fc276' : '#EF5A6F')}]}
                    onPress = {() => setIsOpen((prevOpen) => !prevOpen)}
                >
                    {isOpen ? (<Text style = {styles.buttonText}>Open</Text>) 
                        : <Text style = {styles.buttonText} >Closed</Text>}
                </TouchableOpacity>
            </View>
            <View style = {styles.timeWrapper}>
                <Text style = {[styles.timeText, {color: (isOpen ? colors.text : offColor)}]}>From: </Text>
                <TextInput 
                    editable = {isOpen}
                    style = {[styles.timeInput, 
                             {borderColor: (isOpen ? colors.text : offColor)},
                             {color: (isOpen ? colors.text : offColor)}
                    ]}
                    value = {day.openTime}
                    onChangeText = {(text) => {
                        setPublishingHours((prevState) => {
                            const newHours = [...prevState];
                            newHours[index] = { ...newHours[index], openTime: text};
                            return newHours;
                        })
                    }}
                />
                <Text style = {[styles.timeText, {color: (isOpen ? colors.text : offColor)}]}>To: </Text>
                <TextInput 
                    editable = {isOpen}
                    style = {[styles.timeInput, 
                             {borderColor: (isOpen ? colors.text : offColor)},
                             {color: (isOpen ? colors.text : offColor)}
                    ]}                    value = {day.closeTime}
                    onChangeText = {(text) => {
                        setPublishingHours((prevState) => {
                            const newHours = [...prevState];
                            newHours[index] = { ...newHours[index], closeTime: text};
                            return newHours;
                        })
                    }} 
                /> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        fontWeight: 500
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
        borderRadius: 5, 
        marginHorizontal: 8,
        width: 60
    },
    timeTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginVertical: 4,
        width: 120
    },
    timeInput: {
        fontSize: 16,
        padding: 4,
        borderWidth: 1,
        borderRadius: 6,
        width: '80',
        height: '28',
        marginRight: 8,
    },
    hoursWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    timeText: {
        fontSize: 18,
        fontWeight: 400,
        marginVertical: 4,
    },
    timeWrapper: {
        flexDirection: 'row',
        marginTop: 2
    },
})