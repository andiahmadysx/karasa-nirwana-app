import {Text, TouchableOpacity, View} from "react-native";
import {COLORS, SIZES} from "../../constants";
import React from "react";

const TableCustom = ({ children, handlePress = () => {}, item, isSelected }) => (
    <TouchableOpacity
        onPress={() => handlePress(item)}
        style={{
            width: '100%', // Set a fixed width for each item
            alignItems: 'center',
            minHeight: 100,
            justifyContent: 'center',
            borderRadius: SIZES.light,
            borderWidth: .5,
            borderColor: COLORS.lightWhite,
            marginRight: SIZES.small, // Add margin between items
            backgroundColor: isSelected ? COLORS.primary : COLORS.white,
            shadowColor: "rgba(0,0,0,0.28)",
            shadowOffset: {
                width: 2,
                height: 2,
            },
            shadowOpacity: 0.10,
            shadowRadius: 3.84,
            elevation: 2,

        }}
    >
        <Text style={{
            color: isSelected ? 'white' : 'black',
        }}>{children}</Text>
    </TouchableOpacity>
);

export default TableCustom;
