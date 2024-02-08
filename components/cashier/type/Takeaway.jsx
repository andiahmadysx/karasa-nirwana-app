import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SIZES} from '../../../constants';
import TableCustom from "../../common/TableCustom";
import useCustomQuery, {useFetch, useGet} from "../../../hooks/Fetch";
import NoDataFound from "../../common/NoDataFound";
import usePusher from "../../../hooks/Pusher";
import {mainStyles} from "../../../styles";

const Takeaway = () => {
    const [activeCategory, setCategory] = useState('Order Placed');

    // api fetch
    const getOrderPlaced = useGet('/transactions/order-placed?is_takeaway=1');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress?is_takeaway=1');
    const getReadyToServe = useGet('/transactions/ready-to-serve?is_takeaway=1');

    const { data: orderPlacedData, error: orderPlacedError, isLoading: orderPlacedLoading, refetch: refetchOrderPlaced } = useCustomQuery('orderPlaced', getOrderPlaced);
    const { data: cookingInProgressData, error: cookingInProgressError, isLoading: cookingInProgressLoading, refetch: refetchCookingInProgress } = useCustomQuery('cookingInProgress', getCookingInProgress);
    const { data: readyToServeData, error: readyToServeError, isLoading: readyToServeLoading, refetch: refetchReadyToServe } = useCustomQuery('readyToServe', getReadyToServe);

    const orderPlaced = orderPlacedData?.transactions || [];
    const cookingInProgress = cookingInProgressData?.transactions || [];
    const readyToServe = readyToServeData?.transactions || [];

    usePusher('cooking-in-progress-channel', 'App\\Events\\SetCookingInProgressEvent', (response) => {
        refetchCookingInProgress();
    });

    usePusher('ready-to-serve-transactions-channel', 'App\\Events\\SetReadyToServeEvent', (response) => {
        refetchReadyToServe();
    });

    usePusher('transactions-channel', 'App\\Events\\CreateTransactionEvent', (response) => {
        refetchOrderPlaced();
    });

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                marginTop: SIZES.medium,
                marginBottom: 60,
                marginHorizontal: SIZES.small,
            }}
            horizontal={false}
        >

            <View style={mainStyles.tabsContainer}>
                <FlatList
                    data={['Order Placed', 'Cooking In Progress', 'Ready To Serve']}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={mainStyles.tab(activeCategory, item)}
                            onPress={() => setCategory(item)}
                        >
                            <Text style={mainStyles.tabText(activeCategory, item)}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>


            {
                activeCategory === 'Order Placed' && <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.small,
                        justifyContent: 'space-between'
                    }}>
                        {orderPlaced?.length > 0 ? (
                            orderPlaced.map((item, index) => (
                                <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                    <TableCustom>{item.customer_name}</TableCustom>
                                </View>
                            ))
                        ) : (
                            <NoDataFound/>
                        )}
                    </View>
                </ScrollView>
            }


            {
                activeCategory === 'Cooking In Progress' && <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.small,
                        justifyContent: 'space-between'
                    }}>
                        {cookingInProgress?.length > 0 ? (
                            cookingInProgress.map((item, index) => (
                                <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                    <TableCustom>{item.customer_name}</TableCustom>
                                </View>
                            ))
                        ) : (
                            <NoDataFound/>
                        )}
                    </View>
                </ScrollView>
            }

            {activeCategory === 'Ready To Serve' &&
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.small,
                        justifyContent: 'space-between'
                    }}>
                        {readyToServe?.length > 0 ? (
                            readyToServe.map((item, index) => (
                                <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                    <TableCustom>{item.customer_name}</TableCustom>
                                </View>
                            ))
                        ) : (
                            <NoDataFound/>
                        )}
                    </View>
                </ScrollView>
            }

        </ScrollView>
    );
};

export default Takeaway;
