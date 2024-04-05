import React, {useCallback, useEffect, useState} from 'react';
import {Image, Pressable, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../../../../../karasa-nirwana/styles";
import {
    AlertCircleIcon,
    Button,
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
    ToastTitle,
    useToast,
    VStack
} from "@gluestack-ui/themed";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {COLORS, SIZES} from "../../../../../../karasa-nirwana/constants";
import {Picker} from "@react-native-picker/picker";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import useCustomQuery, {useGet, usePostFormData} from "../../../../../../karasa-nirwana/hooks/Fetch";
import ModalDelete from "../../../../../../karasa-nirwana/components/common/ModalDelete";

const formSchema = z.object({
    name: z.string().min(1, 'Required.'),
    price: z.string().min(1, 'Required.'),
    stock: z.string().min(1, 'Required.'),
    category_id: z.string(),
});

const Item = Picker.Item;

const Id = (props) => {
    const {control, setValue, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(formSchema),
    });

    const navigation = useNavigation();
    const {id} = useLocalSearchParams();
    const toast = useToast();
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false); // New state for button hover

    const isCreateMode = id === 'create';
    const postProduct = usePostFormData('/products');
    const updateProduct = usePostFormData('/products/' + id);

    const [isLoading, setIsLoading] = useState(false);


    // Fetch detailProductsData only if not in create mode
    const {data: detailProductsData} = !isCreateMode ? useCustomQuery('detailProducts', useGet('/products/' + id)) : {};

    // Fetch categoriesData
    const detailProducts = detailProductsData?.product || [];

    const {
        data: categoriesData,
    } = useCustomQuery('categories', useGet('/categories-list'));

    const categories = categoriesData?.categories || [];

    const [image, setImage] = useState(null);

    const pickImage = useCallback(async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }, []);

    const {
        refetch: refetchProducts,
    } = useCustomQuery('products', useGet('/products'));


    const setFormValues = useCallback(async () => {
        if (!isCreateMode) {
            await setValue('name', detailProducts?.name || '');
            await setValue('price', String(detailProducts?.price) || '');
            await setValue('stock', String(detailProducts?.stock) || '');
            await setValue('category_id', detailProducts?.category_id || '');
        } else {
            await setValue('category_id', categories[0]?.id || '');
        }
    }, [isCreateMode, detailProducts, setValue]);


    useEffect(() => {
        navigation.setOptions({headerTitle: isCreateMode ? 'Add New Product' : 'Edit Product'});
        if (!isCreateMode && detailProductsData && detailProductsData && detailProductsData.image_url) {
            setImage({uri: detailProductsData.image_url});
        }
        setFormValues();
    }, [isCreateMode, setFormValues]);

    const onSubmit = useCallback(async (data) => {
        setIsLoading(true);
            try {
                if (image) {
                    const formData = new FormData();

                    if (id !== 'create') {
                        formData.append('_method', 'PUT');
                    }

                    formData.append("image", {
                        uri: image.uri,
                        name: "image.jpg",
                        type: "image/jpeg",
                    });

                    formData.append("name", data.name);
                    formData.append("price", String(data.price));
                    formData.append("stock", String(data.stock));
                    formData.append("category_id", data.category_id);

                    const response = id !== 'create' ? await updateProduct(formData) : await postProduct(formData);

                    if (response.success) {
                        refetchProducts();
                        router.navigate('/admin/manage_products');

                        toast.show({
                            placement: 'bottom',
                            duration: 3000,
                            render: ({id}) => (
                                <Toast bg="$success500" nativeID={`toast-${id}`} p="$6"
                                       style={{marginBottom: SIZES.xxLarge}}>
                                    <VStack space="xs" style={{width: '90%'}}>
                                        <ToastTitle
                                            color="$textLight50">{isCreateMode ? 'Create product success' : 'Edit product success'}</ToastTitle>
                                    </VStack>
                                </Toast>
                            ),
                        });
                    }
                } else {
                    alert('Please select an image');
                }

                setIsLoading(false);

            } catch (error) {
                console.error("Error:", error);
            }
        },
        [image]
    );


    return (
        <SafeAreaView style={[mainStyles.container]}>
            <View style={{
                backgroundColor: COLORS.white,
                padding: SIZES.large,
                borderRadius: SIZES.small,
                gap: SIZES.small,
            }}>
                <TouchableOpacity onPress={pickImage} style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: SIZES.xxLarge,
                    borderRadius: SIZES.small
                }}>
                    <View style={{
                        backgroundColor: COLORS.gray2,
                        borderRadius: SIZES.small
                    }}>
                        {image ?
                            <Image source={{uri: image.uri}}
                                   style={{
                                       width: 120,
                                       height: 120,
                                       borderRadius: SIZES.small
                                   }}/> : detailProducts?.image_url ? <Image source={{uri: detailProducts?.image_url}}
                                                                             style={{
                                                                                 width: 120,
                                                                                 height: 120,
                                                                                 borderRadius: SIZES.small
                                                                             }}/> :
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    width: 120, height: 120, borderRadius: SIZES.small
                                }}>
                                    <Text style={{
                                        fontSize: SIZES.large,
                                        fontWeight: 600,
                                    }}>NP</Text>
                                </View>
                        }
                        <View style={{
                            backgroundColor: COLORS.white,
                            padding: SIZES.light,
                            borderRadius: SIZES.small,
                            position: "absolute",
                            bottom: -SIZES.small,
                            right: -SIZES.small
                        }}>
                            <Ionicons name={'camera-outline'} size={24}/>
                        </View>
                    </View>
                </TouchableOpacity>

                <View>
                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.name} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Product Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
                            <Controller
                                control={control}
                                name="name"
                                render={({field}) => (
                                    <InputField onBlur={() => {
                                    }}
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
                            <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.price} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Price</FormControlLabelText>
                        </FormControlLabel>
                        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
                            <Controller
                                control={control}
                                name="price"
                                render={({field}) => (
                                    <InputField onBlur={() => {
                                    }}
                                                keyboardType={'numeric'}
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
                            <FormControlErrorText>{errors.price?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.stock} isReadOnly={false}
                                 isRequired={true}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Stock</FormControlLabelText>
                        </FormControlLabel>
                        <Input style={{height: SIZES.xxLarge + SIZES.medium, borderRadius: SIZES.small}}>
                            <Controller
                                control={control}
                                name="stock"
                                render={({field}) => (
                                    <InputField onBlur={() => {
                                    }}
                                                keyboardType={'numeric'}
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
                            <FormControlErrorText>{errors.stock?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.category_id} isReadOnly={false}
                                 isRequired={false}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Category</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="category_id"
                            render={({field}) => (
                                <View style={
                                    {
                                        borderWidth: .5,
                                        borderColor: '#989898',
                                        borderRadius: SIZES.small,
                                        height: SIZES.xxLarge + SIZES.medium
                                    }
                                }>
                                    <Picker
                                        style={{
                                            marginTop: -SIZES.light + 2
                                        }}
                                        mode={'dialog'}
                                        testID="styled-picker"
                                        selectedValue={field.value}
                                        onValueChange={(e) => field.onChange(e)}
                                        accessibilityLabel="Basic Picker Accessibility Label">
                                        {categories?.map((item) => {
                                            return <Item label={item.name} value={item.id} key={item.id}/>
                                        })}
                                    </Picker>
                                </View>
                            )}
                        />
                        <FormControlHelper></FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon}/>
                            <FormControlErrorText>{errors.category_id?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>


                </View>
            </View>

            {!isCreateMode && (
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
                        setShowModal(true)
                    }}
                    onPressIn={() => setIsButtonHovered(true)}
                    onPressOut={() => setIsButtonHovered(false)}
                >
                    <Text style={{
                        color: isButtonHovered ? COLORS.white : COLORS.danger,
                        fontSize: SIZES.medium,
                        fontWeight: 400
                    }}>
                        Delete Product
                    </Text>
                </Pressable>
            )}

            {
                !isLoading ? <TouchableOpacity onPress={() => {
                        handleSubmit(onSubmit)()
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
                    </TouchableOpacity> :

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
            <ModalDelete setShowModal={setShowModal} showModal={showModal} url={'/products/' + id}
                         route={'/admin/manage_products'} refetch={refetchProducts}/>
        </SafeAreaView>
    );
};

export default Id;
