import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { strategiesAPI } from '../services/api';

export default function StrategyBuilderScreen({ navigation }) {
  const [strategy, setStrategy] = useState({
    stock: '',
    expectedProfit: '',
    expectedLoss: '',
    notes: '',
  });

  const handleSave = async () => {
    try {
      await strategiesAPI.createStrategy({
        expected_profit: parseFloat(strategy.expectedProfit) || null,
        expected_loss: parseFloat(strategy.expectedLoss) || null,
        notes: strategy.notes,
      });
      Alert.alert('Success', 'Strategy saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save strategy');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Strategy Builder</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Stock Symbol"
        value={strategy.stock}
        onChangeText={(text) => setStrategy({...strategy, stock: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Expected Profit"
        value={strategy.expectedProfit}
        onChangeText={(text) => setStrategy({...strategy, expectedProfit: text})}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Expected Loss"
        value={strategy.expectedLoss}
        onChangeText={(text) => setStrategy({...strategy, expectedLoss: text})}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes"
        value={strategy.notes}
        onChangeText={(text) => setStrategy({...strategy, notes: text})}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Strategy</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});