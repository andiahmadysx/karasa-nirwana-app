import React, {useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    Button,
    ButtonText,
    Center,
    CloseIcon,
    Heading,
    Icon,
    Input,
    InputField,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    TextareaInput,
} from '@gluestack-ui/themed';
import {useOrder} from '../../hooks/Order';
import ProductList from '../../components/cashier/ProductList';
import {useRouter} from 'expo-router';
import {formatCurrency} from '../../utils/formatCurrency';
import {usePost} from '../../hooks/Fetch';
import {COLORS, SIZES} from "../../constants";
import {mainStyles} from "../../styles";

const Confirm = () => {
    const {order, setOrder} = useOrder();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);
    const [notes, setNotes] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);

    const postCreateTransactions = usePost('/transactions');

    // Calculate total price
    const calculateTotalPrice = () => {
        return order.products.reduce((total, product) => total + product.price * product.qty, 0);
    };

    // Update payment_amount in order state
    const handlePaymentAmountChange = (amount) => {
        const parsedAmount = parseInt(amount) || 0;
        const totalOrderPrice = calculateTotalPrice();
        const changeAmount = parsedAmount - totalOrderPrice;

        setPaymentAmount(parsedAmount);

        setOrder((prevOrder) => ({
            ...prevOrder,
            payment_amount: parsedAmount,
            total_price: totalOrderPrice,
            change_amount: changeAmount > 0 ? changeAmount : 0,
        }));
    };

    const handleCreateTransactions = async () => {
        const transactionsResponse = await postCreateTransactions(order);

        if (transactionsResponse.success) {
            setOrder((prevState) => ({...prevState, id: transactionsResponse.data.transaction.id}));
        } else {
            console.log(transactionsResponse);
        }
    };

    return (<SafeAreaView style={mainStyles.container}>
        <FlatList
            numColumns={1}
            horizontal={false}
            style={{
                height: 'fit-content', flexGrow: 0, maxHeight: 350,
            }}
            renderItem={({item}) => {
                return <ProductList item={item}/>;
            }}
            data={order?.products}
            keyExtractor={(item) => item.id.toString()}
        />

        <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Text
                style={{
                    fontSize: SIZES.medium, fontWeight: 'light', marginVertical: SIZES.medium, color: COLORS.gray,
                }}
            >
                {' '}
                Total : {formatCurrency(calculateTotalPrice())}
            </Text>
        </View>

        {order.is_takeaway && (<View>
            <Text style={{fontSize: SIZES.medium, fontWeight: 'bold', marginVertical: SIZES.small}}>Customer
                Name</Text>
            <Input>
                <InputField
                    type={'text'}
                    placeholder={'...'}
                    value={customerName}
                    onChangeText={(text) => {
                        setCustomerName(text);
                        setOrder((prevOrder) => ({
                            ...prevOrder, customer_name: text,
                        }));
                    }}
                />
            </Input>
        </View>)}

        <View>
            <Text style={{fontSize: SIZES.medium, fontWeight: 'bold', marginVertical: SIZES.small}}>Notes</Text>
        </View>

        <View>
            <Textarea size="md" isReadOnly={false} isInvalid={false} isDisabled={false} w="$100"
                      style={{borderColor: COLORS.gray, marginBottom: 60}}>
                <TextareaInput
                    value={notes}
                    onChangeText={(text) => {
                        setNotes(text);
                        setOrder((prevOrder) => ({...prevOrder, notes: text}));
                    }}
                    placeholder="..."
                />
            </Textarea>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/cashier/menu',
                })}
                style={styles.cancelButton}
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <Button onPress={() => setShowModal(true)} ref={ref} style={styles.nextButton}>
                <ButtonText style={[styles.buttonText, {color: '#fff', fontWeight: 'normal'}]}>Confirm</ButtonText>
            </Button>
        </View>

        <Center>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} finalFocusRef={ref}>
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Payment confirmation</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>

                    </ModalHeader>
                    <ModalBody>


                        <View>

                            <Text style={{
                                marginVertical: SIZES.small, color: COLORS.darkGray, fontSize: SIZES.medium
                            }}>
                                Please enter the payment amount :
                            </Text>
                            <Input>
                                <InputField
                                    type={'text'}
                                    placeholder={'Rp.'}
                                    value={paymentAmount}
                                    onChangeText={handlePaymentAmountChange}
                                />
                            </Input>
                        </View>


                        <Text style={{marginVertical: SIZES.light, color: COLORS.darkGray}}>
                            Change : {formatCurrency(parseInt(paymentAmount) - calculateTotalPrice())}
                        </Text>

                    </ModalBody>
                    <ModalFooter style={{justifyContent: 'center'}}>
                        <Button
                            width={'40%'}
                            size="sm"
                            variant={'outline'}
                            borderColor={COLORS.primary}
                            borderRadius={100}
                            mr="$3"
                            onPress={() => {
                                setShowModal(false);
                            }}
                        >
                            <ButtonText style={[styles.buttonText, {}]}>Cancel</ButtonText>
                        </Button>
                        <Button
                            width={'50%'}
                            size="sm"
                            backgroundColor={COLORS.primary}
                            variant={'filled'}
                            borderColor={COLORS.primary}
                            borderRadius={100}
                            onPress={() => {
                                setShowModal(false);
                                handleCreateTransactions();
                                router.navigate({pathname: '/cashier/invoice'});
                            }}
                        >
                            <ButtonText>Pay</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    </SafeAreaView>);
};

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 100,
        marginVertical: SIZES.small,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        backgroundColor: COLORS.bg,
    }, cancelButton: {
        borderColor: COLORS.primary,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: SIZES.xSmall,
        borderRadius: 100,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    }, nextButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xSmall,
        borderRadius: 100,
        marginVertical: SIZES.small,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, buttonText: {
        textAlignVertical: 'center', textAlign: 'center', fontSize: SIZES.medium, color: COLORS.primary,
    },
});

export default Confirm;
