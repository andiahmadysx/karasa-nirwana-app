import React from 'react';
import {Center} from "@gluestack-ui/themed";
import {Text, View} from "react-native";
import {COLORS, SIZES} from "../../constants";

const NoDataFound = () => {
    return (
        <View style={{
            flex: 1,
            borderWidth: .5,
            borderColor: COLORS.gray,
            borderRadius: SIZES.small,
            padding: SIZES.xxLarge,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SIZES.small
        }}>
            <Text style={{
                color: COLORS.gray
            }}>No data found.</Text>
        </View>
    );
};

export default NoDataFound;
