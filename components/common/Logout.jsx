import React from 'react';
import {
    Button, ButtonText,
    Center, CloseIcon,
    Heading,
    Icon,
    Modal,
    ModalBackdrop, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader, Toast, ToastTitle, useToast, VStack
} from "@gluestack-ui/themed";
import {Text} from "react-native";
import {usePost} from "../../hooks/Fetch";
import {useRouter} from "expo-router";
import {useAuth} from "../../hooks/Auth";
import {SIZES} from "../../constants";

const Logout = ({setShowModal, showModal}) => {
    const logoutPost = usePost('/auth/logout');
    const toast = useToast();
    const {removeUser} = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        const response = await logoutPost();


        if (response.success) {
            router.navigate('/login');
            removeUser();
            toast.show({
                placement: "bottom",
                duration: 3000,
                render: ({id}) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast bg="$success500" nativeID={toastId} p="$6" style={{
                            marginBottom: SIZES.xxLarge
                        }}>
                            <VStack space="xs" style={{
                                width: '90%'
                            }}>
                                <ToastTitle color="$textLight50">
                                    Logout success
                                </ToastTitle>
                            </VStack>
                        </Toast>
                    )
                },
            });

        }
    }

    return (
        <Center h={400} style={{
            position: 'absolute'
        }}>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                size={'md'}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Confirm Logout</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text size="sm">
                            Are you sure you want to log out? By confirming, you will be securely logged out of your account.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModal(false)
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
                                setShowModal(false)
                                handleLogout();
                            }}
                            bg="$error700"
                            $hover-bg="$error800"
                            $active-bg="$error900"
                        >
                            <ButtonText>Logout</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    );
};

export default Logout;
