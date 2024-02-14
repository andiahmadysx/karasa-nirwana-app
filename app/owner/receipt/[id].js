import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Center, Divider} from '@gluestack-ui/themed';
import {useFetch, useGet} from '../../../hooks/Fetch';
import {formatCurrency} from '../../../utils/formatCurrency';
import {router, useLocalSearchParams} from "expo-router";
import {COLORS, FONT, images, SIZES} from "../../../constants";
import {mainStyles} from "../../../styles";
import {formatDate} from "../../../utils/formatDate";
import ModalSetting from "../../../components/common/ModalSetting";
import {generateReceipt} from "../../../utils/generateReceipt";
import {Ionicons} from "@expo/vector-icons";

const Id = () => {
    const {id} = useLocalSearchParams();
    const [showModal, setShowModal] = useState(false);

    const getTransactionDetails = useGet('/transactions/' + id);
    const [transactionDetails, setTransactionDetails] = useState();

    useEffect(() => {
        useFetch(getTransactionDetails, (data) => {
            setTransactionDetails(data.transaction);
        })
    }, []);

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
                    zIndex: -1,
                    marginBottom: 50
                }}/>


                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,


                }}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            color: COLORS.darkGray,
                            width: 66
                        }}>Date </Text>
                        <Text style={{
                            color: COLORS.darkGray,
                        }}> : {formatDate(transactionDetails?.created_at)}</Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginTop: SIZES.light,

                }}>
                    {!transactionDetails?.is_takeaway ?
                        <View style={{
                            flex: 1,
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                color: COLORS.darkGray,
                                width: 66
                            }}>Table </Text>
                            <Text style={{
                                color: COLORS.darkGray,
                            }}> : {transactionDetails?.table?.name}</Text>
                        </View>
                        :
                        <View style={{
                            flex: 1,
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                color: COLORS.darkGray,
                                width: 66
                            }}>Customer </Text>
                            <Text style={{
                                color: COLORS.darkGray,
                            }}> : {transactionDetails?.customer_name}</Text>
                        </View>
                    }
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginTop: SIZES.light,


                }}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            color: COLORS.darkGray,
                            width: 66
                        }}>Type </Text>
                        <Text style={{
                            color: COLORS.darkGray,
                        }}> : {transactionDetails?.is_takeaway ? 'Takeaway' : 'Dine-in'}</Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginTop: SIZES.light,


                }}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            color: COLORS.darkGray,
                            width: 66
                        }}>Cashier </Text>
                        <Text style={{
                            color: COLORS.darkGray,
                        }}> : {transactionDetails?.user?.name}</Text>
                    </View>
                </View>

                <Divider my={'$4'} bg={'$secondary100'}/>

                {/* LIST PRODUK */}
                <ScrollView
                    style={{maxHeight: 200, flexGrow: 0, paddingHorizontal: SIZES.small}}>
                    {transactionDetails?.items?.map((item, index) => (
                        <View key={item.id}
                              style={{
                                  flexDirection: 'row',
                                  width: '100%',
                                  justifyContent: 'space-between',
                                  marginBottom: SIZES.light
                              }}>
                            <Text style={{
                                color: COLORS.darkGray,
                            }}>{item.qty}</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                maxWidth: 160,
                                minWidth: 160,
                                color: COLORS.darkGray,
                            }}>{item.product?.name || 'Product Name'}</Text>
                            <Text style={{
                                color: COLORS.darkGray,
                                alignSelf: 'flex-end',
                                textAlign: 'right',
                                maxWidth: 160,
                                minWidth: 160,
                            }}>{formatCurrency(item.sub_total)}</Text>
                        </View>
                    ))}
                </ScrollView>
                <Divider my={'$4'} bg={'$secondary100'}/>

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.small,
                    marginBottom: SIZES.light
                }}>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>Total Payment</Text>
                    <Text style={{
                        color: COLORS.darkGray
                    }}>{formatCurrency(transactionDetails?.total_price)}</Text>
                </View>
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
            <View style={mainStyles.footerContainer}>
                <TouchableOpacity
                    onPress={async () => {
                        generateReceipt(transactionDetails);
                        // router.navigate('/cashier')
                    }}
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.small,
                        flex: 1
                    }}
                >
                    <Text style={mainStyles.footerText}>PRINT</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setShowModal(true)
                }} style={{
                    paddingHorizontal: SIZES.small + 4,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.small,
                }}>
                    <Ionicons name={'cog-outline'} style={{}} size={SIZES.xxLarge} color={'white'}/>
                </TouchableOpacity>
            </View>

            <ModalSetting showModal={showModal} setShowModal={setShowModal}/>


        </SafeAreaView>
    );
};

export default Id;
