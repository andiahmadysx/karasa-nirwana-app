import React, {useMemo} from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {mainStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import useCustomQuery, {useGet} from "../../hooks/Fetch";
import {useFocusEffect, useRouter} from "expo-router";
import DashboardCard from "../../components/common/DashboardCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../../hooks/Auth";

const AdminDashboard = () => {
    const router = useRouter();
    const {user} = useAuth();

    const {data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard} = useCustomQuery(
        'dashboard-admin',
        useGet('/dashboard-admin')
    );

    const dashboard = useMemo(() => dashboardData || {}, [dashboardData]);

    useFocusEffect(() => {
        async function fetchData() {
            const response = await AsyncStorage.getItem('@user');
            const userOnStorage = JSON.parse(response);
            if (userOnStorage?.role !== 'admin') {
                router.navigate('/' + userOnStorage?.role);
            }
        }

        if (!user) {
            fetchData();
        } else {
            if (user.role !== 'admin') {
                router.navigate('/' + user?.role);
            }
        }
    })

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={{marginBottom: SIZES.xLarge}}>
                <Text style={{fontSize: SIZES.large, color: COLORS.darkGray}}>Welcome,</Text>
                <Text style={{fontSize: SIZES.xxLarge, fontWeight: 600}}>{user?.name}</Text>
            </View>

            <ScrollView style={{gap: SIZES.medium}}>
                <DashboardCard hasDetail={true} onPress={() => router.navigate('/admin/manage_products')}
                               title="Total Product"
                               value={dashboard.product_count}
                />
                <DashboardCard hasDetail={true} onPress={() => router.navigate('/admin/users')} title="Total Users"
                               value={dashboard.user_count} backgroundColor="#E64F60"/>
                <DashboardCard hasDetail={true} onPress={() => router.navigate('/admin/categories')}
                               title="Total Categories"
                               value={dashboard.category_count}
                />
                <DashboardCard hasDetail={true} onPress={() => router.navigate('/admin/tables')} title="Total Tables"
                               value={dashboard.table_count} backgroundColor="#5695E5"/>
            </ScrollView>
        </SafeAreaView>
    );
};


export default AdminDashboard;
