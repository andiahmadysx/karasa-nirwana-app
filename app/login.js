import React, {useState} from 'react';
import {
    AlertCircleIcon,
    Box,
    Button,
    Center,
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
    VStack
} from "@gluestack-ui/themed";
import {Image, SafeAreaView, Text} from "react-native";
import {mainStyles} from "../styles";
import {COLORS, images, SIZES} from "../constants";
import {usePost} from "../hooks/Fetch";
import {useAuth} from "../hooks/Auth";
import {useRouter} from "expo-router";
import Menu from "./cashier/menu";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loginPost = usePost('/auth/login');
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const {user, setUser, removeUser} = useAuth();
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async () => {

        setIsLoading(true);
        const response = await loginPost(credentials);

        if (response.success) {
            setIsLoading(false);
            const user = response.data.user;

            setCredentials({
                username: '',
                password: ''
            });
            setUser(user);

            switch (user.role) {
                case "admin":
                    router.navigate('/cashier');
                    break;
                case "chef":
                    router.navigate('/chef');
                    break;
                case "waiter":
                    router.navigate('/waiter');
                    break;
                case "cashier":
                    router.navigate('/cashier');
                    break;
                default:
                    router.navigate('/not-found');
            }

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
                                    Login success
                                </ToastTitle>
                                <ToastDescription color="$textLight50">
                                    Welcome, {user.name}!
                                </ToastDescription>
                            </VStack>
                        </Toast>
                    )
                },
            });
        } else
        {
            setIsLoading(false);
            toast.show({
                placement: "bottom",
                duration: 3000,
                render: ({id}) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast bg="$error700" nativeID={toastId} p="$6" style={{
                            marginBottom: SIZES.xxLarge + 50
                        }}>
                            <VStack space="xs" style={{
                                width: '90%'
                            }}>
                                <ToastTitle color="$textLight50">
                                    Login failed
                                </ToastTitle>
                                <ToastDescription color="$textLight50">
                                    Username or password incorrect!
                                </ToastDescription>
                            </VStack>
                        </Toast>
                    )
                },
            })
        }
    }


    return (
        <SafeAreaView style={mainStyles.container}>
            <Center style={{
                flex: .8
            }}>

                <Image source={images.logo} resizeMode={'contain'} style={{
                    width: 150,
                    height: 150,
                    alignSelf: 'center'
                }}/>


                <Box h="$32" w="$72" style={{
                    gap: SIZES.medium
                }}>

                    <FormControl size="md" isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={false}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Username</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type="text"
                                defaultValue={credentials.username}
                                placeholder="..."
                                onChange={(e) => {
                                    setCredentials((prevState) => ({...prevState, username: e.nativeEvent.text}))
                                }}
                            />
                        </Input>
                        <FormControlHelper>
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon
                                as={AlertCircleIcon}
                            />
                        </FormControlError>
                    </FormControl>


                    <FormControl size="md" isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={false}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type="password"
                                defaultValue={credentials.password}
                                placeholder="..."
                                onChange={(e) => {
                                    setCredentials((prevState) => ({...prevState, password: e.nativeEvent.text}))
                                }}
                            />
                        </Input>
                        <FormControlError>
                            <FormControlErrorIcon
                                as={AlertCircleIcon}
                            />
                            <FormControlErrorText>
                                At least 6 characters are required.
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>


                    <Button onPress={handleSubmit} isDisabled={isLoading} style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 100
                    }}>
                        <Text style={{
                            color: COLORS.white,
                            fontSize: SIZES.medium
                        }}>Login</Text>
                    </Button>
                </Box>

            </Center>
        </SafeAreaView>
    );
};

export default Login;
