import { View, Text, StyleSheet, FlatList, Image, ScrollView, Dimensions, Linking, Pressable, TouchableOpacity, LayoutAnimation } from "react-native";
import React, { useContext, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { handleCreateToast } from "../settings-components/Toast";
import Toast from "react-native-toast-message";
import callLogoDark from "../../assets/logos/call_logo_dark.png";
import callLogoLight from "../../assets/logos/call_logo_light.png";
import webLogoDark from "../../assets/logos/web_dark.png";
import webLogoLight from "../../assets/logos/web_light.png";
import instagramLogoDark from "../../assets/logos/insta_logo_dark.png"
import instagramLogoLight from "../../assets/logos/insta_logo_light.png"
import facebookLogo from "../../assets/logos/facebook_logo.png"
import yelpLogo from "../../assets/logos/yelp_logo.png"
import bookmarkSaved from "../../assets/logos/bookmark_saved.png"
import bookmarkLightUnsaved from "../../assets/logos/bookmark_light_unsaved.png"
import bookmarkDarkUnsaved from "../../assets/logos/bookmark_dark_unsaved.png"
import { AntDesign } from "@expo/vector-icons";
import CopyrightText from "../other-components/CopyrightText";
import { ReviewBusinessStackScreenContext } from "../contexts/ReviewBusinessStackScreenContext";

const screenWidth = Dimensions.get('window').width;

export default function BusinessInfoScreen({ isSaved, businessData }) {
    const { dark, colors } = useTheme();
    const [hoursTabOpen, setHoursTapOpen] = useState(false);
    const { handleSetPublishingbusinessData } = useContext(ReviewBusinessStackScreenContext);

    // send info to stack for submission use
    handleSetPublishingbusinessData(businessData);

    // used to check if tags should be displayed
    let tagExists = true;
    if (businessData.tags[0] == "" && businessData.tags[1] == "" && businessData.tags[2] == "" ) {
        tagExists = false;
    };

    // opens phone app to call the business
    const handleNumberClicked = () => {
        const num = `tel:${businessData.phoneNumber}`;
        Linking.openURL(num).catch((error) => {
            console.error(error);
            handleCreateToast('error', 'Failed to load number', 'bottom');
        });
    }

    // opens business website
    const handleWebsiteClicked = () => {
        let businessWebsite;
        console.log(businessData.businessWebsiteInfo.substring(0,7));
        if (businessData.businessWebsiteInfo.substring(0,8) === 'https://') {
            businessWebsite = businessData.businessWebsiteInfo;
        } else {
            businessWebsite = 'https://' + businessData.businessWebsiteInfo;
        }
        Linking.openURL(businessWebsite).catch((error) => {
            console.error(error);
            handleCreateToast('error', 'Failed to load website', 'bottom');
        });
    }

    // used to combine all hours into one function
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <View style = {{height: 240}}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator = {false}
                    data = {businessData.photos}
                    style = {styles.photoArray}
                    keyExtractor = {(index) => index}
                    renderItem = {({ item }) => {
                        return (
                            <Image 
                                source = {{uri: item || noImageIcon}}
                                style = {styles.photo}
                            />
                        )
                    }}
                />
            </View>
            <View style = {{flexDirection: 'row', margin: 12}}>
                <View style = {styles.flexbox1Wrapper}>
                    { tagExists && 
                        <View style = {styles.tagsWrapper}>
                            <Text style = {[styles.tagsText, {color: colors.text}]}>
                                {businessData.tags[0]}, {businessData.tags[1]}, {businessData.tags[2]}
                            </Text>
                        </View>
                    }

                    {businessData.phoneNumber &&
                        <Pressable 
                            style = {styles.imageAndTextContainer}
                            onPress = {() => handleNumberClicked()}
                        >
                            <Image 
                                source = {dark ? callLogoDark : callLogoLight}
                                style = {styles.logo}

                            />
                            <Text style = {[styles.linkText, {color: colors.text}]}>
                                {businessData.phoneNumber}
                            </Text>
                        </Pressable>
                    }

                    {businessData.businessWebsiteInfo && 
                        <Pressable
                            style = {styles.imageAndTextContainer}
                            onPress = {() => handleWebsiteClicked()}
                        >
                            <Image 
                                source = {dark ? webLogoDark : webLogoLight}
                                style = {styles.logo}
                            />
                            <Text style = {[styles.linkText, {color: colors.text}]}>
                                Visit Website
                            </Text>
                        </Pressable>
                    }
                    <Image 
                        source = {isSaved? bookmarkSaved 
                                    : (dark ? bookmarkDarkUnsaved : bookmarkLightUnsaved)
                                }
                        style = {[styles.logoLarge, {marginLeft: '-8'}]}
                    />
                </View>
                <View style = {styles.flexBox2Wrapper}>
                    <Image 
                        source = {dark ? instagramLogoDark : instagramLogoLight}
                        style = {styles.logoLarge}
                    />
                    <Image 
                        source = {facebookLogo}
                        style = {styles.logoLarge}
                    />
                    <Image 
                        source = {yelpLogo}
                        style = {styles.logoLarge}
                    />
                </View>
            </View>

            <View>
                <Text
                    style = {[styles.linkText, {color: colors.text}]}
                >
                    {businessData.description}
                </Text>
            </View>

            <View style = {styles.standardWrapper}>
                <TouchableOpacity onPress = {() => setHoursTapOpen((prev) => !prev)}>
                    <View style = {[styles.standardWrapper, {flexDirection: 'row'}]}>
                    <Text style = {styles.title}>
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
                {hoursTabOpen && 
                    businessData.hours.map((hour, index) => {
                        return (
                            <View style = {[styles.standardWrapper, {flexDirection: 'row'}]} key = {weekdays[index]}>
                                <Text style = {styles.weekdayText}>{weekdays[index]}</Text>
                                <View style = {styles.hoursTextWrapper}> 
                                    { hour.isOpen? (
                                        <Text style = {[styles.hoursText, {color: colors.text}]}>
                                            {hour.openTime} - {hour.closeTime}
                                        </Text> 
                                        ) :
                                        <Text style = {[styles.hoursText, {color: colors.text}]}>
                                            Closed
                                        </Text>
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </View>

            <View style = {styles.standardWrapper}>
                <Text style = {styles.addressText}>
                    {businessData.address}
                </Text>
            </View>
            
            <View style = {[styles.standardWrapper, {flexDirection: 'row'}]}>
                <Text style = {{fontSize: 18, fontWeight: 500, margin: 4}}> 
                    Business Owner:
                </Text>
                <Text style = {{fontSize: 18, fontWeight: 400, margin: 4}}>
                    {businessData.publisher}
                </Text>
            </View>
            <CopyrightText 
                size = {16}
                textColor = {colors.text}
            />
            <Toast />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    addressText: {
        fontSize: 18,
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
