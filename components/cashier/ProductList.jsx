import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../constants";
import { AddIcon, Icon, RemoveIcon } from "@gluestack-ui/themed";
import { useOrder } from "../../hooks/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import debounce from 'lodash/debounce';

const ProductList = ({ item }) => {
    const { order, setOrder } = useOrder();
    const index = order.products.findIndex((p) => p.id === item.id);

    const handleAddProduct = useCallback(() => {
        setOrder((prevOrder) => {
            const existingProductIndex = prevOrder.products.findIndex(
                (p) => p.id === item.id
            );

            if (existingProductIndex !== -1) {
                // Product already exists, increase quantity
                const updatedProducts = [...prevOrder.products];
                updatedProducts[existingProductIndex].qty += 1;

                return {
                    ...prevOrder,
                    products: updatedProducts,
                };
            } else {
                // Product doesn't exist, add it to the order
                return {
                    ...prevOrder,
                    products: [
                        ...prevOrder.products,
                        {
                            id: item.id,
                            name: item.name,
                            qty: 1,
                            price: item.price,
                            image_url: item.image_url,
                        },
                    ],
                };
            }
        });
    }, [setOrder, item, order.products]);

    const handleDecreaseProduct = useCallback(() => {
        setOrder((prevOrder) => {
            const updatedProducts = [...prevOrder.products];

            if (updatedProducts[index]?.qty > 1) {
                // Decrease quantity if greater than 1
                updatedProducts[index].qty -= 1;
            } else {
                // Remove the product if quantity is 1
                updatedProducts.splice(index, 1);
            }

            return {
                ...prevOrder,
                products: updatedProducts,
            };
        });
    }, [setOrder, index, order.products]);

    const debouncedHandleAddProduct = debounce(handleAddProduct, 50);
    const debouncedHandleDecreaseProduct = debounce(handleDecreaseProduct, 50);

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
                        fontWeight: 600
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

export default React.memo(ProductList);
