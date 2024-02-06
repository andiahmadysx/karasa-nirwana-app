import React, {useEffect, useState} from 'react';
import {Drawer} from "expo-router/drawer";
import CustomDrawerContent from "../components/common/CustomDrawerContent";
import {COLORS, SIZES} from "../constants";
import {Provider} from "../hooks/Auth";
import {useFonts} from "expo-font";
import CustomSplashScreen from "../components/common/CustomSplashScreen";
import {LogBox} from "react-native";

const Layout = () => {
    const [fonstLoaded] = useFonts({
        PoppinsRegular: require('../assets/fonts/Poppins Regular 400.ttf'),
        PoppinsMedium: require('../assets/fonts/Poppins Medium 500.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins Bold 700.ttf'),
    })
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setAppIsReady(true);
        }, 300);

        return () => clearTimeout(delay);
    }, []);


    LogBox.ignoreAllLogs();

    if (!appIsReady) return <CustomSplashScreen/>
    return <Provider>


        <Drawer screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: COLORS.primary,
            drawerActiveTintColor: COLORS.white,
            drawerLabelStyle: {
                marginLeft: -SIZES.xLarge,
                marginTop: SIZES.light
            },
        }} drawerContent={CustomDrawerContent}>
            <Drawer.Screen
                name={'cashier'}
                options={{
                    drawerLabel: 'Beranda',
                    title: 'Beranda',
                    headerStyle: {
                        backgroundColor: COLORS.bg
                    },
                    headerShadowVisible: false,
                }}
            />
        </Drawer>
    </Provider>
};

export default Layout;
