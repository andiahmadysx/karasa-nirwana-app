import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Center, Divider} from '@gluestack-ui/themed';
import {useFetch, useGet} from '../../../hooks/Fetch';
import {formatCurrency} from '../../../utils/formatCurrency';
import RNPrint from 'react-native-print';
import {useLocalSearchParams} from "expo-router";
import {COLORS, FONT, images, SIZES} from "../../../constants";
import {mainStyles} from "../../../styles";
import {formatDate} from "../../../utils/formatDate";

const Id = () => {
    const {id} = useLocalSearchParams();

    const getTransactionDetails = useGet('/transactions/' + id);
    const [transactionDetails, setTransactionDetails] = useState();

    useEffect(() => {
        useFetch(getTransactionDetails, (data) => {
            setTransactionDetails(data.transaction);
        })
    }, []);

    const handlePrint = async () => {
        try {
            await RNPrint.print({
                printerURL: 'your_printer_url', // Replace with your printer's URL
                html: generatePrintContent(),
            });

        } catch (error) {
            console.error('Error printing:', error);
        }
    };

    const generatePrintContent = () => {

    };


    if (!transactionDetails) {
        return <Text>Loading</Text>
    }

    return (
        <SafeAreaView style={{
            padding: SIZES.xLarge,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: COLORS.bg,
            fontFamily: FONT.medium,
        }}>
            <Center style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: -16,
                backgroundColor: COLORS.white,
                padding: SIZES.medium,
                marginBottom: 60,
                borderRadius: SIZES.xxSmall,
                paddingBottom: SIZES.medium,
                shadowColor: "rgba(0,0,0,0.25)",
                shadowOffset: {
                    width: 2,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 2,
            }}>

                <Image source={images.logo} resizeMode={'contain'} style={{
                    width: 180,
                    height: 120,
                    alignSelf: 'center',
                    zIndex: -1
                }}/>

                <Text style={{
                    fontWeight: 'light',
                    color: COLORS.darkGray,
                    zIndex: 1,
                    marginTop: -SIZES.light + 2,
                    marginBottom: SIZES.small
                }}>{formatDate(transactionDetails?.created_at)}</Text>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: SIZES.light,
                    paddingHorizontal: SIZES.light - 2
                }}>

                    <Text style={{
                        fontSize: SIZES.large,
                        fontWeight: 600
                    }}>Total Payment</Text>
                    <Text style={{
                        fontSize: SIZES.large,
                        fontWeight: 600
                    }}>{formatCurrency(transactionDetails?.total_price)}</Text>

                </View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginTop: 18,
                }}>
                    {!transactionDetails?.is_takeaway ?
                        <Text style={{
                            color: COLORS.darkGray
                        }}>Table : {transactionDetails?.table?.name}</Text>
                        :
                        <Text style={{
                            color: COLORS.darkGray
                        }}>Customer Name : {transactionDetails?.customer_name}</Text>
                    }
                </View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginTop: SIZES.light,


                }}>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>Cashier : {transactionDetails?.user?.name}</Text>
                </View>

                <Divider my={'$4'} bg={'$secondary100'}/>


                {/* LIST PRODUK */}
                <ScrollView
                    style={{maxHeight: 200, flexGrow: 0, paddingHorizontal: SIZES.small}}>
                    {transactionDetails?.items?.map((item, index) => (
                        <View key={index}
                              style={{
                                  flexDirection: 'row',
                                  width: '100%',
                                  justifyContent: 'space-between',
                                  marginBottom: SIZES.light
                              }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                maxWidth: 100,
                                minWidth: 100,
                                color: COLORS.darkGray
                            }}>{item.product?.name || 'Product Name'}</Text>
                            <Text style={{
                                color: COLORS.darkGray
                            }}>{item.qty}</Text>
                            <Text style={{
                                color: COLORS.darkGray
                            }}>{formatCurrency(item.sub_total)}</Text>
                        </View>
                    ))}
                </ScrollView>
                <Divider my={'$4'} bg={'$secondary100'}/>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small

                }}>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>Amount Paid</Text>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>{formatCurrency(transactionDetails?.payment_amount)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginTop: SIZES.light,
                    paddingHorizontal: SIZES.small

                }}>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>Change</Text>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>{formatCurrency(transactionDetails?.change_amount)}</Text>
                </View>

                <View style={{
                    borderColor: "#B0B0B0",
                    borderBottomWidth: 1,
                    borderStyle: 'dashed',
                    width: '100%',
                    marginVertical: SIZES.medium
                }}></View>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    paddingBottom: SIZES.medium
                }}>
                    <Text style={{
                        color: COLORS.darkGray,
                        textAlign: 'center'
                    }}>Jl. Arief Rahman Hakim No.35, Cigadung, Kec. Subang, Kabupaten Subang, Jawa Barat 41213</Text>
                </View>
            </Center>
            <View style={[mainStyles.footerContainer]}>
                <TouchableOpacity onPress={handlePrint} style={{
                    padding: SIZES.medium,
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.small,
                    flex: 1
                }}>
                    <Text style={mainStyles.footerText}>PRINT</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
};

export default Id;
