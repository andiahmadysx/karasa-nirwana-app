import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SIZES} from '../../../constants';
import TableCustom from "../../common/TableCustom";
import {useFetch, useGet} from "../../../hooks/Fetch";
import NoDataFound from "../../common/NoDataFound";
import usePusher from "../../../hooks/Pusher";
import {mainStyles} from "../../../styles";

const DineIn = () => {
    const [orderPlaced, setOrderPlaced] = useState(null);
    const [cookingInProgress, setCookingInProgress] = useState(null);
    const [readyToServe, setReadyToServe] = useState(null);
    const [activeCategory, setCategory] = useState('Order Placed');


    const getOrderPlaced = useGet('/transactions/order-placed?is_takeaway=0');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress?is_takeaway=0');
    const getReadyToServe = useGet('/transactions/ready-to-serve?is_takeaway=0');

    usePusher('cooking-in-progress-channel', 'App\\Events\\SetCookingInProgressEvent', (response) => {
        setCookingInProgress((prevState) => ([...prevState, response.data]))
    });

    usePusher('ready-to-serve-transaction-channel', 'App\\Events\\SetReadyToServeEvent', (response) => {
        setReadyToServe((prevState) => ([...prevState, response.data]))
    });

    usePusher('transaction-channel', 'App\\Events\\CreateTransactionEvent', (response) => {
        setOrderPlaced((prevState) => ([...prevState, response.data]))
    });

    useEffect(() => {
        useFetch(getOrderPlaced, (data) => {
            if (data.transactions?.length > 0) {
                setOrderPlaced(data.transactions);
            }
        })

        useFetch(getReadyToServe, (data) => {
            if (data.transactions?.length > 0) {
                setReadyToServe(data.transactions);
            }
        })

        useFetch(getCookingInProgress, (data) => {
            if (data.transactions?.length > 0) {
                setCookingInProgress(data.transactions);
            }
        })
    }, []);

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
                activeCategory === 'Order Placed' && <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {orderPlaced?.length > 0 ? (
                        orderPlaced.map((item, index) => (
                            <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom>{item.table.name}</TableCustom>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            }


            {
                activeCategory === 'Cooking In Progress' && <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {cookingInProgress?.length > 0 ? (
                        cookingInProgress.map((item, index) => (
                            <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom>{item.table.name}</TableCustom>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            }

            {activeCategory === 'Ready To Serve' &&
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {readyToServe?.length > 0 ? (
                        readyToServe.map((item, index) => (
                            <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom>{item.table.name}</TableCustom>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            }

        </ScrollView>
    );
};

export default DineIn;
