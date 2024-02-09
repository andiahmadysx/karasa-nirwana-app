import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity} from "react-native";
import {DrawerContentScrollView} from "@react-navigation/drawer";
import {COLORS, images, SIZES} from "../../constants";
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "../../hooks/Auth";
import {usePathname, useRouter} from "expo-router";

const CustomDrawerContent = (props) => {

    const {user} = useAuth();

    return (
        <SafeAreaView style={{flex: 1}}>
            {user?.role === 'admin' &&
                <DrawerContentScrollView {...props} contentContainerStyle={{
                    flex: 1,
                }}>
                    <Image source={images.logo} resizeMode={'contain'} style={{
                        width: 150,
                        height: 150,
                        alignSelf: 'center'
                    }}/>
                    <RenderDrawerItem label={'Dashboard'} iconName={'home-outline'} screenName={'/admin'}
                                      props={props}/>
                    <RenderDrawerItem label={'Manage Products'} iconName={'fast-food-outline'}
                                      screenName={'/admin/manage_products'}
                                      props={props}/>
                    <RenderDrawerItem label={'Manage Categoris'} iconName={'grid-outline'}
                                      screenName={'/admin/categories'}
                                      props={props}/>
                    <RenderDrawerItem label={'Manage Users'} iconName={'people-outline'} screenName={'/admin/users'}
                                      props={props}/>
                    <RenderDrawerItem label={'Manage Tables'} iconName={'file-tray-outline'}
                                      screenName={'/admin/tables'}
                                      props={props}/>

                    <TouchableOpacity style={{
                        paddingVertical: SIZES.small,
                        paddingHorizontal: SIZES.large,
                        position: "absolute",
                        bottom: SIZES.small,
                        right: SIZES.small,
                        alignItems: 'center',
                        gap: SIZES.small,
                        borderRadius: SIZES.small,
                        flex: 1,
                        flexDirection: "row",
                        backgroundColor: COLORS.primary
                    }}>
                        <Ionicons name={'log-out-outline'} style={{
                            marginRight: -SIZES.light
                        }} size={SIZES.xxLarge} color={'white'}/>

                        <Text style={{
                            color: COLORS.white
                        }}>Logout</Text>
                    </TouchableOpacity>
                </DrawerContentScrollView>
            }
        </SafeAreaView>
    );
};


const RenderDrawerItem = ({label, screenName, iconName, props}) => {
    const {navigation, state} = props

    const pathname = usePathname();
    const router = useRouter();

    return <TouchableOpacity onPress={() => {
        router.navigate(screenName);
    }} style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.small,
        marginHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        marginTop: SIZES.medium,
        padding: SIZES.small,
        backgroundColor: pathname === screenName ? COLORS.primary : 'transparent',
    }}>
        <Ionicons name={iconName} size={24} color={pathname === screenName ? 'white' : 'black'}/>

        <Text style={{
            color: pathname === screenName ? 'white' : 'black'
        }}>{label}</Text>
    </TouchableOpacity>
};


export default CustomDrawerContent;
