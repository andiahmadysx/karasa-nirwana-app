import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '../../hooks/Auth';
import {getFormatedDate} from 'react-native-modern-datepicker';
import DateSelectionModal from '../../components/common/DateSelectionModal';
import {Badge, BadgeText, Center} from '@gluestack-ui/themed';
import {COLORS, SIZES} from "../../constants";
import {mainStyles} from "../../styles";
import {formatDate} from "../../utils/formatDate";
import {useGet} from "../../hooks/Fetch";
import {FlashList} from "@shopify/flash-list";
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

const LogItem = ({activity, role, username, date}) => (
    <TouchableOpacity style={{
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
            <Ionicons name={'person-outline'} size={24}/>
            <View>
                <Text style={{fontSize: SIZES.medium}}>{activity}</Text>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{color: COLORS.darkGray}}>@{username}</Text>
                    <Text style={{color: COLORS.darkGray}}> | {formatDate(date)}</Text>
                </View>
            </View>
        </View>


        <Badge size="md" variant="solid" borderColor={'$success600'} borderRadius="$md" style={{
            borderWidth: 0.5,
            paddingHorizontal: SIZES.medium,
            height: SIZES.xxLarge + 2,
        }} bg={'rgba(89,255,35,0.07)'} action={'success'}>
            <BadgeText>{role}</BadgeText>
        </Badge>
    </TouchableOpacity>
);

const OwnerDashboard = () => {
    const {user} = useAuth();
    const [showModalStartDate, setShowModalStartDate] = useState(false);
    const [showModalEndDate, setShowModalEndDate] = useState(false);
    const [startDate, setStartDate] = useState(getInitialDate(-30));
    const [endDate, setEndDate] = useState(getFormatedDate(new Date(), 'DD-MM-YYYY'));
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const getLogActivity = useGet('/owners/logs');


    const fetch = async (sDate, eDate, page = 1, perPage = 15) => {

        const response = await getLogActivity({
            params: {
                start_date: sDate,
                end_date: eDate,
                page: page,
                per_page: perPage,
            },
        });

        setLogs((prevState) => [...prevState, ...response.data.logs.data]);
        setCurrentPage(response.data.logs.current_page);
        setTotalPages(response.data.logs.last_page);
    };

    const refetch = async (sDate, eDate, page = 1, perPage = 15) => {
        const response = await getLogActivity({
            params: {
                start_date: sDate,
                end_date: eDate,
                page: page,
                per_page: perPage,
            },
        });

        setLogs(response.data.logs.data);
        setCurrentPage(response.data.logs.current_page);
        setTotalPages(response.data.logs.last_page);
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
        setLogs([]); // Reset transactions when date changes
        refetch(date, endDate);
    }, []);

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={{marginBottom: SIZES.xLarge, marginTop: SIZES.medium}}>
                <Text style={{fontSize: SIZES.xLarge, fontWeight: 600}}>Log Activity</Text>
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
                       renderItem={({item}) => <LogItem username={item.user.username} date={item.created_at}
                                                        activity={item.activity} role={item.user.role}/>}
                       data={logs || []}
                       estimatedItemSize={200}
                       keyExtractor={(item, index) => index.toString()}
                       onEndReached={handleEndReached}
                       onEndReachedThreshold={0.1} // Adjust as needed
            />


            <Center h={400} style={{position: 'absolute'}}>
                <DateSelectionModal startDate={startDate}
                                    isOpen={showModalStartDate}
                                    onClose={() => setShowModalStartDate(false)}
                                    title="Select Start Date"
                                    selected={startDate}
                                    onDateChange={(date) => handleDateChange(date, setStartDate, setShowModalStartDate)}
                />
            </Center>

            <Center h={400} style={{position: 'absolute'}}>
                <DateSelectionModal startDate={startDate}
                                    isOpen={showModalEndDate}
                                    onClose={() => setShowModalEndDate(false)}
                                    title="Select End Date"
                                    onDateChange={(date) => handleDateChange(date, setEndDate, setShowModalEndDate)}
                                    selected={endDate}
                />
            </Center>
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
};

export default OwnerDashboard;
