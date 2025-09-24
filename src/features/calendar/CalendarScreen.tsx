import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/store';
import { Task } from '@/types';

export const CalendarScreen = () => {
  const { selectedDate, tasks } = useAppStore();
  const tasksForSelectedDate = tasks.filter((task: Task) => 
    task.scheduledAt && new Date(task.scheduledAt).toDateString() === selectedDate.toDateString()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <Text style={styles.dateHeader}>{selectedDate.toDateString()}</Text>
      {tasksForSelectedDate.length > 0 ? (
        tasksForSelectedDate.map((task: Task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No tasks for this day.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
