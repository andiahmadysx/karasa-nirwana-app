import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {mainStyles} from '../../styles';
import {formatCurrency} from '../../utils/formatCurrency';
import {getFormatedDate} from 'react-native-modern-datepicker';
import DateSelectionModal from '../../components/common/DateSelectionModal';
import {COLORS, SIZES} from "../../constants";
import {Center, Divider} from "@gluestack-ui/themed";
import {router, useFocusEffect} from "expo-router";
import {useGet} from "../../hooks/Fetch";
import DashboardCard from "../../components/common/DashboardCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../hooks/Auth";
import {FlashList} from "@shopify/flash-list";
import NoDataFound from "../../components/common/NoDataFound";

const getInitialDate = (daysOffset) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysOffset);
    return getFormatedDate(currentDate, 'DD-MM-YYYY');
};

const ProductItem = ({index, name, price, saledStock, key}) => (
    <View style={styles.productItemContainer} key={key}>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SIZES.medium
        }}>
            <Text style={{
                backgroundColor: '#156400',
                paddingVertical: 2,
                paddingHorizontal: SIZES.light + 2,
                borderRadius: SIZES.small,
                color: COLORS.white
            }}>{index}</Text>
            <View>
                <Text style={styles.productItemName}>{name}</Text>
                <Text style={styles.productItemPrice}>{price}</Text>
            </View>
        </View>
        <Text style={styles.productItemPrice}>{saledStock}</Text>
    </View>
);

const InsightsItem = ({label, value}) => (
    <View style={styles.insightsItemContainer}>
        <Text>{label}</Text>
        <Text style={styles.insightsItemValue}>{value}</Text>
    </View>
);


const OwnerDashboard = () => {
    const [showModalStartDate, setShowModalStartDate] = useState(false);
    const [showModalEndDate, setShowModalEndDate] = useState(false);
    const [startDate, setStartDate] = useState(getInitialDate(-30));
    const [endDate, setEndDate] = useState(getFormatedDate(new Date(), 'DD-MM-YYYY'));
    const getDashboard = useGet(`/owners/dashboard`);
    const [owners, setOwners] = useState({});


    const {user, removeUser} = useAuth();

    const fetch = async (sDate, eDate) => {
        const response = await getDashboard({
            params: {
                start_date: sDate,
                end_date: eDate,
            },
        });
        setOwners(response.data);
    }


    useEffect(() => {
        fetch();
    }, []);


    useFocusEffect(() => {
        async function fetchData() {
            const response = await AsyncStorage.getItem('@user');
            const userOnStorage = JSON.parse(response);
            if (userOnStorage?.role !== 'owner') {
                router.navigate('/' + userOnStorage?.role);
            }
        }

        if (!user) {
            fetchData();
        } else {
            if (user.role !== 'owner') {
                router.navigate('/' + user.role);
            }
        }
    })

    const handleDateChange = useCallback((date, setFunction, setShowModalFunction) => {
        setFunction(date);
        setShowModalFunction(false);
    }, [startDate, endDate]);

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Dashboard</Text>
            </View>

            <View style={styles.datePickerContainer}>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowModalStartDate(true)}>
                    <Text style={styles.datePickerButtonText}>{startDate}</Text>
                    <Ionicons name={'calendar-outline'} size={24}/>
                </TouchableOpacity>

                <Text>-</Text>

                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowModalEndDate(true)}>
                    <Text style={styles.datePickerButtonText}>{endDate}</Text>
                    <Ionicons name={'calendar-outline'} size={24}/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <DashboardCard
                    title="Total Sales"
                    value={formatCurrency(owners?.total_sales)}
                    onPress={() => console.log('View Details - Total Sales')}
                />
                <DashboardCard
                    title="Total Transactions"
                    value={owners?.total_transactions}
                    onPress={() => console.log('View Details - Total Transactions')}
                />
                <DashboardCard
                    title="Products Sold"
                    value={owners?.products_sold}
                    onPress={() => console.log('View Details - Products Sold')}
                />

                <View style={styles.bestSellingProductsContainer}>
                    <Text style={styles.bestSellingProductsTitle}>Best Selling Products</Text>
                        <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                            data={owners?.best_selling_products}
                            renderItem={({item, index}) => <ProductItem key={item.id}
                                                                 index={index + 1}
                                                                 name={item.name}
                                                                 price={formatCurrency(item.sub_total)}
                                                                 saledStock={item.qty}/>}
                            estimatedItemSize={200}
                            />
                </View>

                <View style={styles.insightsContainer}>
                    <Text style={styles.insightsTitle}>Insights</Text>
                    <InsightsItem label="Average daily sales" value={formatCurrency(owners?.average_daily_sales)}/>
                    <Divider mt={'$2'}/>
                    <InsightsItem label="Average transaction value"
                                  value={formatCurrency(owners?.average_transaction_value)}/>
                    <Divider mt={'$2'}/>
                    <InsightsItem label="Busiest day" value={owners?.busiest_day}/>
                    <Divider mt={'$2'}/>
                    <InsightsItem label="Peak hour" value={owners?.peak_hour}/>
                </View>
            </ScrollView>

            <Center h={400} style={styles.dateSelectionModalCenter}>
                <DateSelectionModal startDate={startDate}
                    isOpen={showModalStartDate}
                    onClose={() => setShowModalStartDate(false)}
                    title="Select Start Date"
                    selected={startDate}
                    onDateChange={(date) => {
                        handleDateChange(date, setStartDate, setShowModalStartDate)
                        fetch(date, endDate)
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
                        fetch(startDate, date);
                    }}
                />
            </Center>
        </SafeAreaView>
    );
};

const styles = {
    headerContainer: {
        marginTop: SIZES.medium,
    },
    headerText: {
        fontSize: SIZES.xLarge,
        fontWeight: '600',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SIZES.small,
        marginTop: SIZES.xLarge,
        marginBottom: SIZES.small,
    },
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
        backgroundColor: 'white',
    },
    datePickerButtonText: {
        fontSize: SIZES.medium,
    },
    scrollView: {
        gap: SIZES.medium,
    },
    dashboardCard: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        height: 140,
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
    bestSellingProductsContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.small,
        marginTop: SIZES.medium,
        paddingHorizontal: SIZES.xxLarge,
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        marginBottom: SIZES.medium,
        paddingVertical: SIZES.large,
    },
    bestSellingProductsTitle: {
        fontSize: SIZES.medium,
        fontWeight: 600,
    },
    productItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.small,
    },
    productItemName: {
        fontWeight: 500,
        fontSize: SIZES.medium,
    },
    productItemPrice: {
        color: COLORS.darkGray,
    },
    insightsContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.small,
        paddingHorizontal: SIZES.xxLarge,
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        marginBottom: SIZES.xxLarge,
        paddingVertical: SIZES.large,
    },
    insightsTitle: {
        fontSize: SIZES.medium,
        fontWeight: 600,
    },
    insightsItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.small,
    },
    insightsItemValue: {
        fontWeight: 500,
    },
    dateSelectionModalCenter: {
        position: 'absolute',
    },
};

export default OwnerDashboard;
