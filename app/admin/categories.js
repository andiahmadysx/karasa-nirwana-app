import React, {useState} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainStyles, searchStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import {Center, Icon, SearchIcon} from "@gluestack-ui/themed";
import {Ionicons} from "@expo/vector-icons";
import ProductListAdmin from "../../components/admin/ProductListAdmin";

const ManageCategories = () => {
    const [products, setProducts] = useState(true);


    return (
        <SafeAreaView style={mainStyles.container}>
            {/*<View style={styles.buttonContainer}>*/}
            {/*    <TouchableOpacity*/}
            {/*        style={[*/}
            {/*            styles.button,*/}
            {/*            {*/}
            {/*                backgroundColor:    isProduct ? COLORS.primary : 'transparent',*/}
            {/*                borderColor:    isProduct ? 'transparent' : COLORS.primary,*/}
            {/*                borderTopLeftRadius: 100,*/}
            {/*                borderBottomLeftRadius: 100,*/}
            {/*            },*/}
            {/*        ]}*/}
            {/*        onPress={() => {*/}
            {/*           setIsProduct(true)*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Text*/}
            {/*            style={[*/}
            {/*                styles.buttonText,*/}
            {/*                {color:     isProduct ? 'white' : COLORS.primary},*/}
            {/*            ]}*/}
            {/*        >*/}
            {/*            Products*/}
            {/*        </Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*    <TouchableOpacity*/}
            {/*        style={[*/}
            {/*            styles.button,*/}
            {/*            {*/}
            {/*                backgroundColor: !isProduct ? COLORS.primary : 'transparent',*/}
            {/*                borderColor: !isProduct ? 'transparent' : COLORS.primary,*/}
            {/*                borderTopRightRadius: 100,*/}
            {/*                borderBottomRightRadius: 100,*/}
            {/*            },*/}
            {/*        ]}*/}
            {/*        onPress={() => setIsProduct(false)}*/}
            {/*    >*/}
            {/*        <Text*/}
            {/*            style={[*/}
            {/*                styles.buttonText,*/}
            {/*                {color: !isProduct ? 'white' : COLORS.primary},*/}
            {/*            ]}*/}
            {/*        >*/}
            {/*            Categories*/}
            {/*        </Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}


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
                        // value={searchTerm}
                        // onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            {
                products &&
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    style={{height: 'fit-content', flexGrow: 0}}
                    renderItem={({item}) => <ProductListAdmin item={item}/>}
                    data={[{
                        id: 'aldlfdslafd',
                        name: 'Pisang Keju',
                        image_url: 'https://bepharco.com/no-products-found.png'
                    },
                        {
                            id: 'aldlfdslfdsadafd',
                            name: 'Pisang Keju',
                            image_url: 'https://bepharco.com/no-products-found.png'
                        }

                    ]}
                    keyExtractor={(item) => item.id.toString()}
                />
            }

            {!products &&
                <Center style={{
                    flex: .8,
                }}>
                    <Image source={{uri: "https://bepharco.com/no-products-found.png"}} width={200} height={300}/>
                </Center>

            }


            {
                !products &&
                <TouchableOpacity
                    onPress={() => {
                        router.navigate(order.is_takeaway ? '/cashier/menu' : '/cashier/select_table');
                    }}
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: 100,
                        flex: 1,
                        position: "absolute",
                        bottom: 0,
                        margin: SIZES.small,
                        width: '100%',
                        alignSelf: 'center'

                    }}
                >
                    <Text style={mainStyles.footerText}>Add Products</Text>
                </TouchableOpacity>
            }


            {
                products &&
                <TouchableOpacity style={{
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: 100,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge
                }} onPress={() => {
                    setShowModal(true);
                }}>
                    <Ionicons name={'add-outline'} size={SIZES.xxLarge} color={'white'}/>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

export default ManageCategories;

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
