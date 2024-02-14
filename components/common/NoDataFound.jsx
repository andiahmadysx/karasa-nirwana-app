import React from 'react';
import { View, Image, Text } from 'react-native';
import { COLORS, images, SIZES } from '../../constants';

const NoDataFound = () => {
    return (
        <View
            style={{
                height: 400,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={images.noData} // Make sure you have this image in your 'images' directory
                resizeMode="cover"
                style={{width: '100%', height: 300}} // Adjust the size as needed
            />

        </View>
    );
};

export default React.memo(NoDataFound);
