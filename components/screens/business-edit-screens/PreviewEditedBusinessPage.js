import { View, Text, StyleSheet, FlatList, Image, ScrollView, Linking, Pressable, TouchableOpacity, Button, Dimensions } from "react-native";
import React, { useContext, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { handleCreateToast } from "../../settings-components/Toast";
import Toast from "react-native-toast-message";
import callLogoDark from "../../../assets/logos/call_logo_dark.png";
import callLogoLight from "../../../assets/logos/call_logo_light.png";
import webLogoDark from "../../../assets/logos/web_dark.png";
import webLogoLight from "../../../assets/logos/web_light.png";
import instagramLogoDark from "../../../assets/logos/insta_logo_dark.png"
import instagramLogoLight from "../../../assets/logos/insta_logo_light.png"
import facebookLogo from "../../../assets/logos/facebook_logo.png"
import yelpLogo from "../../../assets/logos/yelp_logo.png"
import bookmarkSaved from "../../../assets/logos/bookmark_saved.png"
import bookmarkLightUnsaved from "../../../assets/logos/bookmark_light_unsaved.png"
import bookmarkDarkUnsaved from "../../../assets/logos/bookmark_dark_unsaved.png"
import { AntDesign } from "@expo/vector-icons";
import CopyrightText from "../../other-components/CopyrightText";
import { EditBusinessStackContext } from "../../contexts/EditBusinessStackContext"

const screenWidth = Dimensions.get("window").width;

export default function PreviewEditedBusinessPage() {
    const {editedBusinessData} = useContext(EditBusinessStackContext);
    const { dark, colors } = useTheme();
    const [hoursTabOpen, setHoursTapOpen] = useState(false);
    const [isSaved, setIsSaved ] = useState(false);

    // used to check if tags should be displayed
   let tagExists = false;
   if (editedBusinessData.tags) {
       if (editedBusinessData.tags[0] != "" 
           || editedBusinessData.tags[1] != "" 
           || editedBusinessData.tags[2] != "" 
       ) {
           tagExists = true;
       };
   }


    // opens phone app to call the business
    const handleNumberClicked = () => {
        const num = `tel:${editedBusinessData.number}`;
        Linking.openURL(num).catch((error) => {
            console.error(error);
            handleCreateToast('error', 'Failed to load number', 'bottom');
        });
    }

    // opens business website
    const handleWebsiteClicked = (link, linkType) => {
        // if link doesn't exist, then send error
        if (link === "") {
            Toast.show({
                type: 'info', 
                    text1: `${editedBusinessData.name}`, 
                    text2: `does not have a ${linkType} connected yet.`, 
                    position: 'bottom'
            });
            return;
        }

        let website;
        if (link.substring(0,8) === 'https://') {
            website = link;
        } else {
            website = 'https://' + link;
        }
        Linking.openURL(website).catch((error) => {
            console.error(error);
            handleCreateToast('error', 'Failed to load website', 'bottom');
        });
    }

    // used to combine all hours into one function
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleNavigateToBusinessEditInSettings = () => {
        console.log('testrun');
    }

    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator = {false}
                data = {editedBusinessData.photos}
                style = {styles.photoArray}
                keyExtractor = {(index) => index}
                renderItem = {({ item }) => {
                    return (
                        <Image 
                            source = {{uri: item || null}}
                            style = {styles.photo}
                        />
                    )
                }}
            />
            <View style = {{flexDirection: 'row', margin: 12}}>
                <View style = {styles.flexbox1Wrapper}>
                    { tagExists && 
                        <View style = {styles.tagsWrapper}>
                            <Text style = {[styles.tagsText, {color: colors.text}]}>
                                {editedBusinessData.tags[0].replace(/\s+/g, '') != "" && editedBusinessData.tags[0]} 
                                {editedBusinessData.tags[1].replace(/\s+/g, '') != "" && ', ' + editedBusinessData.tags[1]} 
                                {editedBusinessData.tags[2].replace(/\s+/g, '') != "" && ', ' + editedBusinessData.tags[2]}
                            </Text>
                        </View>
                    }

                    {editedBusinessData.number &&
                        <Pressable
                            style = {styles.imageAndTextContainer}
                            onPress = {() => handleNumberClicked()}
                        >
                            <Image
                                source = {dark ? callLogoDark : callLogoLight}
                                style = {styles.logo}

                            />
                            <Text style = {[styles.linkText, {color: colors.text}]}>
                                {editedBusinessData.number}
                            </Text>
                        </Pressable>
                    }

                    <Pressable
                        style = {styles.imageAndTextContainer}
                        onPress = {() => handleWebsiteClicked(editedBusinessData.businessWebsite, 'business website')}
                    >
                        <Image 
                            source = {dark ? webLogoDark : webLogoLight}
                            style = {styles.logo}
                        />
                        <Text style = {[styles.linkText, {color: colors.text}]}>
                            Visit Website
                        </Text>
                    </Pressable>
                    <Image 
                        source = {isSaved? bookmarkSaved 
                                    : (dark ? bookmarkDarkUnsaved : bookmarkLightUnsaved)
                                }
                        style = {[styles.logoLarge, {marginLeft: '-8'}]}
                    />
                </View>
                <View style = {styles.flexBox2Wrapper}>
                    <TouchableOpacity onPress = {() => handleWebsiteClicked(editedBusinessData.instagram, 'Instagram')}>
                        <Image 
                            source = {dark ? instagramLogoDark : instagramLogoLight}
                            style = {styles.logoLarge}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => handleWebsiteClicked(editedBusinessData.facebook, 'Facebook')}>
                        <Image 
                            source = {facebookLogo}
                            style = {styles.logoLarge}
                        />       
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => handleWebsiteClicked(editedBusinessData.yelp, 'Yelp')}>
                        <Image 
                            source = {yelpLogo}
                            style = {styles.logoLarge}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text
                    style = {[styles.linkText, {color: colors.text}]}
                >
                    {editedBusinessData.description}
                </Text>
            </View>

            <View style = {styles.standardWrapper}>
                <TouchableOpacity onPress = {() => setHoursTapOpen((prev) => !prev)}>
                    <View style = {[styles.standardWrapper, {flexDirection: 'row'}]}>
                    <Text style = {[styles.title, {color: colors.text}]}>
                        Hours
                    </Text> 
                        {hoursTabOpen ?
                            <AntDesign 
                                name = "caretup" 
                                margin = {8}
                                size = {16} 
                                color = {colors.text}
                            /> :
                            <AntDesign 
                                name = "caretdown" 
                                margin = {8}
                                size = {16} 
                                color = {colors.text}
                            />
                        }
                    </View>
                </TouchableOpacity>
                {hoursTabOpen && (
                    editedBusinessData.hours ? 
                        (editedBusinessData.hours.map((hour, index) => {
                            return (
                                <View 
                                    style = {[
                                        styles.standardWrapper, 
                                        {flexDirection: 'row', alignItems: 'flex-start', margin: 4}
                                    ]} 
                                    key = {weekdays[index]}
                                >
                                    <Text style = {[styles.weekdayText, {color: colors.text}]}>{weekdays[index]}</Text>
                                    <View style = {styles.hoursTextWrapper}> 
                                        { hour.isOpen? (
                                            <Text style = {[styles.hoursText, {color: colors.text}]}>
                                                {hour.openTime}
                                            </Text> 
                                            ) :
                                            <Text style = {[styles.hoursText, {color: colors.text}]}>
                                                Closed
                                            </Text>
                                        }
                                    </View>
                                </View>
                            )
                        }))
                    : (<Text style = {[styles.text, {color: colors.text}]}>Data not available</Text>)
                )}
            </View>

            <View style = {styles.standardWrapper}>
                <Text style = {[styles.addressText, {color: colors.text}]}>
                    {editedBusinessData.address}
                </Text>
            </View>
            
            <View style = {[styles.standardWrapper, {flexDirection: 'row'}]}>
                <Text style = {{fontSize: 18, fontWeight: 500, margin: 4, color: colors.text}}> 
                    Business Owner:
                </Text>
                <Text style = {{fontSize: 18, fontWeight: 400, margin: 4, color: colors.text}}>
                    {editedBusinessData.publisher.userName || 'Unclaimed'} 
                </Text>
            </View>
            <Button 
                title = 'Spot an issue?'
                onPress = {() => handleNavigateToBusinessEditInSettings()}
            />
            <CopyrightText 
                size = {16}
            />
            <Toast />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    addressText: {
        fontSize: 14,
        fontWeight: 500,
        marginVertical: 16,
        marginHorizontal: 12
    },
    standardWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 600
    },
    weekdayText: {
        fontSize: 18,
        fontWeight: 600,
        width: 100,
    },
    hoursTextWrapper: {
        width: 120,
        alignItems: 'flex-end',
    },
    hoursText: {
        fontSize: 18,
        fontWeight: 400,
        margin: 1
    },
    flexbox1Wrapper: {
        width: '85%'
    },
    flexBox2Wrapper: {
        width: '15%',
        alignItems: 'flex-end'
    },
    logoLarge: {
        height: 36,
        width: 36,
        marginVertical: 8,
        borderRadius: 6,
    },
    imageAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        height: 24,
        width: 24,
    },
    photoArray: {
        height: 240,
        width: (screenWidth || 375),
    },
    photo: {
        height: '240',
        width: (screenWidth || 375),
        resizeMode: 'cover',
    },
    container: {
        width: '100%',
    },
    tagsWrapper: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    tagsText: {
        fontSize: 16,
        fontWeight: 400,
        fontStyle: 'italic'
    },
    linkText: {
        fontSize: 18,
        fontWeight: 400,
        margin: 8,
    }
})
