import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {COLORS, SIZES} from "../../constants";

export default class Clock extends React.Component {
    constructor() {
        super();
        this.state = {
            time: new Date(),
        };
    }
    update = () => {
        this.setState({ time: new Date() });
    };
    componentDidMount() {
        setInterval(this.update, 1000);
    }
    render() {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        const dateFormatted = new Date().toLocaleDateString('en-US', options);
        const timeFormatted = this.state.time.toLocaleTimeString('en-US', { hour12: false });

        return (
            <View>
                <Text style={{
                    fontSize: 14,
                    color: COLORS.darkGray
                }}>
                    {dateFormatted + ' ' + timeFormatted}
                </Text>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    viewstyling: {
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 95,
    },

    cardstyling: {
        padding: 50,
        marginLeft: 15,
        marginRight: 15,
        textAlign: 'center',
    },

    textstyle: {
        textAlign: 'center',
        justifyContent: 'center',

        fontSize: 35,
        fontWeight: 600,
    },
});
