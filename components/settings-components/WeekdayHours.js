import { useContext, useEffect } from "react"
import { LayoutAnimation, StyleSheet, Switch, Text, TextInput, View } from "react-native"
import { SubmitPageStackScreenContext } from "../contexts/SubmitPageStackScreenContext"
import { useTheme } from "@react-navigation/native";

export default function WeekdayHours({ day, dateIndex }) {
    const { businessData, setBusinessData } = useContext(SubmitPageStackScreenContext);
    const { colors } = useTheme();

    // updates isOpen property of the day selected
    const updateIsOpenOfDay = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBusinessData((prevState) => ({
            ...prevState,
            hours: prevState.hours.map((hour, index) => (
                index === dateIndex ? {...hour, isOpen: !hour.isOpen }
                    : hour    
            ))
        }));
    }
    
    // update the open time of the day selected
    const updateOpenTimeOfDay = (text) => {
        setBusinessData((prevState) => ({
            ...prevState,
            hours: prevState.hours.map((hour, index) => (
                index === dateIndex ? {...hour, openTime: text}
                    : hour
            ))
        }))
    }
    
    return (
        <View style = {styles.weekdayObject}>
            <View style = {styles.weekdayContainer}>
                <Text style = {[styles.textContainer, {color: colors.text}]}>
                    We are open on {day || 'someday'}
                </Text>
                <Switch  
                    style = {styles.switchContainer}
                    value = {businessData.hours[dateIndex]?.isOpen || false}
                    trackColor = {{true: '#EF5A6F'}}
                    onValueChange = {() => {updateIsOpenOfDay()}}
                />
            </View>
            {businessData.hours[dateIndex].isOpen ? (
                <View style = {styles.dayHoursContainer} > 
                    <Text style = {[styles.hoursText, {color: colors.text}]}>
                        Time(s):
                    </Text>
                    <TextInput 
                        style = {[styles.textInput, {color: colors.text, borderColor: colors.text}]} 
                        onChangeText = {(text) => updateOpenTimeOfDay(text)}
                        placeholder = '10:00AM-2:00PM, 3:00PM-8:00PM'
                        placeholderTextColor = 'gray'
                    />
                </View>
            ) : null}
        </View>
    )
}


const styles = StyleSheet.create({
    weekdayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        fontSize: '18',
        flex: 1,
        justifyContent: 'flex-start',
    },
    weekdayObject: {
        margin: 4,
    },
    textInput: {
        borderWidth: 1,
        width: 260,
        borderRadius: 4,
        height: 30,
        marginHorizontal: 4,
        padding: 4

    },
    dayHoursContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4
    },
    hoursText: {
        marginHorizontal: 4,
        fontSize: 16
    }
})