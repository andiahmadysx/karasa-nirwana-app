import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, SIZES} from '../../constants';
import {formatCurrency} from '../../utils/formatCurrency';
import {Badge, BadgeIcon, BadgeText} from "@gluestack-ui/themed";

const CardUser = ({item}) => {
    return (
        <TouchableOpacity style={styles.cardContainer}>
            <Badge size="md" style={{
                position: 'absolute',
                zIndex: 2,
                right: SIZES.small,
                top: SIZES.xSmall
            }} variant="solid" borderRadius="$none" action={item?.role === "admin" ? "warning" : item?.role === "owner" ? "success" : "muted"}>
                <BadgeText>{item?.role}</BadgeText>
            </Badge>

           <Text style={{
               width: '100%',
               backgroundColor: 'rgba(227,227,227,0.13)',
               textAlign: 'center',
               paddingVertical: SIZES.xxLarge,
               fontWeight: '800',
               fontSize: SIZES.xxLarge
           }}>{item.name[0] + item.name[1]}</Text>

            <Text style={styles.userName}>{item.name}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    cardContainer: {
        width: '100%',
        alignItems: 'start',
        borderRadius: SIZES.small,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        paddingBottom: SIZES.small,
    },
    userName: {
        fontSize: SIZES.medium,
        fontWeight: '500',
        textAlign: 'center',
        width: '100%',
        paddingTop: SIZES.small,
        paddingBottom: SIZES.light
    },
    priceAndStockContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceText: {
        fontSize: SIZES.small,
        fontWeight: 'light',
        paddingLeft: SIZES.xxSmall,
        color: COLORS.darkGray,
        marginVertical: 4,
    },
    stockText: {
        fontSize: SIZES.small,
        fontWeight: 'light',
        paddingLeft: SIZES.xxSmall,
        color: COLORS.darkGray,
        marginVertical: 4,
        marginHorizontal: SIZES.small,
    },
    qtyIndicator: {
        position: 'absolute',
        left: SIZES.small,
        top: SIZES.small,
        backgroundColor: COLORS.bg,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.light,
        borderRadius: SIZES.small,
    },
    qtyIndicatorText: {
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
    decreaseButton: {
        position: 'absolute',
        right: SIZES.small,
        top: SIZES.small,
        backgroundColor: COLORS.danger,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.light,
        borderRadius: SIZES.small,
    },
    decreaseButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
};

export default React.memo(CardUser);

