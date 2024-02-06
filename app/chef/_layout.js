import React from 'react';
import {Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {DrawerToggleButton} from "@react-navigation/drawer";

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
    </Stack>
};

export default Layout;
