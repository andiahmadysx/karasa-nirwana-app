import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';

const logo = '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';

const SamplePrint = () => {
    return (
        <View>
            <Text>Sample Print Instruction</Text>
            <View style={styles.btn}>
                <Button
                    onPress={}

                    title="Print"
                />
            </View>
        </View>
    );
};

export default SamplePrint;

const styles = StyleSheet.create({
    btn: {
        marginBottom: 8,
    },
});
