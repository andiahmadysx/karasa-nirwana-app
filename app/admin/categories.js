import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
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
    SearchIcon,
    Toast,
    ToastTitle,
    useToast,
    VStack,
} from '@gluestack-ui/themed';
import {Ionicons} from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import useCustomQuery, {useDelete, useGet, usePost, useUpdate,} from '../../hooks/Fetch';
import {FlashList} from "@shopify/flash-list";
import ModalDelete from "../../components/common/ModalDelete";
import NoDataFound from "../../components/common/NoDataFound";
import CategoryListAdmin from "../../components/admin/CategoryListAdmin";

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
});

const ManageCategories = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isButtonHovered, setIsButtonHovered] = useState(false); // New state for button hover
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const {
        control,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const {
        data: categoriesData,
        refetch: refetchCategories,
    } = useCustomQuery('categories', useGet('/categories-list'));

    const categories = useMemo(() => categoriesData?.categories || [], [categoriesData]);
    const postCategories = usePost('/categories');
    const toast = useToast();
    const deleteCategory = useDelete('/categories/' + selectedCategoryId);
    const updateCategory = useUpdate('/categories');

    const onSubmit = useCallback(async (data) => {
        const response = isEdit ? await updateCategory(selectedCategoryId, data) : await postCategories(data);

        if (response.success) {
            refetchCategories();
            const actionText = isEdit ? 'Update' : 'Create';
            const successMessage = `${actionText} category success!`;

            toast.show({
                placement: 'bottom',
                duration: 3000,
                render: ({id}) => (
                    <Toast bg="$success500" nativeID={`toast-${id}`} p="$6" style={{marginBottom: SIZES.xxLarge}}>
                        <VStack space="xs" style={{width: '90%'}}>
                            <ToastTitle color="$textLight50">{successMessage}</ToastTitle>
                        </VStack>
                    </Toast>
                ),
            });

            setShowModal(false);
        } else {
            console.error(`Failed to ${isEdit ? 'update' : 'create'} category. Server response:`, response);
        }
    }, [isEdit, selectedCategoryId, updateCategory, postCategories, refetchCategories, toast]);


    const handleEdit = useCallback((item) => {
        setSelectedCategory(item.name);
        setValue('name', item.name);
        handleSubmit(() => {
        })();
        setIsEdit(true);
        setShowModal(true);
    }, [setSelectedCategory, setValue, handleSubmit, setIsEdit, setShowModal]);

    const filteredCategories = useMemo(() => categories.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())), [categories, searchTerm]);

    const renderCategoryList = () => {
        if (filteredCategories.length === 0) {
            return (
                <NoDataFound/>
            );
        }

        return (
            <FlashList contentContainerStyle={{
                    paddingBottom: 60
                }} ListEmptyComponent={() => <NoDataFound/>}
                       numColumns={1}
                       horizontal={false}
                       showsVerticalScrollIndicator={false}
                       estimatedItemSize={80}
                       contentContainerStyle={{height: 'fit-content', flexGrow: 0}}
                       renderItem={({item}) => (
                           <CategoryListAdmin handlePress={() => {
                               handleEdit(item);
                               setSelectedCategoryId(item.id);
                           }} item={item}/>
                       )}
                       data={filteredCategories}
                       keyExtractor={(item) => item.id.toString()}
            />
        );
    };

    const renderAddCategoryButton = () => {
        if (!categories) {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.small,
                        flex: 1,
                        position: 'absolute',
                        bottom: 0,
                        margin: SIZES.small,
                        width: '100%',
                        alignSelf: 'center',
                    }}
                    onPress={() => {
                        setSelectedCategory('');
                        setIsEdit(false);
                        setShowModal(true);
                        setValue('name', '');
                    }}
                >
                    <Text style={mainStyles.footerText}>Add Category</Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.small,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge,
                }}
                onPress={() => {
                    setSelectedCategory('');
                    setIsEdit(false);
                    setShowModal(true);
                    setValue('name', '');
                }}
            >
                <Ionicons name={'add-outline'} size={SIZES.xxLarge} color={'white'}/>
            </TouchableOpacity>
        );
    };

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
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                    />
                </View>
            </View>

            {renderCategoryList()}
            {renderAddCategoryButton()}

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
                        <Heading size="lg">{isEdit ? 'Edit Category' : 'Add New Category'}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        {isEdit ? (
                            <Text style={{
                                color: COLORS.darkGray,
                                marginBottom: SIZES.medium,
                            }}>
                                Modify the details of an existing category to keep your menu organized.
                            </Text>
                        ) : (
                            <Text style={{
                                color: COLORS.darkGray,
                                marginBottom: SIZES.medium,
                            }}>
                                Create a new category to better organize your menu.
                            </Text>
                        )}
                        <FormControl size="md" isDisabled={false} isInvalid={!!errors.name} isReadOnly={false}
                                     isRequired={true}>
                            <FormControlLabel mb="$1">
                                <FormControlLabelText>Category Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={{
                                height: SIZES.xxLarge + SIZES.medium,
                                borderRadius: SIZES.small
                            }}>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({field}) => (
                                        <InputField onBlur={() => {
                                        }}

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

                        {isEdit && (
                            <Pressable
                                style={{
                                    borderRadius: SIZES.small,
                                    height: SIZES.xxLarge + SIZES.small,
                                    borderWidth: 1,
                                    borderColor: COLORS.danger,
                                    backgroundColor: isButtonHovered ? 'red' : 'transparent',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: SIZES.xSmall
                                }}
                                onPress={() => {
                                    setShowDeleteModal(true)
                                }}
                                onPressIn={() => setIsButtonHovered(true)}
                                onPressOut={() => setIsButtonHovered(false)}
                            >
                                <Text style={{
                                    color: isButtonHovered ? COLORS.white : COLORS.danger,
                                    fontSize: SIZES.medium,
                                    fontWeight: 400
                                }}>
                                    Delete Category
                                </Text>
                            </Pressable>
                        )}
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
                                borderRadius: SIZES.small,
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="md"
                            action="primary"
                            borderWidth="$0"
                            style={{
                                borderRadius: SIZES.small,
                            }}
                            onPress={() => {
                                handleSubmit(onSubmit)();
                            }}
                            bg="$success700"
                            $hover-bg="$success800"
                            $active-bg="$success900"
                        >
                            <ButtonText>{isEdit ? 'Edit' : 'Save'}</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* MODAL DELETE CATEGORIES */}
            <ModalDelete setShowModal={setShowDeleteModal} showModal={showDeleteModal}
                         url={'/categories/' + selectedCategoryId}
                         route={'/admin/categories'} refetch={refetchCategories} callback={() => {
                setShowModal(false);
            }}/>
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
