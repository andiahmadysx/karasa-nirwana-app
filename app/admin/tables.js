import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainStyles, searchStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import NoDataFound from "../../components/common/NoDataFound";
import {
    AlertCircleIcon, Button, ButtonText,
    CloseIcon,
    FormControl,
    FormControlError,
    FormControlErrorIcon, FormControlErrorText,
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
    ModalContent, ModalFooter,
    ModalHeader,
    SearchIcon
} from "@gluestack-ui/themed";
import {Ionicons} from "@expo/vector-icons";
import CardTableAdmin from "../../components/admin/CardTableAdmin";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
});


const Tables = () => {
    const [categories, setCategories] = useState(true);
    const [showModal, setShowModal] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTable, setSelectedTable] = useState('All');

    const {control, setValue, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        if (!selectedTable.trim()) {
            // Handle the case where the name is empty
            alert('Table name is required!');
            return;
        }
    }

    const handleEdit = (item) => {
        if (item.is_used) {
            alert(`Can't edit used table!`);
            return;
        }
        setSelectedTable(item.name);
        setValue('name', item.name)
        handleSubmit(() => {
        })()
        setIsEdit(true);
        setShowModal(true);

    }

    const tables = [
        {
            id: 'fdsasdfds',
            name: 'Andi Ahmad',
            is_used: false

        },
        {
            id: 'fdsasdfdsafds',
            name: 'Fahmi Maulana',
            is_used: true
        },

        {
            id: 'ouifdsajn',
            name: 'Kevin Sanjaya',
            is_used: false
        },
    ]

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
                    {tables?.length > 0 ? (
                        tables.map((item, index) => (
                            <View key={item.id} style={{
                                flexBasis: '48.5%',
                                marginBottom: SIZES.small + 2,
                                borderRadius: SIZES.small
                            }}>
                                <CardTableAdmin item={item} handlePress={() => handleEdit(item)}/>
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
                        borderRadius: 100,
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
                    borderRadius: 100,
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
                                <FormControlLabelText>Table Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input>
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

export default Tables;
