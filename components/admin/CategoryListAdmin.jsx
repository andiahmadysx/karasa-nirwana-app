import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import {COLORS, SIZES} from "../../constants";
import { AddIcon, Icon, RemoveIcon } from "@gluestack-ui/themed";
import { useOrder } from "../../hooks/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import debounce from 'lodash/debounce';
import {Ionicons} from "@expo/vector-icons";

const CategoryListAdmin = ({ item, handlePress }) => {
    return (
        <TouchableOpacity onPress={handlePress} style={{
            flexDirection: "row", gap: SIZES.small, justifyContent: "space-between", marginTop: SIZES.small,
            borderBottomWidth: .4,
            borderColor: COLORS.gray,
            paddingVertical: SIZES.medium,
            paddingHorizontal: SIZES.small,
            alignItems: 'center'
        }}>

            <Text
            style={{
                fontWeight: '500',
                fontSize: SIZES.medium
            }}
            >{item.name}</Text>

            <Ionicons name={'pencil-sharp'} size={24} color={'black'}/>
        </TouchableOpacity>
    );
};

export default CategoryListAdmin;
