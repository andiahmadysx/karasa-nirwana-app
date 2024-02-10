import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../constants";

const styles = StyleSheet.create({
    container: {
        padding: SIZES.xLarge,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.bg,
        fontFamily: FONT.medium
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: SIZES.small,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.xSmall,
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16,
    },
    tabsContainer: {
        width: "100%",
        marginTop: 0,
        marginVertical: SIZES.medium
    },
    tab: (activeCategory, item) => ({
        paddingVertical: SIZES.small / 2,
        paddingHorizontal: SIZES.xLarge,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: activeCategory === item ? COLORS.primary : 'transparent'

    }),
    tabText: (activeCategory, item) => ({
        fontFamily: FONT.medium,
        color: activeCategory === item ? COLORS.primary : COLORS.gray2,
    }),
    footerContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        borderRadius: SIZES.small,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.small,
        flexDirection: 'row',
        gap: SIZES.medium,
    },
    footerLink: {
        alignSelf: 'center',
    },
    footerText: {
        fontSize: SIZES.medium,
        color: COLORS.lightWhite,
        textAlign: 'center',
    },
});

export default styles;
