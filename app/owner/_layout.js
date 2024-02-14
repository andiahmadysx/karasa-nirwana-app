import React from 'react';
import {Link, Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {View} from "react-native";
import Clock from "../../components/common/Clock";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {CloseIcon, Icon} from "@gluestack-ui/themed";

const Layout = () => {
    const router = useRouter();

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


        <Stack.Screen name={'transaction_history'} options={
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


        <Stack.Screen name={'log_activity'} options={
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

        <Stack.Screen name={'receipt/[id]'} options={{
            headerBackVisible: false,
            headerTitle: '',
            headerStyle: {
                backgroundColor: COLORS.bg,
            },
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
