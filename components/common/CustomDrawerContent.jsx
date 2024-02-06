import React, {useContext} from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from "react-native";
import {DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import {COLORS, images, SIZES} from "../../constants";
import {useNavigation, useRouter} from "expo-router";
import {AntDesign} from "@expo/vector-icons";

const CustomDrawerContent = (props) => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <Image source={images.logo} resizeMode={'contain'} style={{
                    width: 150,
                    height: 150,
                    alignSelf: 'center'
                }}/>

                {/* item */}
                <RenderDrawerItem label={'Beranda'} iconName={'home'} screenName={'cashier'} props={props}/>

            </DrawerContentScrollView>
            <Pressable style={{padding: SIZES.small}}>
                <Text>Logout</Text>
            </Pressable>
        </SafeAreaView>
    );
};


const RenderDrawerItem = ({label, screenName, iconName, props}) => {
    const {navigation, state} = props
    return <DrawerItem
        labelStyle={{ marginLeft: -SIZES.xLarge, marginTop: 2 }}
        activeBackgroundColor={COLORS.primary}
        activeTintColor={COLORS.white}
        label={label}
        onPress={() => navigation.navigate(screenName)}
        icon={({ size, color }) => <AntDesign name={iconName} size={24} color={color} />}
        focused={state.index === state.routes.findIndex(e => e.name === screenName)}
    />
};


export default CustomDrawerContent;
