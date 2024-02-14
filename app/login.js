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
    Spinner,
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
    VStack,
} from '@gluestack-ui/themed';
import {Image, SafeAreaView, Text} from 'react-native';
import {mainStyles} from '../styles';
import {COLORS, images, SIZES} from '../constants';
import {useFocusEffect, useRouter} from 'expo-router';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {usePost} from '../hooks/Fetch';
import {useAuth} from '../hooks/Auth';

const formSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(3, 'Password must be at least 6 characters'),
});

const Login = () => {
    const {control, setValue, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(formSchema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const loginPost = usePost('/auth/login');
    const {user, setUser} = useAuth();
    const toast = useToast();

    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        const response = await loginPost(data);

        if (response.success) {
            setIsLoading(false);
            const user = response.data.user;
            setUser(user);

            switch (user.role) {
                case 'admin':
                    router.navigate('/admin');
                    break;
                case 'chef':
                    router.navigate('/chef');
                    break;
                case 'owner':
                    router.navigate('/owner');
                    break;
                case 'waiter':
                    router.navigate('/waiter');
                    break;
                case 'cashier':
                    router.navigate('/cashier');
                    break;
                default:
                    router.navigate('/not-found');
            }

            setValue('username', '');
            setValue('password', '');

            toast.show({
                placement: 'bottom',
                duration: 3000,
                render: ({id}) => (
                    <Toast bg="$success500" nativeID={`toast-${id}`} p="$6" style={{marginBottom: SIZES.xxLarge}}>
                        <VStack space="xs" style={{width: '90%'}}>
                            <ToastTitle color="$textLight50">Login success</ToastTitle>
                            <ToastDescription color="$textLight50">Welcome, {user.name}!</ToastDescription>
                        </VStack>
                    </Toast>
                ),
            });
        } else {
            setIsLoading(false);
            toast.show({
                placement: 'bottom',
                duration: 3000,
                render: ({id}) => (
                    <Toast bg="$error700" nativeID={`toast-${id}`} p="$6" style={{marginBottom: SIZES.xxLarge}}>
                        <VStack space="xs" style={{width: '90%'}}>
                            <ToastTitle color="$textLight50">Login failed</ToastTitle>
                            <ToastDescription color="$textLight50">Username or password incorrect!</ToastDescription>
                        </VStack>
                    </Toast>
                ),
            });
        }
    };

    return (
        <SafeAreaView style={mainStyles.container}>
            <Center style={{flex: 0.8}}>
                <Image source={images.logo} resizeMode={'contain'}
                       style={{width: 150, height: 150, alignSelf: 'center'}}/>

                <Box h="$32" w="$72" style={{gap: SIZES.medium}}>
                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.username} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb="$1">
                            <FormControlLabelText>Username</FormControlLabelText>
                        </FormControlLabel>
                        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
                            <Controller
                                control={control}
                                name="username"
                                render={({field}) => (
                                    <InputField onBlur={() => {}}
                                        type="text"
                                        placeholder="..."
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.nativeEvent.text)}
                                    />
                                )}
                            />
                        </Input>
                        <FormControlHelper></FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon}/>
                            <FormControlErrorText>{errors.username?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.password} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb="$1">
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
                            <Controller
                                control={control}
                                name="password"
                                render={({field}) => (
                                    <InputField onBlur={() => {}}
                                        type="password"
                                        placeholder="..."
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.nativeEvent.text)}
                                    />
                                )}
                            />
                        </Input>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon}/>
                            <FormControlErrorText>{errors.password?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    {
                        !isLoading ? <Button onPress={handleSubmit(onSubmit)}
                                             style={{
                                                 height: SIZES.xxLarge + SIZES.medium,
                                                 backgroundColor: COLORS.primary,
                                                 borderRadius: SIZES.small
                                             }}>
                                <Text style={{color: COLORS.white, fontSize: SIZES.medium}}>Login</Text>
                            </Button> :
                            <Button isDisabled={true} onPress={handleSubmit(onSubmit)}
                                    style={{
                                        height: SIZES.xxLarge + SIZES.medium,
                                        backgroundColor: COLORS.primary,
                                        borderRadius: SIZES.small,
                                        gap: SIZES.light
                                    }}>
                                <Spinner size={'small'} color="$secondary600"/>
                            </Button>
                    }
                </Box>
            </Center>
        </SafeAreaView>
    );
};

export default Login;
