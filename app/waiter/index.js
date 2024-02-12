import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../styles";
import React, {useEffect, useState} from "react";
import {COLORS, SIZES} from "../../constants";
import {useFetch, useGet, useUpdate} from "../../hooks/Fetch";
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
import {useNotification} from "../../hooks/Notification";
import {FlashList} from "@shopify/flash-list";
import {router, useFocusEffect} from "expo-router";
import {useAuth} from "../../hooks/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WaiterDashboard = () => {
    const [activeCategory, setCategory] = useState('Ready to Serve');
    const [served, setServed] = useState([]);
    const [readyToServe, setReadyToServe] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalTable, setShowModalTable] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});

    const getServed = useGet('/transactions/served?is_takeaway=0');
    const getReadyToServe = useGet('/transactions/ready-to-serve');
    const updateTransaction = useUpdate('/transactions');
    const {user} = useAuth();

    const {schedulePushNotification} = useNotification();

    const toast = useToast();

    usePusher('ready-to-serve-transaction-channel', 'App\\Events\\SetReadyToServeEvent', (response) => {
        setReadyToServe((prevState) => ([...prevState, response.data]));
        schedulePushNotification('New Order Ready', 'A new order is ready to be served!');
    });

    usePusher('served-transaction-channel', 'App\\Events\\SetServedEvent', (response) => {
        setServed((prevState) => ([...prevState, response.data]))
    });

    const fetch = () => {
        useFetch(getReadyToServe, (data) => {
            setReadyToServe(data?.transactions);
        })

        useFetch(getServed, (data) => {
            setServed(data?.transactions);
        })
    }
    useFocusEffect(() => {
        async function fetchData() {
            const response = await AsyncStorage.getItem('@user');
            const userOnStorage = JSON.parse(response);
            if (userOnStorage?.role !== 'waiter') {
                router.navigate('/' + userOnStorage?.role);
            }
        }

        if (!user) {
            fetchData();
        } else {
            if (user.role !== 'waiter') {
                router.navigate('/' + user.role);
            }
        }
    })


    useEffect(() => {
        fetch();
    }, []);

    const handleUpdateTransactions = async (value = {status: "served"}) => {
        const response = await updateTransaction(selectedTransaction?.id, value);
        if (response.success) {
            fetch();

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


    return <SafeAreaView style={mainStyles.container}>
        <View style={mainStyles.tabsContainer}>
            <FlashList
                estimatedItemSize={80}
                data={['Ready to Serve', 'Served']}
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
            activeCategory === 'Served' && <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between'
                }}>
                    {served?.length > 0 ? (
                        served.map((item, index) => (
                            <View key={item.id} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom item={item} handlePress={() => {
                                    setSelectedTransaction(item);
                                    setShowModalTable(true);
                                }}>{item?.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
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
                            <View key={item.id} style={{flexBasis: '46%', margin: SIZES.light}}>
                                <TableCustom handlePress={() => {
                                    setSelectedTransaction(item);
                                    setShowModalTable(true);
                                }}
                                             item={item}>{item?.is_takeaway ? item?.customer_name : item?.table?.name}</TableCustom>
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
                        <Heading
                            size="full">{selectedTransaction?.status === 'ready_to_serve' ? "Confirm Serve Order" : 'Confirm Table Clearance'}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text size="sm">
                            {selectedTransaction?.status === 'ready_to_serve' ? "Have you completed serving this order? Please confirm to ensure a seamless dining experience for our customers." : "Have you successfully cleared the table for this order? Kindly confirm to ensure a clean and welcoming dining environment for our valued customers."}
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
                                borderRadius: SIZES.small
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="primary"
                            borderWidth="$0"
                            style={{
                                borderRadius: SIZES.small
                            }}
                            onPress={() => {
                                setShowModalTable(false)
                                if (selectedTransaction?.status === 'ready_to_serve') {
                                    handleUpdateTransactions();
                                }

                                if (selectedTransaction?.status === 'served') {
                                    handleUpdateTransactions({status: "completed"});
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


export default WaiterDashboard;
