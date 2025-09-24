import React, { useState } from "react";
import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useAppStore } from "@/store";

/**
 * QuickInputBar
 * - Single-line input for quickly creating tasks or places.
 * - If user types a date/time (very simple heuristic like "today" or "tomorrow"),
 *   we leave scheduling for later; this is intentionally minimal.
 */
export default function QuickInputBar() {
    const [text, setText] = useState("");
    const addTask = useAppStore((s) => s.addTask);

    const onSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // Minimal parsing: recognize "today" / "tomorrow" keywords
        const lower = trimmed.toLowerCase();
        let scheduledAt: Date | undefined;
        if (lower.includes("today")) scheduledAt = new Date();
        else if (lower.includes("tomorrow")) {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            scheduledAt = d;
        }

        addTask({
            title: trimmed,
            notes: "",
            scheduledAt,
            completedAt: undefined,
            placeId: undefined,
        });

        setText("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.wrapper}
        >
            <View style={styles.container}>
                <TextInput
                    placeholder="Add a task or place (try: today, tomorrow)"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={onSubmit}
                    returnKeyType="done"
                    style={styles.input}
                />
                <Pressable style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Add</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#fafafa",
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e6e6e6",
    },
    button: {
        marginLeft: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
