import React from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {mainStyles, searchStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";
import NoDataFound from "../../components/common/NoDataFound";
import CardUser from "../../components/admin/CardUser";
import {Icon, SearchIcon} from "@gluestack-ui/themed";
import {Ionicons} from "@expo/vector-icons";
import CardTableAdmin from "../../components/admin/CardTableAdmin";

const Users = () => {

    const users = [
        {
            id: 'fdsasdfds',
            name: 'Andi Ahmad',
            role: "admin"
        },
        {
            id: 'fdsasdfdsafds',
            name: 'Fahmi Maulana',
            role: "chef"
        },

        {
            id: 'ouifdsajn',
            name: 'Kevin Sanjaya',
            role: "owner"
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
                        placeholder={'Search user...'}
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
                    {users?.length > 0 ? (
                        users.map((item, index) => (
                            <View key={item.id} style={{
                                flexBasis: '48.5%',
                                marginBottom: SIZES.small + 2,
                                borderRadius: SIZES.small
                            }}>
                                <CardUser item={item}/>
                            </View>
                        ))
                    ) : (
                        <NoDataFound/>
                    )}
                </View>
            </ScrollView>



            {
                !users &&
                <TouchableOpacity
                    onPress={() => {
                        router.navigate(order.is_takeaway ? '/cashier/menu' : '/cashier/select_table');
                    }}
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
                    <Text style={mainStyles.footerText}>Add User</Text>
                </TouchableOpacity>
            }


            {
                users &&
                <TouchableOpacity style={{
                    paddingHorizontal: SIZES.small,
                    paddingVertical: SIZES.small - 1,
                    backgroundColor: COLORS.primary,
                    borderRadius: 100,
                    position: 'absolute',
                    right: SIZES.xLarge + 4,
                    bottom: SIZES.xxLarge
                }} onPress={() => {
                    // setShowModal(true);
                }}>
                    <Ionicons name={'add-outline'} size={SIZES.xxLarge} color={'white'}/>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

export default Users;
