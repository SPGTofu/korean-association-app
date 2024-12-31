import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HorizontalScroll from '../horizontal-scroll/HorizontalScroll';
import { Eateries } from '../../assets/business-data/Eateries';
import { NavigationContext } from '../contexts/NavigationContext';
import { Clinics } from '../../assets/business-data/Clinics';
import { Markets } from '../../assets/business-data/Markets';
import { RealEstateFinance } from '../../assets/business-data/RealEstateFinance';
import { ReligiousInstitutions } from '../../assets/business-data/ReligiousInstitutions';
import { Salons } from '../../assets/business-data/Salons';
import { Services } from '../../assets/business-data/Services';
import { useTheme } from '@react-navigation/native';
import CopyrightText from '../other-components/CopyrightText';


export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    const categories = [
        { title: 'Eateries', data: Eateries },
        { title: 'Clinics', data: Clinics},
        { title: 'Markets', data: Markets },
        { title: 'Real Estate/Finance', data: RealEstateFinance },
        { title: 'Religious Institutions', data: ReligiousInstitutions },
        { title: 'Salons', data: Salons },
        { title: 'Services', data: Services },
    ];

    return (
        <NavigationContext.Provider value = {navigation}>
            <ScrollView contentContainerStyle = {styles.screen}>
                { categories.map(({ title, data }, index) => (
                    <View key = { index }>
                        <Text style = {{color: colors.text, fontSize: 40, margin: 8}}>{ title }</Text>
                        <HorizontalScroll businessData = { data }/>
                    </View>
                ))}
                <CopyrightText />
            </ScrollView>
        </NavigationContext.Provider>        
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 4
    }
})
