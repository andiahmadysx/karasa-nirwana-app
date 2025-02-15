import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import {
    AlertCircleIcon,
    Button,
    ButtonText,
    CircleIcon,
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
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
    Spinner,
    Toast,
    ToastTitle,
    useToast,
    VStack
} from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useCustomQuery, { useGet, usePost, useUpdate } from "../../../hooks/Fetch";
import { mainStyles } from "../../../styles";
import ModalDelete from "../../../components/common/ModalDelete";

import {COLORS, SIZES} from "../../../constants";

const Id = () => {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const isCreateMode = id === 'create';
    const postUser = usePost('/users');
    const updateUser = useUpdate('/users');
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        username: z.string().min(1, 'Required.'),
        name: z.string().min(1, 'Required.'),
        role: z.string().min(1, 'Required.'),
    });

    const { control, setValue, setError, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    });

    const toast = useToast();

    const {
        data: detailUserData,
    } = isCreateMode ? {} : useCustomQuery('detailUser', useGet('/users/' + id));

    const detailUser = useMemo(() => detailUserData?.user || [], [detailUserData]);

    const { refetch: refetchUsers } = useCustomQuery(
        'users-data',
        useGet('/users')
    );

    useEffect(() => {
        navigation.setOptions({ headerTitle: isCreateMode ? 'Add New User' : 'Edit User' });

        const setFormValues = async () => {
            if (!isCreateMode) {
                await setValue('name', detailUser?.name);
                await setValue('username', detailUser?.username);
                await setValue('role', detailUser?.role);
            }
        };

        setFormValues();
    }, [isCreateMode, detailUser, setValue]);

    const onSubmit = useCallback(async (data) => {
        setIsLoading(true);

        if (!isCreateMode && newPassword.length > 0 && newPassword.length > 6) {
            data.password = newPassword;
        }

        if (isCreateMode && newPassword.length > 0) {
            data.password = newPassword;
        }

        const response = !isCreateMode ? await updateUser(id, data) : await postUser(data);

        if (response.success) {
            const actionText = !isCreateMode ? 'Update' : 'Create';
            const successMessage = `${actionText} user success!`;

            refetchUsers();
            router.navigate('/admin/users');

            toast.show({
                placement: 'bottom',
                duration: 3000,
                render: ({ id }) => (
                    <Toast bg="$success500" nativeID={`toast-${id}`} p="$6" style={{ marginBottom: SIZES.xxLarge }}>
                        <VStack space="xs" style={{ width: '90%' }}>
                            <ToastTitle color="$textLight50">{successMessage}</ToastTitle>
                        </VStack>
                    </Toast>
                ),
            });

            setShowModal(false);
            setIsLoading(false);
        } else {
            alert('username already exist!');
            console.error(`Failed to ${isCreateMode ? 'update' : 'create'} table. Server response:`, response);
            setIsLoading(false);
        }
    }, [isCreateMode, id, updateUser, postUser, toast, newPassword]);

    const renderFormControl = (name, label, placeholder, type = 'text', handleChange = () => {}) => (
        <FormControl size="md" isDisabled={false} isInvalid={!!errors[name]} isReadOnly={false} isRequired={true}>
            <FormControlLabel mb='$1'>
                <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
            <Input style={{ height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small }}>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <InputField
                            onBlur={() => {}}
                            type={type}
                            placeholder={placeholder}
                            value={field.value}
                            onChange={(e) => {
                                field.onChange(e.nativeEvent.text);
                                handleChange(e.nativeEvent.text);
                            }}
                        />
                    )}
                />
            </Input>
            <FormControlHelper></FormControlHelper>
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>{errors[name]?.message}</FormControlErrorText>
            </FormControlError>
        </FormControl>
    );

    return (
        <SafeAreaView style={[mainStyles.container]}>
            <View style={{
                backgroundColor: COLORS.white,
                padding: SIZES.large,
                borderRadius: SIZES.small,
                gap: SIZES.small,
            }}>
                <View>
                    {renderFormControl('name', 'Name', '...')}
                    {renderFormControl('username', 'Username', '...')}
                    {isCreateMode && renderFormControl('password', 'Password', '...', 'password', setNewPassword)}
                </View>
            </View>

            <View style={{
                backgroundColor: COLORS.white,
                padding: SIZES.large,
                borderRadius: SIZES.small,
                gap: SIZES.small,
                marginVertical: SIZES.small
            }}>
                <View>
                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.role} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Access Roles</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="role"
                            render={({field}) => (
                                // value={values} onChange={setValues}
                                <RadioGroup value={field.value} onChange={(e) => {
                                    field.onChange(e);
                                }} style={{
                                    marginHorizontal: SIZES.light,
                                    paddingTop: SIZES.light
                                }}>
                                    <VStack space="md">
                                        <Radio value="admin">
                                            <RadioIndicator mr="$2">
                                                <RadioIcon as={CircleIcon}/>
                                            </RadioIndicator>
                                            <RadioLabel>Admin</RadioLabel>
                                        </Radio>
                                        <Radio value="owner">
                                            <RadioIndicator mr="$2">
                                                <RadioIcon as={CircleIcon}/>
                                            </RadioIndicator>
                                            <RadioLabel>Owner</RadioLabel>
                                        </Radio>
                                        <Radio value="cashier">
                                            <RadioIndicator mr="$2">
                                                <RadioIcon as={CircleIcon}/>
                                            </RadioIndicator>
                                            <RadioLabel>Cashier</RadioLabel>
                                        </Radio>
                                        <Radio value="chef">
                                            <RadioIndicator mr="$2">
                                                <RadioIcon as={CircleIcon}/>
                                            </RadioIndicator>
                                            <RadioLabel>Chef</RadioLabel>
                                        </Radio>
                                        <Radio value="waiter">
                                            <RadioIndicator mr="$2">
                                                <RadioIcon as={CircleIcon}/>
                                            </RadioIndicator>
                                            <RadioLabel>Waiter</RadioLabel>
                                        </Radio>
                                    </VStack>
                                </RadioGroup>
                            )}
                        />
                        <FormControlHelper></FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>{errors.role?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                </View>
            </View>

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                size={'md'}
            >
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{'Change Password'}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        {
                            <Text style={{
                                color: COLORS.darkGray,
                                marginBottom: SIZES.medium
                            }}>
                                Ensure strong, unique passwords for enhanced account security. </Text>
                        }
                        <FormControl size="md" isDisabled={false} isInvalid={!!errors.newPassword} isReadOnly={false}
                                     isRequired={true}>
                            <FormControlLabel mb='$1'>
                                <FormControlLabelText>New Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={{ height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small }}>
                                <Controller
                                    control={control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <InputField
                                            onBlur={() => {
                                            }}
                                            type="password"
                                            placeholder="..."
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.nativeEvent.text);
                                                setNewPassword(e.nativeEvent.text);
                                            }}
                                        />
                                    )}
                                />
                            </Input>
                            <FormControlHelper></FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon}/>
                                <FormControlErrorText>{errors.newPassword?.message}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="md"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModal(false);
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
                                if (!isCreateMode && newPassword.length > 0 && newPassword.length < 6) {
                                    setError('newPassword', {
                                        type: 'manual',
                                        message: 'Password is required min 6 characters.',
                                    });
                                    return; // Stop further execution
                                }
                                setShowModal(false);
                            }}
                            bg="$success700"
                            $hover-bg="$success800"
                            $active-bg="$success900"
                        >
                            <ButtonText>Save</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {!isCreateMode &&
                <Pressable
                    style={{
                        borderRadius: SIZES.small,
                        height: SIZES.xxLarge + SIZES.small,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}
                    onPress={() => {
                        setShowModal(true);
                    }}
                >
                    <Text style={{
                        color: COLORS.danger,
                        fontSize: SIZES.medium,
                        fontWeight: 400
                    }}>
                        Change Password
                    </Text>
                </Pressable>
            }

            {!isCreateMode &&
                <Pressable
                    style={{
                        borderRadius: SIZES.small,
                        height: SIZES.xxLarge + SIZES.small,
                        borderWidth: 1,
                        borderColor: COLORS.danger,
                        backgroundColor: isButtonHovered ? 'red' : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: SIZES.small
                    }}
                    onPress={() => {
                        setShowDeleteModal(true);
                    }}
                    onPressIn={() => setIsButtonHovered(true)}
                    onPressOut={() => setIsButtonHovered(false)}
                >
                    <Text style={{
                        color: isButtonHovered ? COLORS.white : COLORS.danger,
                        fontSize: SIZES.medium,
                        fontWeight: 400
                    }}>
                        Delete User
                    </Text>
                </Pressable>
            }

            {
                !isLoading ? <TouchableOpacity onPress={() => {
                        if (isCreateMode && newPassword.length > 0 && newPassword.length < 6) {
                            setError('password', {
                                type: 'manual',
                                message: 'Password is required min 6 characters.',
                            });
                            return; // Stop further execution
                        }
                        handleSubmit(onSubmit)();
                    }} style={{
                        backgroundColor: COLORS.primary,
                        padding: SIZES.medium,
                        justifyContent: 'center',
                        borderRadius: SIZES.small,
                        position: 'absolute',
                        bottom: SIZES.medium,
                        width: '100%',
                        flex: 1,
                        alignSelf: 'center',
                        height: SIZES.xxLarge + SIZES.large,
                    }}>
                        <Text style={{
                            width: '100%',
                            textAlign: 'center',
                            color: 'white',
                            fontSize: SIZES.medium,
                            fontWeight: 600,
                        }}>Save</Text>
                    </TouchableOpacity>
                    :

                    <Button isDisabled={true} onPress={handleSubmit(onSubmit)}
                            style={{
                                backgroundColor: COLORS.primary,
                                padding: SIZES.medium,
                                height: SIZES.xxLarge + SIZES.large,
                                justifyContent: 'center',
                                borderRadius: SIZES.small,
                                position: 'absolute',
                                bottom: SIZES.medium,
                                width: '100%',
                                flex: 1,
                                alignSelf: 'center'
                            }}>
                        <Spinner size={'small'} color="$secondary600"/>
                    </Button>
            }

            {/*    MODAL DELETE CONFIRMATION */}
            <ModalDelete setShowModal={setShowDeleteModal} showModal={showDeleteModal} url={'/users/' + id}
                         route={'/admin/users'} refetch={refetchUsers}/>
        </SafeAreaView>
    );
};

export default Id;
