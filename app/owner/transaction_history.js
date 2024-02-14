import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '../../hooks/Auth';
import {formatCurrency} from '../../utils/formatCurrency';
import {getFormatedDate} from 'react-native-modern-datepicker';
import DateSelectionModal from '../../components/common/DateSelectionModal';
import {Badge, BadgeText, Center} from '@gluestack-ui/themed';
import {COLORS, SIZES} from "../../constants";
import {mainStyles} from "../../styles";
import {useGet} from "../../hooks/Fetch";
import {FlashList} from "@shopify/flash-list";
import {generatePDF} from "../../utils/generatePDF";
import {useRouter} from "expo-router";
import NoDataFound from "../../components/common/NoDataFound";

const getInitialDate = (daysOffset) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysOffset);
    return getFormatedDate(currentDate, 'DD-MM-YYYY');
};

const TransactionInfo = ({title, value}) => (
    <View>
        <Text style={{color: 'white'}}>{title}</Text>
        <Text style={{color: 'white', fontWeight: 500, fontSize: SIZES.xxLarge}}>{value}</Text>
    </View>
);

const DateRangePicker = ({
                             startDate,
                             endDate,
                             onStartDateChange,
                             onEndDateChange,
                             showModalStartDate,
                             showModalEndDate
                         }) => (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SIZES.small,
        marginTop: SIZES.xxLarge,
        marginBottom: SIZES.small,
    }}>
        <TouchableOpacity
            style={{
                ...styles.datePickerButton,
                flexDirection: 'row',
            }}
            onPress={showModalStartDate}
        >
            <Text style={styles.datePickerButtonText}>{startDate}</Text>
            <Ionicons name={'calendar-outline'} size={24}/>
        </TouchableOpacity>

        <Text>-</Text>

        <TouchableOpacity
            style={{
                ...styles.datePickerButton,
                flexDirection: 'row',
            }}
            onPress={showModalEndDate}
        >
            <Text style={styles.datePickerButtonText}>{endDate}</Text>
            <Ionicons name={'calendar-outline'} size={24}/>
        </TouchableOpacity>
    </View>
);

const TransactionItem = ({amount, description, status, id, router}) => (
    <TouchableOpacity onPress={() => {
        router.navigate('/owner/receipt/' + id);
    }} style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        alignItems: 'center',
    }}>
        <View style={{
            flexDirection: 'row',
            gap: SIZES.small,
            alignItems: 'center',
        }}>
            <Ionicons name={'receipt-outline'} size={24}/>
            <View>
                <Text style={{fontSize: SIZES.medium}}>{formatCurrency(amount)}</Text>
                <Text
                    style={{color: COLORS.darkGray}}>{description}</Text>
            </View>
        </View>

        <Badge size="md" variant="solid" borderColor={'$success600'} borderRadius="$md" style={{
            borderWidth: 0.5,
            paddingHorizontal: SIZES.medium,
            height: SIZES.xxLarge + 2,
            position: 'absolute',
            right: SIZES.small
        }} bg={'rgba(89,255,35,0.07)'} action={'success'}>
            <BadgeText style={{
                color: COLORS.primary
            }}>{status}</BadgeText>
        </Badge>
    </TouchableOpacity>
);

const TransactionHistory = () => {
    const {user} = useAuth();
    const [showModalStartDate, setShowModalStartDate] = useState(false);
    const [showModalEndDate, setShowModalEndDate] = useState(false);
    const [startDate, setStartDate] = useState(getInitialDate(-30));
    const [endDate, setEndDate] = useState(getFormatedDate(new Date(), 'DD-MM-YYYY'));
    const [transactions, setTransactions] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();


    const getTransactionHistory = useGet(`/owners/transaction-history`);

    const fetch = async (sDate, eDate, page = 1, perPage = 15) => {

        const response = await getTransactionHistory({
            params: {
                start_date: sDate,
                end_date: eDate,
                page: page,
                per_page: perPage,
            },
        });

        setTransactions(response.data.data);
        setTransactionData((prevState) => [...prevState, ...response.data.data.transactions.data])
        setCurrentPage(response.data.data.transactions.current_page);
        setTotalPages(response.data.data.transactions.last_page);
    };

    const refetch = async (sDate, eDate, page = 1, perPage = 15) => {
        const response = await getTransactionHistory({
            params: {
                start_date: sDate,
                end_date: eDate,
                page: page,
                per_page: perPage,
            },
        });

        setTransactions(response.data.data);
        setTransactionData(response.data.data.transactions.data);
        setCurrentPage(response.data.data.transactions.current_page);
        setTotalPages(response.data.data.transactions.last_page);
    }

    useEffect(() => {
        fetch();
    }, []);


    const handleEndReached = () => {
        if (currentPage < totalPages) {
            fetch(startDate, endDate, currentPage + 1);
        }
    };

    const handleDateChange = useCallback((date, setFunction, setShowModalFunction) => {
        setFunction(date);
        setShowModalFunction(false);
        setCurrentPage(1); // Reset page number when date changes
        setTransactions([]); // Reset transactions when date changes
        refetch(date, endDate);
    }, [endDate]);


    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={{marginBottom: SIZES.xLarge, marginTop: SIZES.medium}}>
                <Text style={{fontSize: SIZES.xLarge, fontWeight: 600}}>History Transactions</Text>
            </View>

            <View style={{
                backgroundColor: COLORS.primary,
                flexDirection: 'row',
                height: 140,
                borderRadius: SIZES.small,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: SIZES.xxLarge,
            }}>
                <TransactionInfo title="Transaction" value={transactions?.total_transactions}/>
                <TransactionInfo title="Total Sales" value={formatCurrency(parseInt(transactions?.total_sales))}/>
            </View>

            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => handleDateChange(date, setStartDate, setShowModalStartDate)}
                onEndDateChange={(date) => handleDateChange(date, setEndDate, setShowModalEndDate)}
                showModalStartDate={() => setShowModalStartDate(true)}
                showModalEndDate={() => setShowModalEndDate(true)}
            />


            <FlashList ListEmptyComponent={() => <NoDataFound/>}
                       renderItem={({item}) => <TransactionItem router={router} id={item.id}
                                                                amount={parseInt(item.total_price)}
                                                                description={item.invoice_number}
                                                                status={item.status}/>}
                       data={transactionData || []}
                       estimatedItemSize={200}
                       keyExtractor={(item, index) => index.toString()}
                       onEndReached={handleEndReached}
                       onEndReachedThreshold={0.1} // Adjust as needed
            />

            <Center h={400} style={styles.dateSelectionModalCenter}>
                <DateSelectionModal startDate={startDate}
                                    isOpen={showModalStartDate}
                                    onClose={() => setShowModalStartDate(false)}
                                    title="Select Start Date"
                                    selected={startDate}
                                    onDateChange={(date) => {
                                        handleDateChange(date, setStartDate, setShowModalStartDate)
                                        refetch(date, endDate)
                                    }}
                />
            </Center>

            <Center h={400} style={styles.dateSelectionModalCenter}>
                <DateSelectionModal startDate={startDate}
                                    isOpen={showModalEndDate}
                                    onClose={() => setShowModalEndDate(false)}
                                    title="Select End Date"
                                    selected={endDate}
                                    onDateChange={(date) => {
                                        handleDateChange(date, setEndDate, setShowModalEndDate)
                                        refetch(date, startDate);
                                    }}
                />
            </Center>
            <TouchableOpacity
                onPress={() => {
                    generatePDF(transactions?.transactions?.data, startDate, endDate, transactions?.total_transaction, transactions?.total_sales)
                }}
                style={{
                    paddingHorizontal: SIZES.xxLarge,
                    paddingVertical: SIZES.medium,
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.small,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge,
                }}
            >
                <Text style={{
                    fontWeight: 600,
                    fontSize: SIZES.medium,
                    color: COLORS.white
                }}>Export</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = {
    datePickerButton: {
        height: SIZES.xxLarge + SIZES.medium,
        borderColor: COLORS.gray,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.light,
        flex: 0.5,
        justifyContent: 'space-between',
    },
    datePickerButtonText: {
        fontSize: SIZES.medium,
    },
    dateSelectionModalCenter: {
        position: 'absolute'
    }
};

export default TransactionHistory;
