import React, {useEffect, useState} from 'react';
import {Drawer} from 'expo-router/drawer';
import CustomDrawerContent from '../components/common/CustomDrawerContent';
import {COLORS, SIZES} from '../constants';
import {Provider} from '../hooks/Auth';
import {useFonts} from 'expo-font';
import CustomSplashScreen from '../components/common/CustomSplashScreen';
import {LogBox} from 'react-native';
import {config} from '@gluestack-ui/config';
import {OrderProvider} from '../hooks/Order';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useFocusEffect} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

const Layout = () => {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require('../assets/fonts/Poppins Regular 400.ttf'),
        PoppinsMedium: require('../assets/fonts/Poppins Medium 500.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins Bold 700.ttf'),
    });

    const [isDrawer, setIsDrawer] = useState(false);
    const [appIsReady, setAppIsReady] = useState(false);

    useFocusEffect(() => {
        async function fetchData() {
            try {
                const response = await AsyncStorage.getItem('@user');
                const user = JSON.parse(response);
                if (user?.role === 'admin' || user?.role === 'owner') {
                    setIsDrawer(true);
                } else {
                    setIsDrawer(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchData();
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await AsyncStorage.getItem('@user');
                const user = JSON.parse(response);
                if (user?.role === 'admin' || user?.role === 'owner') {
                    setIsDrawer(true);
                } else {
                    setIsDrawer(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

            const delay = setTimeout(() => {
                setAppIsReady(true);
            }, 1000);

            return () => clearTimeout(delay);
        }

        fetchData();
    }, []);

    LogBox.ignoreLogs(['new NativeEventEmitter', 'Layout children']);
    LogBox.ignoreAllLogs();

    if (!appIsReady || !fontsLoaded) return <CustomSplashScreen/>;

    return (
        <Provider>
            <QueryClientProvider client={queryClient}>
                <OrderProvider>
                    <GluestackUIProvider config={config}>
                        <Drawer
                            screenOptions={{
                                headerShown: false,
                                drawerActiveBackgroundColor: COLORS.primary,
                                drawerActiveTintColor: COLORS.white,
                                swipeEdgeWidth: 0,
                                drawerLabelStyle: {
                                    marginLeft: -SIZES.xLarge,
                                    marginTop: SIZES.light,
                                },
                            }}
                            contentContainerStyle={{
                                backgroundColor: 'purple',
                            }}
                            drawerContent={CustomDrawerContent}
                        >
                            <Drawer.Screen
                                name={'admin'}
                                options={{
                                    drawerLabel: 'Dashboard',
                                    title: 'Dashboard',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                }}
                            />

                            <Drawer.Screen
                                name={'owner'}
                                options={{
                                    drawerLabel: 'Dashboard',
                                    title: 'Dashboard',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                }}
                            />

                            <Drawer.Screen
                                name={'cashier'}
                                options={{
                                    drawerLabel: 'Dashboard',
                                    title: 'Dashboard',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                    headerShown: false,
                                }}
                            />

                            <Drawer.Screen
                                name={'chef'}
                                options={{
                                    drawerLabel: 'Dashboard',
                                    title: 'Dashboard',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                    headerShown: false,
                                }}
                            />

                            <Drawer.Screen
                                name={'waiter'}
                                options={{
                                    drawerLabel: 'Dashboard',
                                    title: 'Dashboard',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                    headerShown: false,
                                }}
                            />
                            <Drawer.Screen
                                name={'login'}
                                options={{
                                    drawerLabel: 'Login',
                                    title: 'Login',
                                    headerStyle: {
                                        backgroundColor: COLORS.bg,
                                    },
                                    headerShadowVisible: false,
                                    headerShown: false,
                                }}
                            />

                        </Drawer>
                    </GluestackUIProvider>
                </OrderProvider>
            </QueryClientProvider>
        </Provider>
    );
};

export default Layout;
