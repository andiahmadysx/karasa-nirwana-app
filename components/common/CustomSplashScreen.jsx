import React from 'react';
import {Image, SafeAreaView} from "react-native";
import {images} from "../../constants";

const CustomSplashScreen = () => {
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image source={images.logo} resizeMode={'contain'} style={{
                width: 150,
                height: 150,
                alignSelf: 'center'
            }}/>
        </SafeAreaView>
    );
};

export default React.memo(CustomSplashScreen);
