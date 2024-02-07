import React from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../constants";
import { AddIcon, Icon, RemoveIcon } from "@gluestack-ui/themed";
import { useOrder } from "../../hooks/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import debounce from 'lodash/debounce';

const ProductList = ({ item }) => {
    const { order, setOrder } = useOrder();
    const index = order.products.findIndex((p) => p.id === item.id);

    const debouncedHandleAddProduct = debounce(handleAddProduct, 300);
    const debouncedHandleDecreaseProduct = debounce(handleDecreaseProduct, 300);

    function handleAddProduct() {
        if (index === -1) {
            setOrder((prevState) => ({
                ...prevState,
                products: [...prevState.products, {
                    id: item.id,
                    name: item.name,
                    qty: 1,
                    price: item.price,
                    image_url: item.image_url
                }],
            }));
        } else {
            setOrder((prevOrder) => {
                const updatedProducts = [...prevOrder.products];
                updatedProducts[index].qty += 1;
                return {
                    ...prevOrder,
                    products: updatedProducts,
                };
            });
        }
    }

    function handleDecreaseProduct() {
        const qty = order?.products[index]?.qty;

        if (qty > 1) {
            setOrder((prevOrder) => {
                const updatedProducts = [...prevOrder.products];
                updatedProducts[index].qty -= 1;
                return {
                    ...prevOrder,
                    products: updatedProducts,
                };
            });
        } else {
            setOrder((prevOrder) => {
                const updatedProducts = [...prevOrder.products];
                updatedProducts.splice(index, 1);
                return {
                    ...prevOrder,
                    products: updatedProducts,
                };
            });
        }
    }

    return (
        <View style={{
            flexDirection: "row", gap: SIZES.small, justifyContent: "space-between", marginTop: SIZES.small
        }}>
            <View style={{
                flexDirection: "row", gap: SIZES.small
            }}>
                <Image
                    source={{ uri: item.image_url }}
                    resizeMode={'cover'}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: SIZES.small
                    }} />

                <View style={{
                    gap: SIZES.light,
                    paddingTop: SIZES.light
                }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                        maxWidth: 190,
                        minWidth: 100,
                        fontSize: SIZES.medium,
                        fontWeight: 'bold'
                    }}>{item?.name}</Text>

                    <Text style={{
                        fontSize: SIZES.small,
                    }}>{formatCurrency(order?.products[index]?.price * order?.products[index]?.qty)}</Text>
                </View>
            </View>

            <View style={{
                alignItems: "center",
                justifyContent: 'center',
                flexDirection: "row",
                gap: SIZES.medium
            }}>
                <TouchableOpacity onPress={debouncedHandleDecreaseProduct}>
                    <Icon as={RemoveIcon} w="$5" h="$5" />
                </TouchableOpacity>

                <Text style={{
                    fontSize: SIZES.medium
                }}>{item?.qty}</Text>

                <TouchableOpacity onPress={debouncedHandleAddProduct}>
                    <Icon as={AddIcon} w="$5" h="$5" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductList;
