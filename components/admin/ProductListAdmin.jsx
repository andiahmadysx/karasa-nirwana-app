import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import {COLORS, SIZES} from "../../constants";
import { AddIcon, Icon, RemoveIcon } from "@gluestack-ui/themed";
import { useOrder } from "../../hooks/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import debounce from 'lodash/debounce';

const ProductListAdmin = ({ item , handlePress}) => {
    return (
        <TouchableOpacity onPress={handlePress} style={{
            flexDirection: "row", gap: SIZES.small, justifyContent: "space-between", marginTop: SIZES.small,
            borderBottomWidth: .5,
            borderColor: COLORS.gray,
            padding: SIZES.xxSmall
        }}>
            <View style={{
                flexDirection: "row", gap: SIZES.small
            }}>
                <Image
                    source={{uri: item.image_url}}
                    resizeMode={'cover'}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: SIZES.small,
                    }}/>

                <View style={{
                    gap: SIZES.light,
                    paddingTop: SIZES.light
                }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                        fontSize: SIZES.medium,
                        fontWeight: 600,
                    }}>{item?.name}</Text>

                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                        color: COLORS.darkGray
                    }}>Price : {formatCurrency(item.price)}</Text>
                </View>
            </View>

            <View style={{
                alignItems: "flex-end",
                justifyContent: 'center',
                flexDirection: "row",
                gap: SIZES.medium,
                paddingVertical: SIZES.xxSmall
            }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{
                    color: COLORS.darkGray
                }}>x{item.stock}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(ProductListAdmin);
