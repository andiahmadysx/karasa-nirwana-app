import React from 'react';
import {Stack, useRouter} from "expo-router";
import {COLORS, icons, SIZES} from "../../constants";
import {View} from "react-native";
import Clock from "../../components/common/Clock";

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
                        <View style={{height: 80, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row',
                            paddingHorizontal: SIZES.xxLarge, backgroundColor: COLORS.bg}}>
                            <Clock/>
                        </View>
                    ),
            }
        }/>
    </Stack>;
};

export default Layout;
