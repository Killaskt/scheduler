import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { useAppStore } from "@/store";
import { Task } from "@/types";
import { startOfWeek, addDays, format, isSameDay, parseISO } from "date-fns";

// how many weeks to show in the calendar window. Change this to expand/contract the range.
export const CALENDAR_WEEKS = 2; // default: 2 weeks
export const CALENDAR_DAYS = CALENDAR_WEEKS * 7;

// Two-week horizontal calendar + agenda view toggle
export const CalendarScreen = () => {
    const { selectedDate, setSelectedDate, tasks } = useAppStore();
    const [mode, setMode] = useState<"calendar" | "agenda">("calendar");

    // compute N-day window (based on CALENDAR_WEEKS) starting at the Sunday of the selectedDate's week
    const days = useMemo(() => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
        return Array.from({ length: CALENDAR_DAYS }).map((_, i) =>
            addDays(start, i)
        );
    }, [selectedDate]);

    const tasksByDay = useMemo(() => {
        const map: Record<string, Task[]> = {};
        tasks.forEach((t) => {
            if (!t.scheduledAt) return;
            const d =
                typeof t.scheduledAt === "string"
                    ? new Date(t.scheduledAt)
                    : (t.scheduledAt as Date);
            const key = d.toDateString();
            if (!map[key]) map[key] = [];
            map[key].push(t);
        });
        // sort each day's tasks by time
        Object.keys(map).forEach((k) => {
            map[k].sort((a, b) => {
                const da = a.scheduledAt
                    ? new Date(a.scheduledAt).getTime()
                    : 0;
                const db = b.scheduledAt
                    ? new Date(b.scheduledAt).getTime()
                    : 0;
                return da - db;
            });
        });
        return map;
    }, [tasks]);

    const renderDayColumn = (day: Date) => {
        const key = day.toDateString();
        const dayTasks = tasksByDay[key] || [];
        const dayLabel = format(day, "EEE MMM d");

        return (
            <View style={styles.dayColumn} key={key}>
                <TouchableOpacity
                    onPress={() => setSelectedDate(day)}
                    style={styles.dayHeader}
                >
                    <Text style={styles.dayHeaderText}>{dayLabel}</Text>
                </TouchableOpacity>
                <ScrollView style={styles.dayBody}>
                    {dayTasks.length > 0 ? (
                        dayTasks.map((task) => (
                            <View key={task.id} style={styles.calendarTask}>
                                <Text style={styles.taskTime}>
                                    {task.scheduledAt
                                        ? format(
                                              typeof task.scheduledAt ===
                                                  "string"
                                                  ? parseISO(task.scheduledAt)
                                                  : (task.scheduledAt as Date),
                                              "p"
                                          )
                                        : ""}
                                </Text>
                                <Text style={styles.taskTitle}>
                                    {task.title}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No tasks</Text>
                    )}
                </ScrollView>
            </View>
        );
    };

    if (mode === "agenda") {
        // agenda: vertical list of date sections
        const agendaData = days.map((d) => ({
            date: d,
            tasks: tasksByDay[d.toDateString()] || [],
        }));
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.header}>Agenda</Text>
                    <TouchableOpacity
                        onPress={() => setMode("calendar")}
                        style={styles.modeButton}
                    >
                        <Text style={styles.modeButtonText}>Calendar View</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={agendaData}
                    keyExtractor={(item) => item.date.toDateString()}
                    renderItem={({ item }) => (
                        <View style={styles.agendaDay}>
                            <Text style={styles.agendaDayHeader}>
                                {format(item.date, "EEEE, MMM d")}
                            </Text>
                            {item.tasks.length > 0 ? (
                                item.tasks.map((task) => (
                                    <View
                                        key={task.id}
                                        style={styles.agendaTask}
                                    >
                                        <Text style={styles.taskTime}>
                                            {task.scheduledAt
                                                ? format(
                                                      typeof task.scheduledAt ===
                                                          "string"
                                                          ? parseISO(
                                                                task.scheduledAt
                                                            )
                                                          : (task.scheduledAt as Date),
                                                      "p"
                                                  )
                                                : ""}
                                        </Text>
                                        <Text style={styles.taskTitle}>
                                            {task.title}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No tasks</Text>
                            )}
                        </View>
                    )}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.header}>
                    {CALENDAR_WEEKS}-Week Calendar
                </Text>
                <TouchableOpacity
                    onPress={() => setMode("agenda")}
                    style={styles.modeButton}
                >
                    <Text style={styles.modeButtonText}>Agenda</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                contentContainerStyle={styles.weekRow}
                showsHorizontalScrollIndicator={false}
            >
                {days.map((d) => renderDayColumn(d))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fafafa",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modeButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#007AFF",
        borderRadius: 6,
    },
    modeButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    weekRow: {
        paddingVertical: 12,
    },
    dayColumn: {
        width: 260,
        minHeight: 300,
        borderRightWidth: 1,
        borderRightColor: "#f0f0f0",
        padding: 8,
    },
    dayHeader: {
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dayHeaderText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    dayBody: {
        marginTop: 8,
        maxHeight: 520,
    },
    calendarTask: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f6f6f6",
    },
    taskTime: {
        width: 70,
        color: "#666",
        fontSize: 12,
        marginRight: 8,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: "500",
    },
    taskDescription: {
        fontSize: 13,
        color: "#666",
    },
    emptyText: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginTop: 12,
    },
    agendaDay: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    agendaDayHeader: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    agendaTask: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
});
