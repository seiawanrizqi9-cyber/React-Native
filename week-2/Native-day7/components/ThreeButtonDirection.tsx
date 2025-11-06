import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type FlexDirection = 'row' | 'column' | 'row-reverse';

const FlexDirectionControls = () => {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('column');

  return (
    <View style={styles.container}>
      <View style={[styles.flexContainer, { flexDirection }]}>
        <View style={[styles.box, styles.redBox]} />
        <View style={[styles.box, styles.blueBox]} />
        <View style={[styles.box, styles.greenBox]} />
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[
            styles.button, 
            flexDirection === 'row' && styles.activeButton
          ]}
          onPress={() => setFlexDirection('row')}
        >
          <Text style={[
            styles.buttonText,
            flexDirection === 'row' && styles.activeButtonText
          ]}>
            Row
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            flexDirection === 'column' && styles.activeButton
          ]}
          onPress={() => setFlexDirection('column')}
        >
          <Text style={[
            styles.buttonText,
            flexDirection === 'column' && styles.activeButtonText
          ]}>
            Column
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            flexDirection === 'row-reverse' && styles.activeButton
          ]}
          onPress={() => setFlexDirection('row-reverse')}
        >
          <Text style={[
            styles.buttonText,
            flexDirection === 'row-reverse' && styles.activeButtonText
          ]}>
            Row Reverse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  flexContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    padding: 10,
    marginBottom: 20,
  },
  box: {
    width: 60,
    height: 60,
    margin: 5,
  },
  redBox: {
    backgroundColor: '#FF6B6B',
  },
  blueBox: {
    backgroundColor: '#4ECDC4',
  },
  greenBox: {
    backgroundColor: '#45B7D1',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});

export default FlexDirectionControls;