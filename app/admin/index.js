import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {mainStyles} from "../../styles";
import {COLORS, SIZES} from "../../constants";

const AdminDashboard = () => {

    return (
        <SafeAreaView style={mainStyles.container}>


            <View style={{
                marginBottom: SIZES.medium,

            }}>

                <Text style={{
                    fontSize: SIZES.medium,
                    color: COLORS.darkGray
                }}>Welcome,</Text>

                <Text style={{
                    fontSize: SIZES.large,
                    fontWeight: 600
                }}>Andi Ahmad Yusup</Text>
            </View>

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                <View style={{flexBasis: '46%', margin: SIZES.light}}>
                    <TouchableOpacity
                        style={{
                            width: '100%', // Set a fixed width for each item
                            minHeight: 100,
                            justifyContent: 'space-between',
                            borderRadius: SIZES.small,
                            padding: SIZES.small,
                            borderWidth: .5,
                            borderColor: COLORS.lightWhite,
                            marginRight: SIZES.small, // Add margin between items
                            backgroundColor: '#96CC5D',
                            shadowColor: "rgba(0,0,0,0.28)",
                            shadowOffset: {
                                width: 2,
                                height: 2,
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3.84,
                            elevation: 2,

                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.medium
                        }}>Total Product</Text>


                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.xxLarge,
                        }}>20</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flexBasis: '46%', margin: SIZES.light}}>
                    <TouchableOpacity
                        style={{
                            width: '100%', // Set a fixed width for each item
                            minHeight: 100,
                            justifyContent: 'space-between',
                            borderRadius: SIZES.small,
                            padding: SIZES.small,
                            borderWidth: .5,
                            borderColor: COLORS.lightWhite,
                            marginRight: SIZES.small, // Add margin between items
                            backgroundColor: '#E64F60',
                            shadowColor: "rgba(0,0,0,0.28)",
                            shadowOffset: {
                                width: 2,
                                height: 2,
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3.84,
                            elevation: 2,

                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.medium
                        }}>Total Users</Text>


                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.xxLarge,
                        }}>20</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flexBasis: '46%', margin: SIZES.light}}>
                    <TouchableOpacity
                        style={{
                            width: '100%', // Set a fixed width for each item
                            minHeight: 100,
                            justifyContent: 'space-between',
                            borderRadius: SIZES.small,
                            padding: SIZES.small,
                            borderWidth: .5,
                            borderColor: COLORS.lightWhite,
                            marginRight: SIZES.small, // Add margin between items
                            backgroundColor: '#ffc342',
                            shadowColor: "rgba(0,0,0,0.28)",
                            shadowOffset: {
                                width: 2,
                                height: 2,
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3.84,
                            elevation: 2,

                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.medium
                        }}>Total Categories</Text>


                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.xxLarge,
                        }}>20</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexBasis: '46%', margin: SIZES.light}}>
                    <TouchableOpacity
                        style={{
                            width: '100%', // Set a fixed width for each item
                            minHeight: 100,
                            justifyContent: 'space-between',
                            borderRadius: SIZES.small,
                            padding: SIZES.small,
                            borderWidth: .5,
                            borderColor: COLORS.lightWhite,
                            marginRight: SIZES.small, // Add margin between items
                            backgroundColor: '#5695E5',
                            shadowColor: "rgba(0,0,0,0.28)",
                            shadowOffset: {
                                width: 2,
                                height: 2,
                            },
                            shadowOpacity: 0.10,
                            shadowRadius: 3.84,
                            elevation: 2,

                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.medium
                        }}>Total Tables</Text>


                        <Text style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: SIZES.xxLarge,
                        }}>99</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};


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

export default AdminDashboard;
