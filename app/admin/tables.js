import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainStyles, searchStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import NoDataFound from "../../components/common/NoDataFound";
import {
    AlertCircleIcon,
    Button,
    ButtonText,
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
    VStack
} from "@gluestack-ui/themed";
import {Ionicons} from "@expo/vector-icons";
import CardTableAdmin from "../../components/admin/CardTableAdmin";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useCustomQuery, {useDelete, useGet, usePost, useUpdate} from "../../hooks/Fetch";
import debounce from "lodash/debounce";
import ModalDelete from "../../components/common/ModalDelete";

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
});


const Tables = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false); // New state for button hover

    const {
        control,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const {
        data: tablesData,
        error: tablesError,
        isLoading: tablesLoading,
        refetch: refetchTable,
    } = useCustomQuery('tables', useGet('/tables'));

    const tables = useMemo(() => tablesData?.tables || [], [tablesData]);
    const postTable = usePost('/tables');
    const toast = useToast();
    const deleteTable = useDelete('/tables/' + selectedTableId);
    const updateTable = useUpdate('/tables');

    const onSubmit = useCallback(async (data) => {
        const response = isEdit ? await updateTable(selectedTableId, data) : await postTable(data);

        if (response.success) {
            refetchTable();
            const actionText = isEdit ? 'Update' : 'Create';
            const successMessage = `${actionText} table success!`;

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
            alert('Table name already exist!')
            console.error(`Failed to ${isEdit ? 'update' : 'create'} table. Server response:`, response);
        }
    }, [isEdit, selectedTableId, updateTable, postTable, refetchTable, toast]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await deleteTable();
            if (response.success) {
                refetchTable();
                toast.show({
                    placement: 'bottom',
                    duration: 3000,
                    render: ({id}) => (
                        <Toast bg="$success500" nativeID={`toast-${id}`} p="$6" style={{marginBottom: SIZES.xxLarge}}>
                            <VStack space="xs" style={{width: '90%'}}>
                                <ToastTitle color="$textLight50">Delete table success!</ToastTitle>
                            </VStack>
                        </Toast>
                    ),
                });

                setShowModal(false);
            } else {
                console.error('Failed to delete table. Server response:', response);
            }
        } catch (error) {
            console.error('Error while deleting table:', error);
        }
    }, [deleteTable, selectedTableId, refetchTable, toast]);

    const handleEdit = debounce(useCallback((item) => {

        if (item.is_used) {
            alert(`You cannot modify used table!`);
            return;
        }

        setSelectedTable(item.name);
        setValue('name', item.name);
        handleSubmit(() => {
        })();
        setIsEdit(true);
        setShowModal(true);
    }, [setSelectedTable, setValue, handleSubmit, setIsEdit, setShowModal]), 100);

    const filteredTable = useMemo(() => tables.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())), [tables, searchTerm]);


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
                        placeholder={'Search table...'}
                        // value={searchTerm}
                        // onChangeText={setSearchTerm}
                    />
                </View>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: SIZES.small,
                    marginHorizontal: SIZES.light,
                    flex: 1,
                }}
                contentContainerStyle={{
                    // justifyContent: 'center'
                }}
                horizontal={false}
            >
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: SIZES.small,
                    justifyContent: 'space-between',
                    borderRadius: SIZES.small,
                }}>
                    {filteredTable?.length > 0 ? (
                        filteredTable.map((item, index) => (
                            <View key={item.id} style={{
                                flexBasis: '48.5%',
                                marginBottom: SIZES.small + 2,
                                borderRadius: SIZES.small
                            }}>
                                <CardTableAdmin item={item} handlePress={() => {
                                    handleEdit(item);
                                    setSelectedTableId(item.id);
                                }}/>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            </ScrollView>


            {
                !tables &&
                <TouchableOpacity
                    style={{
                        padding: SIZES.medium,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.small,
                        flex: 1,
                        position: "absolute",
                        bottom: 0,
                        margin: SIZES.small,
                        width: '100%',
                        alignSelf: 'center'

                    }}
                >
                    <Text style={mainStyles.footerText}>Add Table</Text>
                </TouchableOpacity>
            }


            {
                tables &&
                <TouchableOpacity style={{
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: SIZES.small,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge
                }} onPress={() => {
                    setSelectedTable('')
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
                        <Heading size="lg">{isEdit ? 'Edit Table' : 'Add New Table'}</Heading>

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
                                    Modify the details of an existing table to keep your restaurant organized. </Text> :
                                <Text style={{
                                    color: COLORS.darkGray,
                                    marginBottom: SIZES.medium
                                }}>
                                    Create a new table to better organize your restaurant. </Text>
                        }
                        <FormControl size="md" isDisabled={false} isInvalid={!!errors.name} isReadOnly={false}
                                     isRequired={true}>
                            <FormControlLabel mb='$1'>
                                <FormControlLabelText>Table Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input style={{height: SIZES.xxLarge + SIZES.medium,borderRadius: SIZES.small}}>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({field}) => (
                                        <InputField
                                            type="text"
                                            placeholder="..."
                                            value={selectedTable}
                                            onChange={(e) => {
                                                field.onChange(e.nativeEvent.text);
                                                setSelectedTable(e.nativeEvent.text);
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
                                <Text style={{ color: isButtonHovered ? COLORS.white : COLORS.danger, fontSize: SIZES.medium, fontWeight: 400 }}>
                                    Delete Table
                                </Text>
                            </Pressable>
                        )}

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
                                borderRadius: SIZES.small
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="primary"
                            borderWidth="$0"

                            style={{
                                borderRadius: SIZES.small
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

            {/* MODAL DELETE CATEGORIES */}
            <ModalDelete setShowModal={setShowDeleteModal} showModal={showDeleteModal} url={'/tables/' + selectedTableId}
                         route={'/admin/tables'} refetch={refetchTable} callback={() => {
                setShowModal(false);
            }}/>
        </SafeAreaView>
    );
};

export default Tables;
