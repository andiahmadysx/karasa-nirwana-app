import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {COLORS, SIZES} from "../../constants";

const DashboardCard = ({ title, value, onPress, hasDetail}) => (
    <TouchableOpacity style={styles.dashboardCard} onPress={onPress}>
        <View>
            <Text style={styles.dashboardCardTitle}>{title}</Text>
            <Text style={styles.dashboardCardValue}>{value}</Text>
        </View>
        <View style={styles.viewDetailsContainer}>
            {hasDetail &&
                <Text style={styles.viewDetailsText}>View Details</Text>
            }
        </View>
    </TouchableOpacity>
);

export default React.memo(DashboardCard);
const styles = {
    dashboardCard: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        height: 150,
        borderRadius: SIZES.small,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.xxLarge,
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        marginTop: SIZES.medium,
    },
    dashboardCardTitle: {
        color: 'black',
    },
    dashboardCardValue: {
        color: 'black',
        fontWeight: 500,
        fontSize: SIZES.xxLarge,
    },
    viewDetailsContainer: {
        alignSelf: 'flex-end',
        marginBottom: SIZES.xLarge,
    },
    viewDetailsText: {
        color: COLORS.primary,
    },
}
