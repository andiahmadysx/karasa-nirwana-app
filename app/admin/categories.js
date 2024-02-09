import React, {useState} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainStyles, searchStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
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
    SearchIcon
} from "@gluestack-ui/themed";
import {Ionicons} from "@expo/vector-icons";
import CategoryListAdmin from "../../components/admin/CategoryListAdmin";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


const formSchema = z.object({
    name: z.string().min(1, 'Required'),
});


const ManageCategories = () => {
    const [categories, setCategories] = useState(true);
    const [showModal, setShowModal] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const {control, setValue, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        if (!selectedCategory.trim()) {
            // Handle the case where the name is empty
            alert('Category name is required!');
            return;
        }

        // Continue with your logic for non-empty category name
        console.log(data);
    }

    const handleEdit = (item) => {
        setSelectedCategory(item.name);
        setValue('name', item.name)
        handleSubmit(() => {
        })()
        setIsEdit(true);
        setShowModal(true);

    }


    return (
        <SafeAreaView style={mainStyles.container}>
            <View
                style={[
                    searchStyles.searchContainer,
                    {marginBottom: SIZES.xxSmall},

                ]}
            >
                <View
                    style={[
                        searchStyles.searchWrapper,
                        {paddingLeft: SIZES.small},
                    ]}
                >
                    <Icon as={SearchIcon} color={COLORS.gray}/>
                    <TextInput
                        style={searchStyles.searchInput}
                        placeholder={'Search categories...'}
                        // value={searchTerm}
                        // onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            {
                categories &&
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    style={{height: 'fit-content', flexGrow: 0}}
                    renderItem={({item}) => <CategoryListAdmin handlePress={() => handleEdit(item)} item={item}/>}
                    data={[{
                        id: 'aldlfdslafd',
                        name: 'All',
                    },
                        {
                            id: 'aldlfdslfdsadafd',
                            name: 'Makanan Ringan',
                        }

                    ]}
                    keyExtractor={(item) => item.id.toString()}
                />
            }

            {!categories &&
                <Center style={{
                    flex: .8,
                }}>
                    <Image source={{uri: "https://bepharco.com/no-categories-found.png"}} width={200} height={300}/>
                </Center>

            }


            {
                !categories &&
                <TouchableOpacity
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: 100,
                        flex: 1,
                        position: "absolute",
                        bottom: 0,
                        margin: SIZES.small,
                        width: '100%',
                        alignSelf: 'center'

                    }}
                >
                    <Text style={mainStyles.footerText}>Add Category</Text>
                </TouchableOpacity>
            }


            {
                categories &&
                <TouchableOpacity style={{
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: 100,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge
                }} onPress={() => {
                    setSelectedCategory('')
                    setIsEdit(false);
                    setShowModal(true);
                    setValue('name', '')
                }}>
                    <Ionicons name={'add-outline'} size={SIZES.xxLarge} color={'white'}/>
                </TouchableOpacity>
            }


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
                        <Heading size="lg">{isEdit ? 'Edit Category' : 'Add New Category'}</Heading>

                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        {
                            isEdit ? <Text style={{
                                    color: COLORS.darkGray,
                                    marginBottom: SIZES.medium
                                }}>
                                    Modify the details of an existing category to keep your menu organized. </Text> :
                                <Text style={{
                                    color: COLORS.darkGray,
                                    marginBottom: SIZES.medium
                                }}>
                                    Create a new category to better organize your menu. </Text>
                        }
                        <FormControl size="md" isDisabled={false} isInvalid={!!errors.name} isReadOnly={false}
                                     isRequired={true}>
                            <FormControlLabel mb='$1'>
                                <FormControlLabelText>Category Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({field}) => (
                                        <InputField
                                            type="text"
                                            placeholder="..."
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                field.onChange(e.nativeEvent.text);
                                                setSelectedCategory(e.nativeEvent.text);
                                            }}
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
                                handleSubmit(onSubmit)()
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
        </SafeAreaView>
    );
};

export default ManageCategories;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.small,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
});
