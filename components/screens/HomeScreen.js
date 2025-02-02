import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HorizontalScroll from '../horizontal-scroll/HorizontalScroll';
import { NavigationContext } from '../contexts/NavigationContext';
import { useTheme } from '@react-navigation/native';
import CopyrightText from '../other-components/CopyrightText';
import { getPublishedBusinessesByType } from '../dbcalls';
import Line from '../other-components/Line';


export default function HomeScreen({ navigation }) {
    const [eateries, setEateries] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [finance, setFinance] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [realEstate, setRealEstate] = useState([]);
    const [religiousInstitutions, setReligiousInstitutions] = useState([]);
    const [salons, setSalons] = useState([]);
    const [services, setServices] = useState([])
    const [others, setOthers] = useState([])
    const { colors } = useTheme();
    
    // Updates all of the businesses fields with data in the db
    useEffect(() => {
        console.log( 'using effect in homeScreen');

        const getBusinesses = async () => {
            const types = [
                {type: 'Eatery', state: setEateries}, 
                {type: 'Clinic', state: setClinics}, 
                {type: 'Finance', state: setFinance},
                {type: 'Market', state: setMarkets}, 
                {type: 'Real Estate', state: setRealEstate}, 
                {type: 'Religious Institution', state: setReligiousInstitutions},
                {type: 'Salon', state: setSalons},
                {type: 'Service', state: setServices},
                {type: 'Other', state: setOthers}
            ];
            for (const type of types) {
                const arrayOfBusinesses = await getPublishedBusinessesByType(type.type);
                type.state(arrayOfBusinesses);
            }
        };

        getBusinesses();
        
    }, []);
    
    const categories = [
        { title: 'Eateries', data: eateries },
        { title: 'Clinics', data: clinics},
        { title: 'Markets', data: markets },
        { title: 'Real Estate', data: realEstate },
        { title: 'Finance', data: finance},
        { title: 'Religious Institutions', data: religiousInstitutions },
        { title: 'Salons', data: salons },
        { title: 'Services', data: services },
        { title: 'Other', data: others}
    ];

    return (
        <NavigationContext.Provider value = {navigation}>
            <ScrollView contentContainerStyle = {styles.screen}>
                { categories.map(({ title, data }, index) => (
                    data && data.length > 0 && (
                        <View 
                            key = { index }
                            style = {styles.scrollContainer}
                        >
                            <Text style = {[styles.title, {color: colors.text}]}>{ title }</Text>
                            <Line 
                                marginTop = {2} 
                                marignBottom = {2}
                                borderWidth = {1}
                            />
                            <HorizontalScroll businessData = { data }/>
                        </View>
                    ) 
                ))}
                <CopyrightText />
            </ScrollView>
        </NavigationContext.Provider>        
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 4
    },
    title: {
        fontSize: 36,
        margin: 8,
        marginBottom: 2,
        fontWeight: 600
    },
    scrollContainer: {
        marginTop: 12
    }
})
