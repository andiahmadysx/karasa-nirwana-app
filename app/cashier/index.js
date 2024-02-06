import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useRouter} from 'expo-router';
import {COLORS, SIZES} from '../../constants';
import {mainStyles} from '../../styles';
import Takeaway from '../../components/cashier/type/Takeaway';
import DineIn from '../../components/cashier/type/DineIn';
import {useOrder} from "../../hooks/Order";
import {useAuth} from "../../hooks/Auth";

const CashierDashboard = () => {

    const {order, setOrder, reset} = useOrder();
    const {removeUser} = useAuth();
    const router = useRouter()


    const handleButtonPress = (val) => {
        setOrder((prevState) => ({...prevState, is_takeaway: val}));
    };
    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: !order.is_takeaway ? COLORS.primary : 'transparent',
                            borderColor: !order.is_takeaway ? 'transparent' : COLORS.primary,
                            borderTopLeftRadius: 100,
                            borderBottomLeftRadius: 100,
                        },
                    ]}
                    onPress={() => handleButtonPress(false)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {color: !order.is_takeaway ? 'white' : COLORS.primary},
                        ]}
                    >
                        Dine-in
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: order.is_takeaway ? COLORS.primary : 'transparent',
                            borderColor: order.is_takeaway ? 'transparent' : COLORS.primary,
                            borderTopRightRadius: 100,
                            borderBottomRightRadius: 100,
                        },
                    ]}
                    onPress={() => handleButtonPress(true)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            {color: order.is_takeaway ? 'white' : COLORS.primary},
                        ]}
                    >
                        Takeaway
                    </Text>
                </TouchableOpacity>
            </View>

            {/* main */}
            {order.is_takeaway ? <Takeaway/> : <DineIn/>}

            {/* footer */}
            <TouchableOpacity
                onPress={() => {
                    router.navigate(order.is_takeaway ? '/cashier/menu' : '/cashier/select_table');
                }}
                style={mainStyles.footerContainer}
            >
                <Text style={mainStyles.footerText}>Add order</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
});

export default CashierDashboard;
