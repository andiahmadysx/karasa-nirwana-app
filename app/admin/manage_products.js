import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {mainStyles, searchStyles} from '../../styles';
import {COLORS, SIZES} from '../../constants';
import {Center, Icon, SearchIcon} from '@gluestack-ui/themed';
import {Ionicons} from '@expo/vector-icons';
import ProductListAdmin from '../../components/admin/ProductListAdmin';
import {useRouter} from 'expo-router';
import useCustomQuery, {useGet} from '../../hooks/Fetch';
import {FlashList} from '@shopify/flash-list';
import debounce from 'lodash/debounce';
import NoDataFound from "../../components/common/NoDataFound";

const ManageProducts = () => {
    const router = useRouter();
    const {
        data: productsData,
        refetch: refetchProducts,
    } = useCustomQuery('products', useGet('/products'));

    const [searchTerm, setSearchTerm] = useState('');
    const products = useMemo(() => productsData?.products || [], [productsData]);

    const handleEdit = useCallback(
        debounce((id) => {
            router.navigate('/admin/products/' + id);
        }, []),
        []
    );

    useEffect(() => {
        refetchProducts();
    }, []);


    const handleAdd = debounce(
        useCallback(() => {
            router.navigate('/admin/products/create');
        }, []),
        100
    );

    const filteredProducts = useMemo(
        () =>
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [products, searchTerm]
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
                        placeholder={'Search products...'}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

                <FlashList ListEmptyComponent={() => <NoDataFound/>}
                           numColumns={1}
                           horizontal={false}
                           estimatedItemSize={80}
                           showsVerticalScrollIndicator={false}
                           style={{height: 'fit-content', flexGrow: 0}}
                           renderItem={({item}) => (
                               <ProductListAdmin
                                   handlePress={() => handleEdit(item.id)}
                                   item={item}
                               />
                           )}
                           data={filteredProducts}
                           keyExtractor={(item) => item.id.toString()}
                />

            {!filteredProducts.length && (
                <TouchableOpacity
                    onPress={handleAdd}
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
                    <Text style={mainStyles.footerText}>Add Products</Text>
                </TouchableOpacity>
            )}

            {filteredProducts.length > 0 && (
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
                    <Ionicons name={'add-outline'} size={SIZES.xxLarge} color={'white'}/>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default ManageProducts;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
});
