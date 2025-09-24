import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '@/store';
import { Task } from '@/types';

export const HabitScreen = () => {
  const { tasks, toggleTaskComplete } = useAppStore();
  const habits = tasks.filter((task: Task) => task.isHabit);

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => toggleTaskComplete(item.id)}>
      <View style={[styles.habitItem, item.completedAt && styles.completedHabit]}>
        <Text style={[styles.habitTitle, item.completedAt && styles.completedText]}>
          {item.title}
        </Text>
        {item.habitConfig && (
          <Text style={[styles.habitDetails, item.completedAt && styles.completedText]}>
            Streak: {item.habitConfig.streak}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Habits</Text>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No habits yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  habitItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  completedHabit: {
    backgroundColor: '#e0e0e0',
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  habitDetails: {
    fontSize: 14,
    color: '#666',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
