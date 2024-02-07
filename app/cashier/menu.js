import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import {COLORS, icons, SIZES} from '../../constants';
import {mainStyles, searchStyles} from '../../styles';
import {Icon, SearchIcon} from '@gluestack-ui/themed';
import CardProduct from '../../components/cashier/CardProduct';
import {useFetch, useGet} from '../../hooks/Fetch';
import {useOrder} from "../../hooks/Order";
import usePusher from "../../hooks/Pusher";

const Menu = () => {
    const router = useRouter();
    const [activeCategory, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [categories, setCategories] = useState();
    const [products, setProducts] = useState({});
    const getProducts = useGet('/products');
    const getCategories = useGet('/categories');
    const {order, reset} = useOrder();

    useEffect(() => {
        if (order?.is_takeaway) {
            reset();
        }
        useFetch(getProducts, (data) => {
            setProducts(data.products);
        });

        useFetch(getCategories, (data) => {
            setCategories(data.categories);
        })
    }, []);

    usePusher('product-channel', 'App\\Events\\ProductCreated', (response) => {
       setProducts((prevState) => ([...prevState, response.data]))
    });


    const filteredProducts = useMemo(() => {
        return (Array.isArray(products) ? products : []).filter(
            (product) =>
                (activeCategory === 'All' || product.category === activeCategory) &&
                (searchQuery === '' ||
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [products, activeCategory, searchQuery]);


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

            <View
                style={[
                    searchStyles.searchContainer,
                    {marginBottom: SIZES.xxLarge},
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
                            onPress={() => setCategory(item)}
                        >
                            <Text style={mainStyles.tabText(activeCategory, item)}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item?.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <FlatList
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'start',
                    marginVertical: 8,
                }}
                style={{
                    marginBottom: 55,
                }}
                renderItem={({item}) => {
                    return <CardProduct item={item}/>;
                }}
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() =>
                        router.navigate({
                            pathname: order?.is_takeaway ? '/cashier' : '/cashier/select_table',
                        })
                    }
                    style={styles.cancelButton}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/cashier/confirm',
                        })
                    }
                    style={styles.nextButton}
                >
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
        color: COLORS.primary,
    },
});

export default Menu;
