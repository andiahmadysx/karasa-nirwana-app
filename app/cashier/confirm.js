import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    AlertCircleIcon,
    Button,
    ButtonText,
    Center,
    CloseIcon,
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlLabel,
    FormControlLabelText,
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
    Toast,
    ToastTitle,
    useToast,
    VStack,
} from '@gluestack-ui/themed';
import {useOrder} from '../../hooks/Order';
import ProductList from '../../components/cashier/ProductList';
import {useRouter} from 'expo-router';
import {formatCurrency} from '../../utils/formatCurrency';
import {usePost} from '../../hooks/Fetch';
import {COLORS, SIZES} from "../../constants";
import {mainStyles} from "../../styles";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


const Confirm = () => {
    const {order, setOrder} = useOrder();


    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);
    const [notes, setNotes] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(0);
    const toast = useToast();

    const calculateTotalPrice = useMemo(() => {
        return order.products.reduce((total, product) => total + product.price * product.qty, 0);
    }, [order.products]);


    const formSchema = z.object({
        customerName: order?.is_takeaway ? z.string().min(1, 'Customer name is required.') : z.string(),
    });

    const {control, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            customerName: '',
        },
        resolver: zodResolver(formSchema),
        mode: "onChange"
    });

    const postCreateTransactions = usePost('/transactions');

    // Memoized handlePaymentAmountChange
    const handlePaymentAmountChange = useCallback((amount) => {
        const parsedAmount = parseInt(amount) || 0;
        const totalOrderPrice = calculateTotalPrice;
        const changeAmount = parsedAmount - totalOrderPrice;

        setPaymentAmount(parsedAmount);

        setOrder((prevOrder) => ({
            ...prevOrder,
            payment_amount: parsedAmount,
            total_price: totalOrderPrice,
            change_amount: changeAmount > 0 ? changeAmount : 0,
        }));
    }, [setOrder, calculateTotalPrice]);

    // Memoized handleCreateTransactions
    const handleCreateTransactions = useCallback(async () => {
        const transactionsResponse = await postCreateTransactions(order);

        if (transactionsResponse.success) {
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
                                    Create transaction success!
                                </ToastTitle>
                            </VStack>
                        </Toast>
                    )
                },
            });

            router.push(`/cashier/transactions/${transactionsResponse.data.transaction.id}`);
        } else {
            toast.show({
                placement: "bottom",
                duration: 3000,
                render: ({id}) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast bg={'$error500'} action={'error'} nativeID={toastId} p="$8" style={{
                            marginBottom: SIZES.xxLarge + 50,
                            backgroundOpacity: .5
                        }}>
                            <VStack space="xs" style={{
                                width: '90%'
                            }}>
                                <ToastTitle color={'white'}>
                                    No enough money paid!
                                </ToastTitle>
                            </VStack>
                        </Toast>
                    )
                },
            });

        }
    }, [setOrder, postCreateTransactions, order]);

    return (<SafeAreaView style={mainStyles.container}>
        <FlatList
            numColumns={1}
            horizontal={false}
            style={{height: 'fit-content', flexGrow: 0, maxHeight: 350}}
            renderItem={({item}) => <ProductList item={item}/>}
            data={order?.products}
            keyExtractor={(item) => item.id.toString()}
        />

        <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Text
                style={{fontSize: SIZES.medium, fontWeight: 'light', marginVertical: SIZES.medium, color: COLORS.gray}}>
                {' '}
                Total : {formatCurrency(calculateTotalPrice)}
            </Text>
        </View>

        {order.is_takeaway && (
            <FormControl size="md" isDisabled={false} isInvalid={!!errors.customerName} isReadOnly={false}
                         isRequired={true}>
                <FormControlLabel mb='$1'>
                    <FormControlLabelText>Customer Name</FormControlLabelText>
                </FormControlLabel>
                <Input>
                    <Controller
                        control={control}
                        name="customerName"
                        render={({field: {value, onChange, onBlur}}) => (
                            <InputField
                                type="text"
                                placeholder="..."
                                value={value}
                                onChange={(e) => {
                                    onChange(e.nativeEvent.text);
                                    setCustomerName(e.nativeEvent.text);
                                }}
                            />
                        )}
                    />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon}/>
                    <FormControlErrorText><Text>{errors?.customerName?.message}</Text></FormControlErrorText>
                </FormControlError>
            </FormControl>)}

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
                onPress={() => router.navigate({
                    pathname: '/cashier/menu',
                })}
                style={styles.cancelButton}
            >
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <Button isDisabled={order.is_takeaway ? customerName === '' : false} onPress={() => {
                setShowModal(true);
            }} ref={ref} style={styles.nextButton}>
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


                        <FormControl size="md" isDisabled={false} isInvalid={!!errors.customerName} isReadOnly={false}
                                     isRequired={true}>
                            <FormControlLabel mb='$1'>
                                <FormControlLabelText>Payment Amount</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <Controller
                                    control={control}
                                    name="paymentAmount"
                                    render={({field}) => (
                                        <InputField
                                            keyboardType={'numeric'}
                                            type="text"
                                            placeholder="..."
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.nativeEvent.text)
                                                handlePaymentAmountChange(e.nativeEvent.text);
                                            }}
                                        />
                                    )}
                                />
                            </Input>
                            <FormControlHelper></FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon}/>
                                <FormControlErrorText>{errors.customerName?.message}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        <Text style={{marginVertical: SIZES.light, color: COLORS.darkGray}}>
                            Change : {formatCurrency(paymentAmount - calculateTotalPrice)}
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

                                if (isValid) {
                                    handleCreateTransactions();
                                    setShowModal(false);
                                }
                            }}
                            isDisabled={paymentAmount < calculateTotalPrice}
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
