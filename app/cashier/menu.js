import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import {COLORS, icons, SIZES} from '../../constants';
import {mainStyles, searchStyles} from '../../styles';
import {Icon, SearchIcon} from '@gluestack-ui/themed';
import useCustomQuery, {useGet} from '../../hooks/Fetch';
import {useOrder} from '../../hooks/Order';
import usePusher from '../../hooks/Pusher';
import CardProductMenu from "../../components/cashier/CardProductMenu";
import {ColumnItem} from "../../components/common/ColumnItem";
import {FlashList} from "@shopify/flash-list";
import NoDataFound from "../../components/common/NoDataFound";

const Menu = () => {
    const router = useRouter();
    const [activeCategory, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const {order, reset} = useOrder();

    const {data: productsData, isLoading: productsLoading, refetch: refetchProducts} = useCustomQuery(
        'products',
        useGet('/products')
    );
    const {data: categoriesData, isLoading: categoriesLoading} = useCustomQuery(
        'categories-array',
        useGet('/categories')
    );

    const products = productsData?.products || [];
    const categories = categoriesData?.categories || [];

    const filteredProducts = useMemo(() => {
        return products.filter(
            (product) =>
                (activeCategory === 'All' || product.category === activeCategory) &&
                (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [products, activeCategory, searchQuery]);

    usePusher('product-channel', 'App\\Events\\ProductCreated', (response) => {
        refetchProducts();
    });

    useEffect(() => {
        if (order?.is_takeaway) {
            // reset();
        }
    }, [order, reset]);

    const handleCategoryPress = useCallback((item) => {
        setCategory(item);
    }, []);

    const handleCancelPress = useCallback((is_takeaway) => {
        router.navigate({
            pathname: is_takeaway ? '/cashier' : '/cashier/select_table',
        });
    }, [order, router]);

    const handleNextPress = useCallback(() => {
        router.push({
            pathname: '/cashier/confirm',
        });
    }, [router]);

    return (
        <SafeAreaView style={mainStyles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Select Menu',
                    headerTitleStyle: {fontSize: 18, fontWeight: 'normal'},
                    headerBackImageSource: icons.chevronLeft,
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                }}
            />

            <View style={[searchStyles.searchContainer, {marginBottom: SIZES.xxLarge}]}>
                <View style={[searchStyles.searchWrapper, {paddingLeft: SIZES.small}]}>
                    <Icon as={SearchIcon} color={COLORS.gray}/>
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder={'Search Menu...'}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
            </View>

            <View style={mainStyles.tabsContainer}>
                <FlatList
                    data={categories}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={mainStyles.tab(activeCategory, item)}
                            onPress={() => handleCategoryPress(item)}
                        >
                            <Text style={mainStyles.tabText(activeCategory, item)}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item?.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View
                style={{
                    width: '100%',
                    flex: 1,
                    marginTop: SIZES.medium,
                    marginBottom: 60,
                }}
            >
                <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                           data={filteredProducts}
                           numColumns={2}
                           keyExtractor={(item, index) => index.toString()}
                           estimatedItemSize={80}
                           showsVerticalScrollIndicator={false}
                    // extraData={isUpdated}
                           renderItem={({item, index}) => (
                               <ColumnItem numColumns={2} index={index}>
                                   <CardProductMenu item={item}/>
                               </ColumnItem>
                           )}
                />
            </View>


            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleCancelPress(order?.is_takeaway)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
                    <Text style={[styles.buttonText, {color: '#fff'}]}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
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
        borderRadius: SIZES.small,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xSmall,
        borderRadius: SIZES.small,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: SIZES.medium,
        color: COLORS.primary,
    },
});

export default Menu;
