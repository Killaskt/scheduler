import React from "react";
import { View, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { Task } from "@/types";

type Mode = "agenda" | "timeline";

interface Props {
    mode: Mode;
    tasks: Task[];
    onTaskPress?: (t: Task) => void;
}

// Map tasks into Agenda's data shape: { '2025-09-24': [{ name: 'Task' }] }
function mapTasksToAgenda(tasks: Task[]) {
    const data: Record<string, Array<any>> = {};
    tasks.forEach((t) => {
        const dateKey = t.scheduledAt
            ? new Date(t.scheduledAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10);
        if (!data[dateKey]) data[dateKey] = [];
        data[dateKey].push({
            name: t.title,
            taskId: t.id,
            day: dateKey,
            height: 60,
            task: t,
        });
    });
    return data;
}

export default function CalendarView({ mode, tasks, onTaskPress }: Props) {
    const agendaItems = mapTasksToAgenda(tasks);

    if (mode === "agenda") {
        return (
            <Agenda
                items={agendaItems}
                renderItem={(item: any) => (
                    <View
                        style={{
                            padding: 12,
                            backgroundColor: "#fff",
                            borderRadius: 6,
                            marginBottom: 8,
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={{ fontWeight: "600" }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                renderEmptyDate={() => <View style={{ height: 60 }} />}
            />
        );
    }

    // fallback timeline — parent can swap this with a richer timeline component later
    return (
        <View style={{ flex: 1 }}>
            {/* timeline fallback implemented by parent screen */}
        </View>
    );
}
