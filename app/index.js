import {useFocusEffect, useRouter} from "expo-router";
import {Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {pageValidation} from "../utils/pageValidation";


const Page = () => {
    const router = useRouter();
    useFocusEffect(() => {
        async function fetchData() {
            const response = await AsyncStorage.getItem('@user');
            const user = JSON.parse(response);
            pageValidation(user, router);
        }

        fetchData();
    });

    return (
        <View>
            <Text>Silence is golden.</Text>
        </View>
    );
};

export default Page;

