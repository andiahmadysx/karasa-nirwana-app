import React from 'react';
import {Link, Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {CloseIcon, Icon} from "@gluestack-ui/themed";
import {View} from "react-native";
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
                        <View style={{
                            height: 80, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row',
                            paddingHorizontal: SIZES.xxLarge, backgroundColor: COLORS.bg
                        }}>
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

        <Stack.Screen name={'transactions/[id]'} options={{
            headerBackVisible: false,
            headerTitle: '',
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
            headerShadowVisible: false,
            headerLeft: () =>  <Icon
                as={CloseIcon}
                m="$2"
                w="$6"
                h="$6"
                onPress={() => router.navigate('cashier')} // Use navigation.navigate
            />
        }}/>
    </Stack>
};

export default Layout;
