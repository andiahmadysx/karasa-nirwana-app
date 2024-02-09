import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../../styles";
import {
    AlertCircleIcon,
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField
} from "@gluestack-ui/themed";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {COLORS, SIZES} from "../../../constants";
import {Picker} from "@react-native-picker/picker";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useLocalSearchParams, useNavigation} from "expo-router";

const formSchema = z.object({
    name: z.string().min(1, 'Required.'),
    price: z.number().min(1, 'Required.'),
    stock: z.number().min(1, 'Required.'),
});


const Item = Picker.Item;
const Id = (props) => {
    const navigation = useNavigation();
    const {id} = useLocalSearchParams();

    React.useEffect(() => {
        navigation.setOptions({ headerTitle : id === 'create' ? 'Add Product' : 'Edit Product'});
    }, [navigation]);

    console.log(id);

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: .5,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const {control, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        console.log(data)
    }

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
                            <Image source={{uri: image}}
                                   style={{width: 120, height: 120, borderRadius: SIZES.small}}/> :

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
                            borderRadius: 100,
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
                        <Input>
                            <Controller
                                control={control}
                                name="name"
                                render={({field}) => (
                                    <InputField
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
                        <Input>
                            <Controller
                                control={control}
                                name="price"
                                render={({field}) => (
                                    <InputField
                                        type="text"
                                        placeholder="..."
                                        value={field.value}
                                        onChange={(e) => field.onChange(parseInt(e.nativeEvent.text))}
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
                        <Input>
                            <Controller
                                control={control}
                                name="stock"
                                render={({field}) => (
                                    <InputField
                                        type="text"
                                        placeholder="..."
                                        value={field.value}
                                        onChange={(e) => field.onChange(parseInt(e.nativeEvent.text))}
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


                    <FormControl size="md" isDisabled={false} isInvalid={!!errors.category} isReadOnly={false}
                                 isRequired={false}>
                        <FormControlLabel mb='$1'>
                            <FormControlLabelText>Category</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="category"
                            render={({field}) => (

                                <View style={
                                    {
                                        // backgroundColor: 'red'
                                        borderWidth: .5,
                                        borderColor: '#989898',
                                        borderRadius: SIZES.light
                                    }
                                }>

                                    <Picker
                                        mode={'dialog'}
                                        testID="styled-picker"
                                        // selectedValue={''}
                                        // onValueChange={(v) => setValue(v}
                                        accessibilityLabel="Basic Picker Accessibility Label">
                                        <Item label="hello" value="key0"/>
                                        <Item label="world" value="key1"/>
                                    </Picker>


                                </View>


                            )}
                        />
                        <FormControlHelper></FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon}/>
                            <FormControlErrorText>{errors.category?.message}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                </View>


            </View>

            <TouchableOpacity onPress={() => {
                handleSubmit(onSubmit)()
            }} style={{
                backgroundColor: COLORS.primary,
                padding: SIZES.medium,
                justifyContent: 'center',
                borderRadius: 100,
                position: 'absolute',
                bottom: SIZES.medium,
                width: '100%',
                flex: 1,
                alignSelf: 'center'

            }}>
                <Text style={{
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: SIZES.medium,
                    fontWeight: 600,
                }}>Save</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Id;
