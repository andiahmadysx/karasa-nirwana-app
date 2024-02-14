import React, { useMemo, useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { useOrder } from '../../hooks/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import debounce from "lodash/debounce";

const CardProduct = ({ item }) => {
    const { order, setOrder } = useOrder();
    const index = order.products.findIndex((p) => p.id === item.id);

    const handleAddProduct = useCallback(() => {

        if (item.stock < 1 || item.stock - order?.products[index]?.qty < 1) {
            alert('Product out of stock.')
            return;
        }

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
                            price: item.price,
                            qty: 1,
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
        <TouchableOpacity onPress={debouncedHandleAddProduct} style={styles.cardContainer}>
            <Image
                source={{ uri: item.image_url }}
                resizeMode={'cover'}
                style={{
                    width: '100%',
                    height: 140,
                    borderTopLeftRadius: SIZES.xxSmall,
                    borderTopRightRadius: SIZES.xxSmall,
                }}
            />

            <Text style={styles.productName}>{item.name}</Text>

            <View style={styles.priceAndStockContainer}>
                <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>

                <Text style={styles.stockText}>
                    x{item.stock - (order.products[index]?.qty || 0)}
                </Text>
            </View>

            {order?.products[index]?.qty > 0 && (
                <>
                    <View style={styles.qtyIndicator}>
                        <Text style={styles.qtyIndicatorText}>
                            {order?.products[index]?.qty}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={debouncedHandleDecreaseProduct}
                        style={styles.decreaseButton}
                    >
                        <Text style={styles.decreaseButtonText}>-</Text>
                    </TouchableOpacity>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = {
    cardContainer: {
        width: '100%',
        alignItems: 'start',
        borderRadius: SIZES.xxSmall,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
        paddingBottom: SIZES.small,
    },
    productName: {
        fontSize: SIZES.medium,
        fontWeight: 600,
        paddingLeft: SIZES.xxSmall,
        paddingTop: SIZES.xxSmall,
    },
    priceAndStockContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceText: {
        fontSize: SIZES.small,
        fontWeight: 'light',
        paddingLeft: SIZES.xxSmall,
        color: COLORS.darkGray,
        marginVertical: 4,
    },
    stockText: {
        fontSize: SIZES.small,
        fontWeight: 'light',
        paddingLeft: SIZES.xxSmall,
        color: COLORS.darkGray,
        marginVertical: 4,
        marginHorizontal: SIZES.small,
    },
    qtyIndicator: {
        position: 'absolute',
        left: SIZES.small,
        top: SIZES.small,
        backgroundColor: COLORS.bg,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.light,
        borderRadius: SIZES.small,
    },
    qtyIndicatorText: {
        fontWeight: 600,
        fontSize: SIZES.medium,
    },
    decreaseButton: {
        position: 'absolute',
        right: SIZES.small,
        top: SIZES.small,
        backgroundColor: COLORS.danger,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.light,
        borderRadius: SIZES.small,
    },
    decreaseButtonText: {
        color: COLORS.white,
        fontWeight: 600,
        fontSize: SIZES.medium,
    },
};

export default React.memo(CardProduct);

