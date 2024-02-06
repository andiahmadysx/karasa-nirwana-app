import React from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {COLORS, SIZES} from "../../constants";
import {useOrder} from "../../hooks/Order";
import {formatCurrency} from "../../utils/formatCurrency";

const CardProduct = ({item}) => {
    const {order, setOrder} = useOrder();
    const index = order.products.findIndex((p) => p.id === item.id);



    const handleAddProduct = () => {
        if (index === -1) {
            setOrder((prevState) => ({
                ...prevState,
                products: [...prevState.products, {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty: 1,
                    image_url: item.image_url
                }],
            }));
        } else {
            const old = {...order};
            old.products[index].qty += 1;
            setOrder(old)
        }
    }

    const handleDecreaseProduct = () => {
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
    };

    return (
        <TouchableOpacity onPress={handleAddProduct} style={{
            width: '45%',
            alignItems: 'start',
            borderRadius: SIZES.xxSmall,
            marginHorizontal: 8,
            backgroundColor: "#fff",
            shadowColor: "rgba(0,0,0,0.28)",
            shadowOffset: {
                width: 2,
                height: 2,
            },
            shadowOpacity: 0.10,
            shadowRadius: 3.84,
            elevation: 2,
            paddingBottom: SIZES.small

        }}>
            <Image
                source={{uri: item.image_url}}
                resizeMode={'cover'}
                style={{
                    width: "100%",
                    height: 140,
                    borderTopLeftRadius: SIZES.xxSmall,
                    borderTopRightRadius: SIZES.xxSmall
                }}/>

            <Text
                style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'bold',
                    paddingLeft: SIZES.xxSmall,
                    paddingTop: SIZES.xxSmall,
                }}
            >
                {item.name}
            </Text>

            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <Text
                    style={{
                        fontSize: SIZES.small,
                        fontWeight: 'light',
                        paddingLeft: SIZES.xxSmall,
                        color: COLORS.darkGray,
                        marginVertical: 4
                    }}
                >
                    {formatCurrency(item.price)}
                </Text>


                <Text
                    style={{
                        fontSize: SIZES.small,
                        fontWeight: 'light',
                        paddingLeft: SIZES.xxSmall,
                        color: COLORS.darkGray,
                        marginVertical: 4,
                        marginHorizontal: SIZES.small
                    }}>
                    x{item.stock - (order.products[index]?.qty || 0)}
                </Text>
            </View>


            {order?.products[index]?.qty > 0 &&
            <>
                {/*  Product count  */}
                <View style={{
                    position: "absolute",
                    left: SIZES.small,
                    top: SIZES.small,
                    backgroundColor: COLORS.bg,
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.light,
                    borderRadius: SIZES.light

                }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: SIZES.medium
                    }}>{order?.products[index]?.qty}</Text>
                </View>

                {/* minus icon */}
                <TouchableOpacity onPress={handleDecreaseProduct} style={{
                    position: "absolute",
                    right: SIZES.small,
                    top: SIZES.small,
                    backgroundColor: COLORS.danger,
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.light,
                    borderRadius: SIZES.light

                }}>
                    <Text style={{
                        color: COLORS.white,
                        fontWeight: "bold",
                        fontSize: SIZES.medium
                    }}>-</Text>
                </TouchableOpacity>
            </>
            }
        </TouchableOpacity>
    );
};

export default CardProduct;
