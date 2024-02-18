import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../styles";
import React, {useEffect, useState} from "react";
import {COLORS, SIZES} from "../../constants";
import useCustomQuery, {useGet, useUpdate} from "../../hooks/Fetch";
import usePusher from "../../hooks/Pusher";
import TableCustom from "../../components/common/TableCustom";
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
import {initializeNotifications, useNotification} from "../../hooks/Notification";
import {FlashList} from "@shopify/flash-list";
import {useAuth} from "../../hooks/Auth";
import {ColumnItem} from "../../components/common/ColumnItem";
import NoDataFound from "../../components/common/NoDataFound";

const ChefDashboard = () => {
    const [activeCategory, setCategory] = useState('Not Yet Cooked');
    const [showModal, setShowModal] = useState(false);
    const [showModalTable, setShowModalTable] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});

    const getOrderPlaced = useGet('/transactions/order-placed');
    const getCookingInProgress = useGet('/transactions/cooking-in-progress');
    const getReadyToServe = useGet('/transactions/ready-to-serve');
    const updateTransaction = useUpdate('/transactions');
    const {user} = useAuth();
    const {schedulePushNotification} = useNotification();

    const toast = useToast();

    const {
        data: orderPlacedData,
        refetch: refetchOrderPlaced
    } = useCustomQuery('orderPlacedAll', getOrderPlaced);
    const {
        data: cookingInProgressData,
        refetch: refetchCookingInProgress
    } = useCustomQuery('cookingInProgressAll', getCookingInProgress);
    const {
        data: readyToServeData,
        refetch: refetchReadyToServe
    } = useCustomQuery('readyToServeAll', getReadyToServe);

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


    useEffect(() => {
        initializeNotifications();
    }, []);


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
            <FlashList
                estimatedItemSize={200}
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
            activeCategory === 'Not Yet Cooked' &&
            <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                       data={orderPlaced}
                       numColumns={2}
                       estimatedItemSize={80}
                       showsVerticalScrollIndicator={false}
                       renderItem={({item, index}) => (
                           <ColumnItem numColumns={2} index={index}>
                               <TableCustom item={item} handlePress={() => {
                                   setSelectedTransaction(item);
                                   setShowModalTable(true);
                               }}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                           </ColumnItem>
                       )}
            />
        }


        {
            activeCategory === 'Cooking' && <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                                                       data={cookingInProgress}
                                                       numColumns={2}
                                                       estimatedItemSize={80}
                                                       showsVerticalScrollIndicator={false}
                                                       renderItem={({item, index}) => (
                                                           <ColumnItem numColumns={2} index={index}>
                                                               <TableCustom item={item} handlePress={() => {
                                                                   setSelectedTransaction(item);
                                                                   setShowModalTable(true);
                                                               }}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                                                           </ColumnItem>
                                                       )}
            />

        }

        {activeCategory === 'Ready to Serve' && <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                                                           data={readyToServe}
                                                           numColumns={2}
                                                           estimatedItemSize={80}
                                                           showsVerticalScrollIndicator={false}
                                                           renderItem={({item, index}) => (
                                                               <ColumnItem numColumns={2} index={index}>
                                                                   <TableCustom item={item} handlePress={() => {
                                                                       setSelectedTransaction(item);
                                                                       setShowModalTable(true);
                                                                   }}>{item.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
                                                               </ColumnItem>
                                                           )}
        />
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
                        <Text size="md">

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

                        <View style={{
                            marginTop: SIZES.light,
                            paddingHorizontal: SIZES.light - 2,
                            marginBottom: SIZES.small
                        }}>
                            <Text>Notes : {selectedTransaction?.notes}</Text>
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
                            size="md"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModalTable(false)
                            }}
                            style={{
                                borderRadius: SIZES.small
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="md"
                            action="primary"
                            borderWidth="$0"
                            style={{
                                borderRadius: SIZES.small
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
            borderRadius: SIZES.small,
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
