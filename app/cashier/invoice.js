import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {mainStyles} from '../../styles';
import {Center, Divider} from '@gluestack-ui/themed';
import {COLORS, FONT, SIZES} from '../../constants';
import {useOrder} from '../../hooks/Order';
import {useGet} from '../../hooks/Fetch';
import {formatCurrency} from '../../utils/formatCurrency';
import RNPrint from 'react-native-print';
import {useFocusEffect} from "expo-router"; // Import react-native-print

const Invoice = () => {
    const {order} = useOrder();
    const getTransactionDetails = useGet('/transactions/' + order?.id);
    const [transactionDetails, setTransactionDetails] = useState();

    const fetchTransactionDetails = async () => {
        const transactionDetailResponse = await getTransactionDetails();
        setTransactionDetails(transactionDetailResponse.data.transaction);
    };

    useFocusEffect(() => {
        fetchTransactionDetails();
    });

    const handlePrint = async () => {
        try {
            await RNPrint.print({
                printerURL: 'your_printer_url', // Replace with your printer's URL
                html: generatePrintContent(),
            });

        } catch (error) {
            console.error('Error printing:', error);
        }
    };

    const generatePrintContent = () => {
        // Customize the content you want to print
        // You can use HTML or any printable content format
        let content = '<html><body>';
        content += '<h1>INVOICE</h1>';
        content += `<p>ID: ${transactionDetails?.id}</p>`;
        content += `<p>Table: ${transactionDetails?.table?.name || ''}</p>`;
        // ... add other details

        // Loop through items and add to content
        transactionDetails?.items?.forEach((item) => {
            content += `<p>${item.product?.name} - Qty: ${item.qty} - Subtotal: ${formatCurrency(item.sub_total)}</p>`;
        });

        content += `<p>Total Payment: ${formatCurrency(transactionDetails?.total_price)}</p>`;
        content += `<p>Amount Paid: ${formatCurrency(transactionDetails?.payment_amount)}</p>`;
        content += `<p>Change: ${formatCurrency(transactionDetails?.change_amount)}</p>`;

        content += '</body></html>';

        return content;
    };


    if (!transactionDetails) {
        return <Text>Loading</Text>
    }

    return (
        <SafeAreaView style={{
            padding: SIZES.xLarge,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: COLORS.white,
            fontFamily: FONT.medium,
        }}>
            <Center style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: -16,
                backgroundColor: COLORS.bg,
                padding: SIZES.medium,
                marginBottom: 50,
                borderRadius: SIZES.xxSmall
            }}>
                <Divider my={'$4'}/>
                <Text style={{fontSize: SIZES.medium, fontWeight: 'bold'}}>INVOICE</Text>
                <Text style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'light',
                    color: COLORS.darkGray
                }}>{transactionDetails?.id}</Text>
                <Divider my={'$4'}/>
                <View style={{width: '100%'}}>
                    {(!transactionDetails?.is_takeaway && transactionDetails?.table?.name) &&
                        <Text>Table : {transactionDetails.table.name}</Text>}
                    <Text>
                        Date : {transactionDetails?.created_at}
                    </Text>

                    <Text>
                        {transactionDetails?.is_takeaway && `Customer Name : ${transactionDetails.customer_name}`}
                    </Text>

                    <Text>Created by: @{transactionDetails?.user?.username}</Text>
                </View>
                <Divider my={'$4'}/>
                {/* LIST PRODUK */}
                <ScrollView style={{maxHeight: 120, flexGrow: 0}}>
                    {transactionDetails?.items?.map((item, index) => (
                        <View key={index}
                              style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                maxWidth: 100,
                                minWidth: 100
                            }}>{item.product?.name || 'Product Name'}</Text>
                            <Text>{item.qty}</Text>
                            <Text>{formatCurrency(item.sub_total)}</Text>
                        </View>
                    ))}
                </ScrollView>
                <Divider my={'$4'}/>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginTop: SIZES.light
                }}>
                    <Text>Total Payment</Text>
                    <Text>{formatCurrency(transactionDetails?.total_price)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginTop: SIZES.light
                }}>
                    <Text>Amount Paid</Text>
                    <Text>{formatCurrency(transactionDetails?.payment_amount)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginTop: SIZES.light
                }}>
                    <Text>Change</Text>
                    <Text>{formatCurrency(transactionDetails?.change_amount)}</Text>
                </View>
            </Center>
            <View style={mainStyles.footerContainer}>
                <TouchableOpacity onPress={handlePrint} style={mainStyles.footerLink}>
                    <Text style={mainStyles.footerText}>PRINT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Invoice;
