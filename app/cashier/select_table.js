import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ScrollView,
    TouchableOpacity, FlatList,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { COLORS, icons, SIZES } from '../../constants';
import { mainStyles, searchStyles } from '../../styles';
import TableCustomNotUsed from '../../components/common/TableCustomNotUsed';
import chunkArray from '../../utils/chunkArray';
import { Icon, SearchIcon } from "@gluestack-ui/themed";
import {useFetch, useGet} from "../../hooks/Fetch";
import NoDataFound from "../../components/common/NoDataFound";
import {useOrder} from "../../hooks/Order";
import usePusher from "../../hooks/Pusher";

const SelectTable = () => {
    const router = useRouter();
    const [selectedTable, setSelectedTable] = useState(null);
    const [notUsedTables, setNotUsedTable] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {setOrder, reset} = useOrder();
    const getNotUsedTables = useGet('/tables/not-used');

     usePusher('table-channel', 'App\\Events\\TableCreated', (response) => {
        setNotUsedTable((prevState) => [...prevState, response.data]);

    })

    useEffect(() => {
        reset();


        useFetch(getNotUsedTables, (data) => {
            setNotUsedTable(data.tables);
        })
    }, []);

    const handleSelectTable = (val) => {
        setSelectedTable(val);
        setOrder((prevState) => ({...prevState, table_id: val.id}))
    };

    const filteredTables = notUsedTables?.filter(table =>
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SafeAreaView style={mainStyles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Select Table',
                    headerTitleStyle: {fontSize: 18, fontWeight: 'normal'},
                    headerBackImageSource: icons.chevronLeft,
                    headerTitleAlign: 'center',
                }}
            />

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


                <FlatList
                    data={filteredTables}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <View style={{flex: 1, margin: 5}}>
                            <TableCustomNotUsed
                                key={index}
                                handlePress={handleSelectTable}
                                item={item}
                                isSelected={item === selectedTable}
                            >
                                {item.name}
                            </TableCustomNotUsed>
                        </View>
                    )}
                    ListEmptyComponent={<NoDataFound/>}
                    style={{
                        marginTop: SIZES.small,
                        marginBottom: 120
                    }}
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
        marginHorizontal: SIZES.small,
    },
    tableCount: {
        fontSize: SIZES.medium,
        fontWeight: 600,
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
        borderRadius: 100,
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
        borderRadius: 100,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xSmall,
        borderRadius: 100,
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
