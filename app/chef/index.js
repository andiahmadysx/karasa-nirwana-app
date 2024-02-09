import {FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../styles";
import React, {useEffect, useState} from "react";
import {COLORS, SIZES} from "../../constants";
import useCustomQuery, {useFetch, useGet, useUpdate} from "../../hooks/Fetch";
import usePusher from "../../hooks/Pusher";
import TableCustom from "../../components/common/TableCustom";
import NoDataFound from "../../components/common/NoDataFound";
import {Ionicons} from "@expo/vector-icons";
import Logout from "../../components/common/Logout";
import {
    Button,
    ButtonText,
    Center,
    CloseIcon,
    Heading,
    Icon,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Toast,
    ToastTitle,
    useToast,
    VStack
} from "@gluestack-ui/themed";
import {useRouter} from "expo-router";
import {useRoute} from "@react-navigation/native";
import {useNotification} from "../../hooks/Notification";

const ChefDashboard = () => {
    const [activeCategory, setCategory] = useState('Not Yet Cooked');
    const [showModal, setShowModal] = useState(false);
    const [showModalTable, setShowModalTable] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});

    const getOrderPlaced = useGet('/transactions/order-placed');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress');
    const getReadyToServe = useGet('/transactions/ready-to-serve');
    const updateTransaction = useUpdate('/transactions');
    const { schedulePushNotification } = useNotification();

    const toast = useToast();

    const { data: orderPlacedData, error: orderPlacedError, isLoading: orderPlacedLoading, refetch: refetchOrderPlaced } = useCustomQuery('orderPlaced', getOrderPlaced);
    const { data: cookingInProgressData, error: cookingInProgressError, isLoading: cookingInProgressLoading, refetch: refetchCookingInProgress } = useCustomQuery('cookingInProgress', getCookingInProgress);
    const { data: readyToServeData, error: readyToServeError, isLoading: readyToServeLoading, refetch: refetchReadyToServe } = useCustomQuery('readyToServe', getReadyToServe);

    const orderPlaced = orderPlacedData?.transactions || [];
    const cookingInProgress = cookingInProgressData?.transactions || [];
    const readyToServe = readyToServeData?.transactions || [];



    usePusher('cooking-in-progress-channel', 'App\\Events\\SetCookingInProgressEvent', (response) => {
        refetchCookingInProgress();
    });

    usePusher('ready-to-serve-transactions-channel', 'App\\Events\\SetReadyToServeEvent', (response) => {
        refetchReadyToServe();
    });

    usePusher('transaction-channel', 'App\\Events\\CreateTransactionEvent', (response) => {
        refetchOrderPlaced();
        schedulePushNotification('New Order to Cook', 'A new order has been placed!');
    });


    const handleUpdateTransactions = async (value = {status: "cooking_in_progress"}) => {
        const response = await updateTransaction(selectedTransaction?.id, value);
        if (response.success) {


            // fetch all
            refetchOrderPlaced();
            refetchReadyToServe();
            refetchCookingInProgress();

            toast.show({
                placement: "bottom",
                duration: 3000,
                render: ({id}) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast bg="$success500" nativeID={toastId} p="$6" style={{
                            marginBottom: SIZES.xxLarge + 50
                        }}>
                            <VStack space="xs" style={{
                                width: '90%'
                            }}>
                                <ToastTitle color="$textLight50">
                                    Update order success!
                                </ToastTitle>
                            </VStack>
                        </Toast>
                    )
                },
            });
        }
    }


    return <SafeAreaView style={[mainStyles.container, {}]}>
        <View style={mainStyles.tabsContainer}>
            <FlatList
                data={['Not Yet Cooked', 'Cooking', 'Ready to Serve']}
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
                keyExtractor={(item) => item}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>

        {
            activeCategory === 'Not Yet Cooked' && <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {orderPlaced?.length > 0 ? (
                        orderPlaced.map((item, index) => (
                            <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom item={item} handlePress={() => {
                                    setSelectedTransaction(item);
                                    setShowModalTable(true);
                                }}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            </ScrollView>
        }

        {
            activeCategory === 'Cooking' && <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {cookingInProgress?.length > 0 ? (
                        cookingInProgress.map((item, index) => (
                            <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom item={item} handlePress={() => {
                                    setSelectedTransaction(item);
                                    setShowModalTable(true);
                                }}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            </ScrollView>
        }

        {activeCategory === 'Ready to Serve' &&
           <ScrollView showsVerticalScrollIndicator={false}>
               <View style={{
                   flexDirection: 'row',
                   flexWrap: 'wrap',
                   marginTop: SIZES.small,
                   justifyContent: 'space-between'
               }}>
                   {readyToServe?.length > 0 ? (
                       readyToServe.map((item, index) => (
                           <View key={index} style={{flexBasis: '46%', margin: SIZES.light}}>
                               <TableCustom
                                   item={item}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                           </View>
                       ))
                   ) : (
                       <NoDataFound/>
                   )}
               </View>
           </ScrollView>
        }

        {/* MODAL SELECT TABLE*/}
        <Center h={400} style={{
            position: 'absolute'
        }}>
            <Modal
                isOpen={showModalTable}
                onClose={() => {
                    setShowModalTable(false)
                }}
                size={'md'}
            >
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Confirm Cooking Order</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text size="sm">

                            {selectedTransaction?.status === 'order_placed' ? "Are you sure you want to cook this order? Please review the details carefully before confirming." : "Have you completed cooking this order? Please confirm to ensure a seamless dining experience for our customers."}

                        </Text>

                        <View style={{
                            marginTop: SIZES.small
                        }}>
                            {selectedTransaction?.is_takeaway ? <Text> Customer Name : <Text style={{
                                fontWeight: 600
                            }}> {selectedTransaction?.customer_name}</Text> </Text> : <Text> Table : <Text style={{
                                fontWeight: 600
                            }}> {selectedTransaction?.table?.name}</Text> </Text>}

                        </View>

                        <Text style={{
                            marginBottom: SIZES.small,
                            marginTop: SIZES.light,
                            marginHorizontal: 2
                        }}>
                            Orders :
                        </Text>

                        <ScrollView style={{
                            maxHeight: 200
                        }} showsVerticalScrollIndicator={false}>
                            {selectedTransaction && selectedTransaction?.items?.map((item) => {
                                return <View key={item.id} style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    justifyContent: 'space-between',
                                    paddingHorizontal: SIZES.medium,
                                    paddingBottom: 2
                                }}>
                                    <Text>- {item?.product?.name}</Text>
                                    <Text>x{item?.qty}</Text>
                                </View>
                            })}


                        </ScrollView>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModalTable(false)
                            }}
                            style={{
                                borderRadius: 100
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="primary"
                            borderWidth="$0"
                            style={{
                                borderRadius: 100
                            }}
                            onPress={() => {
                                setShowModalTable(false)
                                if (selectedTransaction?.status === 'order_placed') {
                                    handleUpdateTransactions();
                                }

                                if (selectedTransaction?.status === 'cooking_in_progress') {
                                    handleUpdateTransactions({status: "ready_to_serve"});
                                }
                            }}
                            bg="$success500"
                            $hover-bg="$success800"
                            $active-bg="$success900"
                        >
                            <ButtonText>Confirm</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>

        {/* MODAL LOGOUT */}
        <Logout setShowModal={setShowModal} showModal={showModal}/>

        <TouchableOpacity style={{
            paddingHorizontal: SIZES.small + 4,
            paddingVertical: SIZES.small - 1,
            backgroundColor: COLORS.primary,
            borderRadius: 100,
            position: 'absolute',
            right: SIZES.xLarge + 4,
            bottom: SIZES.xxLarge
        }} onPress={() => {
            setShowModal(true);
        }}>
            <Ionicons name={'log-out-outline'} style={{
                marginRight: -SIZES.light
            }} size={SIZES.xxLarge} color={'white'}/>
        </TouchableOpacity>
    </SafeAreaView>
}


export default ChefDashboard;
