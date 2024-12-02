import { View, Text, StyleSheet, FlatList, Image, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import noImageIcon from "../../assets/no-image-icon.jpg";

export default function BusinessInfoScreen({ route }) {
    const { businessData } = route.params;
    const { colors } = useTheme();


    return (
        <ScrollView contentContainerStyle = {styles.scrollView}>
            <View>
                <Text style = {[{color: colors.text}, styles.title]}>{businessData.name}</Text>
                <Text style = {[{color: colors.text}, styles.tag]}>{businessData.description}</Text>
                <Text style = {[{color: colors.text}, styles.phone]}>{businessData.contact}</Text>
                <FlatList
                    horizontal
                    alwaysBounceHorizontal
                    data = {businessData?.photos?.length > 0? businessData.photos : [noImageIcon]}
                    contentContainerStyle = {{alignItems: 'center', justifyContent: 'center', flex: 1 }}
                    renderItem = {({item}) => {
                        return (
                            <Image 
                                source = {{ uri: item.uri}}
                                style = {styles.photoStyle}
                            /> 
                        )
                    }}
                />
            </View>    
            <Text style = {[{color: colors.text}, styles.desc]}>Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text style = {[{color: colors.text}, styles.address]}>{businessData.address}</Text>
            <View style = {styles.mapContainer}>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 300
    },
    title: {
        fontSize: 32,
        margin: 4,
        marginBottom: 0,
        marginHorizontal: 12,
        fontWeight: 'bold'
    },
    tag: {
        fontSize: 24,
        margin: 4,
        marginTop: 0,
        marginHorizontal: 12
    },
    phone: {
        fontSize: 16,
        margin: 4,
        marginBottom: 8,
        marginHorizontal: 12 
    },
    desc: {
        fontSize: 16,
        margin: 12,
        marginHorizontal: 12
        
    },
    address: {
        fontZie: 16,
        margin: 4,
        marginTop: 20,
        marginHorizontal: 12
    },
    photoStyle: {
        width: 240,
        height: 200,
        margin: 1,
        borderRadius: 8,
        resizeMode: 'stretch',
        borderWidth: 1
    },
    maps: {
        width: '99%',
        height: '75%',
        margin: 0
    },
    mapContainer: {
        justifyContent: 'top',
        alignItems: 'center',
        margin: 0
    },
    mapText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    },
    mapTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -40 }, { translateY: -110 }],
        alignItems: 'center'
    }
})
