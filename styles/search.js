import {StyleSheet} from "react-native";

import {COLORS, FONT, SIZES} from "../constants";

const styles = StyleSheet.create({
    searchContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: SIZES.xxLarge + SIZES.medium,
        marginBottom: SIZES.small,
    },
    searchWrapper: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        flexDirection: "row", // Add this to align items horizontally within searchWrapper
        alignItems: "center",
        borderRadius: SIZES.small,
        height: "100%",
        borderColor: COLORS.gray,
        borderStyle: "solid",
        borderWidth: 1,
    },
    searchInput: {
        fontFamily: FONT.regular,
        width: "100%",
        height: "100%",
        paddingHorizontal: SIZES.medium,
        alignItems: 'center',
        marginTop: SIZES.light,
        marginLeft: -SIZES.light
    },
    searchBtn: {
        width: 50,
        height: "100%",
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBtnImage: {
        width: "50%",
        height: "50%",
        tintColor: COLORS.white,
    },
    searchTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.primary,
    },
    noOfSearchedJobs: {
        marginTop: 2,
        fontFamily: FONT.medium,
        fontSize: SIZES.small,
        color: COLORS.primary,
    },
    loaderContainer: {
        marginTop: SIZES.medium
    },
    footerContainer: {
        marginTop: SIZES.small,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    paginationButton: {
        width: 30,
        height: 30,
        borderRadius: SIZES.small,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.tertiary
    },
    paginationImage: {
        width: '60%',
        height: '60%',
        tintColor: COLORS.white
    },
    paginationTextBox: {
        width: 30,
        height: 30,
        borderRadius: SIZES.small,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg
    },
    paginationText: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.primary
    }
});

export default styles;
