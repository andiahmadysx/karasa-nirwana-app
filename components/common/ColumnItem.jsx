import { StyleSheet, View, ViewProps } from "react-native";
import {SIZES} from "../../constants";

const getItemStyle = (index, numColumns) => {
    const alignItems = (() => {
        if (numColumns < 2 || index % numColumns === 0) return "flex-start";
        if ((index + 1) % numColumns === 0) return "flex-end";

        return "center";
    })();

    return {
        alignItems,
        padding: SIZES.light,
        width: "100%",
    };
};

export const ColumnItem = ({ children, index, numColumns, ...rest }) => (
    <View style={StyleSheet.flatten([getItemStyle(index, numColumns),rest.style])} {...rest}>
        {children}
    </View>
);
