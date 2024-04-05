import React, {useMemo, useState} from 'react';
import {SafeAreaView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {mainStyles, searchStyles} from '../../../../../karasa-nirwana/styles';
import {COLORS, SIZES} from '../../../../../karasa-nirwana/constants';
import CardUser from '../../../../../karasa-nirwana/components/admin/CardUser';
import {Icon, SearchIcon} from '@gluestack-ui/themed';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import useCustomQuery, {useGet} from '../../../../../karasa-nirwana/hooks/Fetch';
import debounce from 'lodash/debounce';
import {FlashList} from "@shopify/flash-list";
import {ColumnItem} from "../../../../../karasa-nirwana/components/common/ColumnItem";
import NoDataFound from "../../../../../karasa-nirwana/components/common/NoDataFound";

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


            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between',
                    borderRadius: SIZES.small,
                }}
            >
                <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                           showsVerticalScrollIndicator={false}
                           data={filteredUsers}
                           numColumns={2}
                           estimatedItemSize={80}

                           renderItem={({item, index}) => (
                               <ColumnItem numColumns={2} index={index}>
                                   <CardUser
                                       handlePress={() => {
                                           handleEdit(item.id);
                                       }}
                                       item={item}
                                   />
                               </ColumnItem>
                           )}
                />
            </View>

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
