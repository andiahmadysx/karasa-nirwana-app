import React from 'react';
import {Stack} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {View} from "react-native";
import Clock from "../../components/common/Clock";
import {DrawerToggleButton} from "@react-navigation/drawer";

const Layout = () => {
    return <Stack screenOptions={{
        headerBackImageSource: icons.chevronLeft,
        headerTitleAlign: 'center'

    }}>
        <Stack.Screen name={'index'} options={
            {
                header: (props) =>
                    (
                        <View style={{
                            height: 100, backgroundColor: COLORS.bg,
                            paddingHorizontal: SIZES.small,
                            paddingRight: SIZES.xxLarge,
                            alignItems: 'flex-end',
                            flexDirection: 'row'
                        }}>

                            <View style={{
                                justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row', flex: 1
                            }}>
                                <DrawerToggleButton/>
                                <Clock/>
                            </View>

                        </View>
                    ),
            }
        }/>


        <Stack.Screen name={'manage_products'} options={{
            headerLeft: () => <DrawerToggleButton/>,
            headerBackVisible: false,
            headerTitle: 'Manage Products',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>


        <Stack.Screen name={'categories'} options={{
            headerLeft: () => <DrawerToggleButton/>,
            headerBackVisible: false,
            headerTitle: 'Manage Cataegories',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>


        <Stack.Screen name={'users'} options={{
            headerLeft: () => <DrawerToggleButton/>,
            headerBackVisible: false,
            headerTitle: 'Manage Users',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'tables'} options={{
            headerLeft: () => <DrawerToggleButton/>,
            headerBackVisible: false,
            headerTitle: 'Manage Tables',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'products/[id]'} options={{
            headerTitle: 'Add Product',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>

        <Stack.Screen name={'detail-users/[userId]'} options={{
            headerTitle: 'Add Users',
            headerTitleStyle: {
                fontSize: SIZES.medium
            },
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false
        }}/>
    </Stack>;
};

export default Layout;
