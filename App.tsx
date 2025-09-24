import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { CalendarScreen } from "./src/features/calendar/CalendarScreen";
import QuickInputBar from "./src/components/QuickInputBar";

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <CalendarScreen />
            </View>
            <QuickInputBar />
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
    },
});
