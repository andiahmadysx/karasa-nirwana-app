import React, {useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {mainStyles, searchStyles} from '../../styles';
import {COLORS, SIZES} from '../../constants';
import NoDataFound from '../../components/common/NoDataFound';
import CardUser from '../../components/admin/CardUser';
import {Icon, SearchIcon} from '@gluestack-ui/themed';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import useCustomQuery, {useGet} from '../../hooks/Fetch';
import debounce from 'lodash/debounce';

const Users = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const {data: usersData} = useCustomQuery(
        'users-data',
        useGet('/users')
    );

    const users = useMemo(() => usersData?.users || [], [usersData]);

    const handleEdit = debounce((id) => {
        router.navigate('/admin/detail-users/' + id);
    }, 100);

    const handleAdd = debounce(() => {
        router.navigate('/admin/detail-users/create');
    }, 100);

    const filteredUsers = useMemo(
        () =>
            users.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [users, searchTerm]
    );

    return (
        <SafeAreaView style={mainStyles.container}>
            <View
                style={[
                    searchStyles.searchContainer,
                    {marginBottom: SIZES.xxSmall},
                ]}
            >
                <View
                    style={[
                        searchStyles.searchWrapper,
                        {paddingLeft: SIZES.small},
                    ]}
                >
                    <Icon as={SearchIcon} color={COLORS.gray}/>
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder={'Search user...'}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: SIZES.small,
                    marginHorizontal: SIZES.light,
                    flex: 1,
                }}
                contentContainerStyle={{
                    justifyContent: 'center',
                }}
                horizontal={false}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: SIZES.small,
                        justifyContent: 'space-between',
                        borderRadius: SIZES.small,
                    }}
                >
                    {filteredUsers?.length > 0 ? (
                        filteredUsers.map((item, index) => (
                            <View
                                key={item.id}
                                style={{
                                    flexBasis: '48.5%',
                                    marginBottom: SIZES.small + 2,
                                    borderRadius: SIZES.small,
                                }}
                            >
                                <CardUser
                                    handlePress={() => {
                                        handleEdit(item.id);
                                    }}
                                    item={item}
                                />
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            </ScrollView>

            {!filteredUsers && (
                <TouchableOpacity
                    onPress={() => {
                        router.navigate(
                            order.is_takeaway
                                ? '/cashier/menu'
                                : '/cashier/select_table'
                        );
                    }}
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.small,
                        flex: 1,
                        position: 'absolute',
                        bottom: 0,
                        margin: SIZES.small,
                        width: '100%',
                        alignSelf: 'center',
                    }}
                >
                    <Text style={mainStyles.footerText}>Add User</Text>
                </TouchableOpacity>
            )}

            {filteredUsers && (
                <TouchableOpacity
                    style={{
                        paddingHorizontal: SIZES.small,
                        paddingVertical: SIZES.small - 1,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.small,
                        position: 'absolute',
                        right: SIZES.xLarge + 4,
                        bottom: SIZES.xxLarge,
                    }}
                    onPress={handleAdd}
                >
                    <Ionicons
                        name={'add-outline'}
                        size={SIZES.xxLarge}
                        color={'white'}
                    />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Users;
