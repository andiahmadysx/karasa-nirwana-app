import React from 'react';
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
import {Text} from "react-native";
import {useDelete} from "../../hooks/Fetch";
import {useRouter} from "expo-router";
import {useAuth} from "../../hooks/Auth";
import {SIZES} from "../../constants";

const modalDelete = ({setShowModal, showModal, url, route, refetch, callback = () => {}}) => {
    const toast = useToast();
    const {removeUser} = useAuth();
    const router = useRouter();

    const deleteItem = useDelete(url);


    const handleDelete = async () => {
        const response = await deleteItem();

        if (response.success) {
            refetch();
            callback();

            router.navigate(route);
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
                                    Delete item success
                                </ToastTitle>
                            </VStack>
                        </Toast>
                    )
                },
            });

        } else {
            console.log(response)
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
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Confirm Delete</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text size="md">
                            Are you sure you want to delete this item?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="md"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setShowModal(false)
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
                                setShowModal(false)
                                handleDelete();
                            }}
                            bg="$error700"
                            $hover-bg="$error800"
                            $active-bg="$error900"
                        >
                            <ButtonText>Delete</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    );
};

export default React.memo(modalDelete);
