import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {useFocusEffect, useRouter} from 'expo-router';
import {COLORS, SIZES} from '../../constants';
import {mainStyles, searchStyles} from '../../styles';
import TableCustomNotUsed from '../../components/common/TableCustomNotUsed';
import {Icon, SearchIcon} from '@gluestack-ui/themed';
import useCustomQuery, {useGet} from '../../hooks/Fetch';
import NoDataFound from '../../components/common/NoDataFound';
import {useOrder} from '../../hooks/Order';
import usePusher from '../../hooks/Pusher';
import {FlashList} from "@shopify/flash-list";
import {ColumnItem} from "../../components/common/ColumnItem";
import TableCustom from "../../components/common/TableCustom";

const SelectTable = () => {
    const router = useRouter();
    const [selectedTable, setSelectedTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const {setOrder} = useOrder();
    const getNotUsedTables = useGet('/tables/not-used');
    const [isUpdated, setIsUpdated] = useState(false);


    const {
        data: notUsedTablesData,
        refetch: refetchNotUsedTables,
    } = useCustomQuery('notUsedTables', getNotUsedTables);

    const notUsedTables = useMemo(() => notUsedTablesData?.tables || [], [notUsedTablesData]);

    const handleSelectTable = useCallback(
        (val) => {
            setSelectedTable(val);
            setOrder((prevState) => ({...prevState, table_id: val.id}));
        },
        [setOrder]
    );

    const filteredTables = useMemo(() => {
        return notUsedTables?.filter((table) =>
            table.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [notUsedTables, searchTerm]);

    useFocusEffect(() => {
        Keyboard.dismiss()
    })

    usePusher(
        'table-channel',
        'App\\Events\\TableCreated', () => {
            refetchNotUsedTables();
        }
    );

    return (
        <SafeAreaView style={mainStyles.container}>

            <View
                style={[
                    searchStyles.searchContainer,
                    {marginBottom: SIZES.light},
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
                        placeholder={'Search table...'}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableCount}>
                    Available tables : {notUsedTables?.length}
                </Text>

                <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                    data={filteredTables}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={80}
                    showsVerticalScrollIndicator={false}
                    extraData={isUpdated}
                    renderItem={({item, index}) => (
                        <ColumnItem numColumns={2} index={index}>
                            <TableCustomNotUsed
                                handlePress={(item) => {
                                    handleSelectTable(item)
                                    setIsUpdated(!isUpdated)
                                }}
                                item={item}
                                isSelected={item === selectedTable}
                            >
                                {item.name}
                            </TableCustomNotUsed>
                        </ColumnItem>
                    )}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => router.navigate({pathname: '/cashier'})}
                    style={styles.cancelButton}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push({pathname: '/cashier/menu'})}
                    style={styles.nextButton}
                >
                    <Text style={[styles.buttonText, {color: '#fff'}]}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        marginTop: SIZES.medium,
        marginBottom: SIZES.small,
        marginHorizontal: SIZES.small,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        marginBottom: SIZES.small,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    tableContainer: {
        marginTop: SIZES.medium,
        marginBottom: SIZES.small,
        width: '100%',
        flex: 1,
        gap: SIZES.large
    },
    tableCount: {
        fontSize: SIZES.medium,
    },
    scrollView: {
        marginTop: SIZES.small,
        marginBottom: 130,
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: SIZES.small,
    },
    buttonContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        borderRadius: SIZES.small,
        marginVertical: SIZES.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: COLORS.bg,
    },
    cancelButton: {
        borderColor: COLORS.primary,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: SIZES.xSmall,
        borderRadius: SIZES.xSmall,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xSmall,
        borderRadius: SIZES.xSmall,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: SIZES.medium,
    },
});

export default SelectTable;
