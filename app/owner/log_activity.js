import React, { useCallback, useState } from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/Auth';
import { formatCurrency } from '../../utils/formatCurrency';
import { getFormatedDate } from 'react-native-modern-datepicker';
import DateSelectionModal from '../../components/common/DateSelectionModal';
import { Badge, BadgeText, Center } from '@gluestack-ui/themed';
import {COLORS, SIZES} from "../../constants";
import {mainStyles} from "../../styles";

const getInitialDate = (daysOffset) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysOffset);
    return getFormatedDate(currentDate, 'DD-MM-YY');
};

const TransactionInfo = ({ title, value }) => (
    <View>
        <Text style={{ color: 'white' }}>{title}</Text>
        <Text style={{ color: 'white', fontWeight: 500, fontSize: SIZES.xxLarge }}>{value}</Text>
    </View>
);

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange, showModalStartDate, showModalEndDate }) => (
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
            <Ionicons name={'calendar-outline'} size={24} />
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
            <Ionicons name={'calendar-outline'} size={24} />
        </TouchableOpacity>
    </View>
);

const LogItem = ({ activity, role, username}) => (
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
            <Ionicons name={'person-outline'} size={24} />
            <View>
                <Text style={{ fontSize: SIZES.medium }}>{activity}</Text>
                <Text style={{ color: COLORS.darkGray }}>@{username}</Text>
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
    const { user } = useAuth();
    const [showModalStartDate, setShowModalStartDate] = useState(false);
    const [showModalEndDate, setShowModalEndDate] = useState(false);
    const [startDate, setStartDate] = useState(getInitialDate(-30));
    const [endDate, setEndDate] = useState(getFormatedDate(new Date(), 'DD-MM-YY'));

    const handleDateChange = useCallback((date, setFunction, setShowModalFunction) => {
        setFunction(date);
        setShowModalFunction(false);
    }, []);

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={{ marginBottom: SIZES.xLarge, marginTop: SIZES.medium }}>
                <Text style={{ fontSize: SIZES.xLarge, fontWeight: 600 }}>Log Activity</Text>
            </View>

            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(date) => handleDateChange(date, setStartDate, setShowModalStartDate)}
                onEndDateChange={(date) => handleDateChange(date, setEndDate, setShowModalEndDate)}
                showModalStartDate={() => setShowModalStartDate(true)}
                showModalEndDate={() => setShowModalEndDate(true)}
            />

            <ScrollView>
                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Login into account'}
                    username="andiahmad"
                    role="admin"
                />

                <LogItem
                    activity={'Add new product'}
                    username="andiahmad"
                    role="admin"
                />

            </ScrollView>




            <Center h={400} style={{ position: 'absolute' }}>
                <DateSelectionModal
                    isOpen={showModalStartDate}
                    onClose={() => setShowModalStartDate(false)}
                    title="Select Start Date"
                    selected={startDate}
                    onDateChange={(date) => handleDateChange(date, setStartDate, setShowModalStartDate)}
                />
            </Center>

            <Center h={400} style={{ position: 'absolute' }}>
                <DateSelectionModal
                    isOpen={showModalEndDate}
                    onClose={() => setShowModalEndDate(false)}
                    title="Select End Date"
                    onDateChange={(date) => handleDateChange(date, setEndDate, setShowModalEndDate)}
                    selected={endDate}
                />
            </Center>


            <TouchableOpacity
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
};

export default OwnerDashboard;
