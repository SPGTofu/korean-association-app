import React from 'react';
import { FlatList } from 'react-native';
import BusinessContainer from './BusinessContainer';

export default function HorizontalScroll({ businessData }) {
    return (
        <FlatList
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            data = {businessData}
            renderItem = {({item}) => <BusinessContainer businessData = {item}/>}
            keyExtractor = {(item) => item.name}
        />
    )
}