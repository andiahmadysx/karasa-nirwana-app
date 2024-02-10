import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import useCustomQuery, {useGet} from "../../hooks/Fetch";
import {useAuth} from "../../hooks/Auth";
import {useRouter} from "expo-router";

const DashboardItem = ({ title, value, backgroundColor, handlePress }) => {
    return (
        <View
            style={{
                width: '100%',
                minHeight: 140,
                justifyContent: 'space-between',
                borderRadius: SIZES.small,
                padding: SIZES.large,
                borderWidth: 0.5,
                borderColor: COLORS.lightWhite,
                marginBottom: SIZES.light,
                backgroundColor,
                shadowColor: 'rgba(0,0,0,0.28)',
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 2,
                flexDirection: 'row'
            }}
        >
            <View style={{
                gap: SIZES.large
            }}>
                <Text style={{color: 'white', fontWeight: 600, fontSize: SIZES.large}}>{title}</Text>
                <Text style={{color: 'white', fontWeight: 600, fontSize: SIZES.xxLarge + SIZES.small}}>{value}</Text>
            </View>

            <TouchableOpacity onPress={handlePress}>
                <Text style={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: SIZES.medium
                }}>View All</Text>
            </TouchableOpacity>
        </View>
    );
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const router = useRouter();

    const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useCustomQuery(
        'dashboard-admin',
        useGet('/dashboard-admin')
    );

    const dashboard = useMemo(() => dashboardData || {}, [dashboardData]);

    return (
        <SafeAreaView style={mainStyles.container}>
            <View style={{ marginBottom: SIZES.xLarge }}>
                <Text style={{ fontSize: SIZES.large, color: COLORS.darkGray }}>Welcome,</Text>
                <Text style={{ fontSize: SIZES.xxLarge, fontWeight: 600 }}>{user?.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <DashboardItem handlePress={() => router.navigate('/admin/manage_products')}
                    title="Total Product"
                    value={dashboard.product_count}
                    backgroundColor="#96CC5D"
                />
                <DashboardItem handlePress={() => router.navigate('/admin/users')} title="Total Users" value={dashboard.user_count} backgroundColor="#E64F60" />
                <DashboardItem handlePress={() => router.navigate('/admin/categories')}
                    title="Total Categories"
                    value={dashboard.category_count}
                    backgroundColor="#ffc342"
                />
                <DashboardItem handlePress={() => router.navigate('/admin/tables')} title="Total Tables" value={dashboard.table_count} backgroundColor="#5695E5" />
            </View>
        </SafeAreaView>
    );
};


export default AdminDashboard;
