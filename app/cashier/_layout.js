import React from 'react';
import {Link, Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {CloseIcon, Icon} from "@gluestack-ui/themed";
import {Text, View} from "react-native";
import Clock from "../../components/common/Clock";

const Layout = () => {

    const router = useRouter();

    return <Stack screenOptions={{
        headerBackImageSource: icons.chevronLeft,
        headerTitleAlign: 'center',
    }}>
        <Stack.Screen name={'index'} options={
            {
                header: (props) =>
                    (
                        <View style={{height: 80, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row',
                            paddingHorizontal: SIZES.xxLarge, backgroundColor: COLORS.bg}}>
                            <Clock/>
                        </View>
                    ),
            }
        }/>

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
