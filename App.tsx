import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TaskScreen } from './src/features/tasks/TaskScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TaskScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
