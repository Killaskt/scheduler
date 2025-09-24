import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useAppStore } from "@/store";

export const TaskScreen = () => {
    const { tasks, toggleTaskComplete } = useAppStore();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => toggleTaskComplete(item.id)}>
            <View
                style={[
                    styles.taskItem,
                    item.completedAt && styles.completedTask,
                ]}
            >
                <Text
                    style={[
                        styles.taskTitle,
                        item.completedAt && styles.completedText,
                    ]}
                >
                    {item.title}
                </Text>
                {item.description && (
                    <Text
                        style={[
                            styles.taskDescription,
                            item.completedAt && styles.completedText,
                        ]}
                    >
                        {item.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tasks</Text>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tasks yet.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    taskItem: {
        backgroundColor: "#f0f0f0",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    completedTask: {
        backgroundColor: "#e0e0e0",
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "500",
    },
    taskDescription: {
        fontSize: 14,
        color: "#666",
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
    },
});
