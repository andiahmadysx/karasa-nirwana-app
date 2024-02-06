import React from 'react';
import {Link, Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {CloseIcon, Icon} from "@gluestack-ui/themed";
import {Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";

const Layout = () => {

    const router = useRouter();

    return <Stack screenOptions={{
        headerBackImageSource: icons.chevronLeft,
        headerTitleAlign: 'center'

    }}>
        <Stack.Screen name={'index'} options={{
            headerLeft: () => <DrawerToggleButton/>,
            headerTitle: '',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'select_table'} options={{
            headerTitle: 'Select Table',
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'menu'} options={{
            headerTitle: 'Menu',
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>


        <Stack.Screen name={'confirm'} options={{
            headerTitle: 'Order Confirmation',
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'invoice'} options={{
            headerBackVisible: false,
            headerTitle: '',
            headerShadowVisible: false,
            headerLeft: () => <Link href={'/cashier'} style={{
                alignItems: 'center',
                marginLeft: SIZES.light
            }}><Icon as={CloseIcon} m="$2" w="$6" h="$6"/>
            </Link>
        }}/>
    </Stack>
};

export default Layout;
