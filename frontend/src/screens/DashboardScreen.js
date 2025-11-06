import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { strategiesAPI } from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await strategiesAPI.getUserStrategies();
      setStrategies(response.data);
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  const renderStrategy = ({ item }) => (
    <View style={styles.strategyCard}>
      <Text style={styles.strategyTitle}>Strategy #{item.id}</Text>
      <Text>Expected Profit: ${item.expected_profit || 'N/A'}</Text>
      <Text>Expected Loss: ${item.expected_loss || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('StrategyBuilder')}
      >
        <Text style={styles.buttonText}>Build New Strategy</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Strategies</Text>
      <FlatList
        data={strategies}
        renderItem={renderStrategy}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  strategyCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});