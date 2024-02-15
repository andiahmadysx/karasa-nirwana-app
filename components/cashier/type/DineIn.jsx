import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SIZES} from '../../../constants';
import TableCustom from "../../common/TableCustom";
import useCustomQuery, {useGet} from "../../../hooks/Fetch";
import NoDataFound from "../../common/NoDataFound";
import usePusher from "../../../hooks/Pusher";
import {mainStyles} from "../../../styles";
import {FlashList} from "@shopify/flash-list";
import {ColumnItem} from "../../common/ColumnItem";

const DineIn = () => {
    const [activeCategory, setCategory] = useState('Order Placed');

    // api fetch
    const getOrderPlaced = useGet('/transactions/order-placed?is_takeaway=0');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress?is_takeaway=0');
    const getReadyToServe = useGet('/transactions/ready-to-serve?is_takeaway=0');

    const {
        data: orderPlacedData, error: orderPlacedError, isLoading: orderPlacedLoading, refetch: refetchOrderPlaced
    } = useCustomQuery('orderPlacedDineIn', getOrderPlaced);
    const {
        data: cookingInProgressData,
        error: cookingInProgressError,
        isLoading: cookingInProgressLoading,
        refetch: refetchCookingInProgress
    } = useCustomQuery('cookingInProgressDineIn', getCookingInProgress);
    const {
        data: readyToServeData, error: readyToServeError, isLoading: readyToServeLoading, refetch: refetchReadyToServe
    } = useCustomQuery('readyToServeDineIn', getReadyToServe);

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

    return (<View
            style={{
                width: '100%', flex: 1, marginTop: SIZES.medium, marginBottom: 60,
            }}
        >

        <View style={mainStyles.tabsContainer}>
            <FlashList ListEmptyComponent={() => <NoDataFound/>}
                       estimatedItemSize={80}
                       data={['Order Placed', 'Cooking In Progress', 'Ready To Serve']}
                       renderItem={({item}) => (<TouchableOpacity
                           style={mainStyles.tab(activeCategory, item)}
                           onPress={() => setCategory(item)}
                       >
                           <Text style={mainStyles.tabText(activeCategory, item)}>
                               {item}
                           </Text>
                       </TouchableOpacity>)}
                       keyExtractor={(item) => item}
                       horizontal={true}
                       showsHorizontalScrollIndicator={false}
            />
        </View>


        {activeCategory === 'Order Placed' && <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                                                         data={orderPlaced}
                                                         numColumns={2}
                                                         estimatedItemSize={80}
                                                         showsVerticalScrollIndicator={false}
                                                         renderItem={({item, index}) => (
                                                             <ColumnItem numColumns={2} index={index}>
                                                                 <TableCustom
                                                                     item={item}>{item?.table?.name}</TableCustom>
                                                             </ColumnItem>)}
        />}


        {activeCategory === 'Cooking In Progress' && <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                                                                data={cookingInProgress}
                                                                numColumns={2}
                                                                estimatedItemSize={80}
                                                                showsVerticalScrollIndicator={false}
                                                                renderItem={({item, index}) => (
                                                                    <ColumnItem numColumns={2} index={index}>
                                                                        <TableCustom
                                                                            item={item}>{item?.table?.name}</TableCustom>
                                                                    </ColumnItem>)}
        />}

        {activeCategory === 'Ready To Serve' && <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                                                           data={readyToServe}
                                                           numColumns={2}
                                                           estimatedItemSize={80}
                                                           showsVerticalScrollIndicator={false}
                                                           renderItem={({item, index}) => (
                                                               <ColumnItem numColumns={2} index={index}>
                                                                   <TableCustom
                                                                       item={item}>{item?.table?.name}</TableCustom>
                                                               </ColumnItem>)}
        />}
    </View>);
};

export default DineIn;
