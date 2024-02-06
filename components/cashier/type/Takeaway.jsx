import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import {SIZES} from '../../../constants';
import TableCustom from "../../common/TableCustom";
import {useGet} from "../../../hooks/Fetch";
import NoDataFound from "../../common/NoDataFound";

const Takeaway = () => {
    const [orderPlaced, setOrderPlaced] = useState(null);
    const [cookingInProgress, setCookingInProgress] = useState(null);
    const [readyToServe, setReadyToServe] = useState(null);


    const getOrderPlaced = useGet('/transactions/order-placed?is_takeaway=1');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress?is_takeaway=1');
    const getReadyToServe = useGet('/transactions/ready-to-serve?is_takeaway=1');

    const fetchData = async () => {
        try {
            const getOrderPlacedResponse = await getOrderPlaced();
            const getCookingInProgressResponse = await getCookingInProgress();
            const getReadyToServeResponse = await getReadyToServe();

            // Check length before setting the state
            if (getOrderPlacedResponse.data.transactions?.length > 0) {
                setOrderPlaced(getOrderPlacedResponse.data.transactions);
            }

            // Check length before setting the state
            if (getCookingInProgressResponse.data.transactions?.length > 0) {
                setCookingInProgress(getCookingInProgressResponse.data.transactions);
            }

            // Check length before setting the state
            if (getReadyToServeResponse.data.transactions?.length > 0) {
                setReadyToServe(getReadyToServeResponse.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData();


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
            <Text
                style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'bold',
                }}
            >
                Order Placed: {orderPlaced?.length}
            </Text>


            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SIZES.small, justifyContent: 'space-between' }}>
                {orderPlaced?.length > 0 ? (
                    orderPlaced.map((item, index) => (
                        <View key={index} style={{ flexBasis: '46%', margin: SIZES.light }}>
                            <TableCustom>{item.customer_name}</TableCustom>
                        </View>
                    ))
                ) : (
                    <NoDataFound />
                )}
            </View>

            <Text
                style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'bold',
                    marginTop: SIZES.medium,
                }}
            >
                Cooking In Progress: {cookingInProgress?.length}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SIZES.small, justifyContent: 'space-between' }}>
                {cookingInProgress?.length > 0 ? (
                    cookingInProgress.map((item, index) => (
                        <View key={index} style={{ flexBasis: '46%', margin: SIZES.light }}>
                            <TableCustom>{item.customer_name}</TableCustom>
                        </View>
                    ))
                ) : (
                    <NoDataFound />
                )}
            </View>

            <Text
                style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'bold',
                    marginTop: SIZES.medium,
                }}
            >
                Ready to Serve: {readyToServe?.length}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SIZES.small, justifyContent: 'space-between' }}>
                {readyToServe?.length > 0 ? (
                    readyToServe.map((item, index) => (
                        <View key={index} style={{ flexBasis: '46%', margin: SIZES.light }}>
                            <TableCustom>{item.customer_name}</TableCustom>
                        </View>
                    ))
                ) : (
                    <NoDataFound />
                )}
            </View>
        </ScrollView>
    );
};

export default Takeaway;
