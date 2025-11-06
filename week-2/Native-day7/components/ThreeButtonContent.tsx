import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type JustifyContent = 'flex-start' | 'center' | 'space-between';

const JustifyContentControls = () => {
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');

  return (
    <View style={styles.container}>
      <View style={[styles.flexContainer, { justifyContent }]}>
        <View style={[styles.box, styles.redBox]} />
        <View style={[styles.box, styles.blueBox]} />
        <View style={[styles.box, styles.greenBox]} />
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[
            styles.button, 
            justifyContent === 'flex-start' && styles.activeButton
          ]}
          onPress={() => setJustifyContent('flex-start')}
        >
          <Text style={[
            styles.buttonText,
            justifyContent === 'flex-start' && styles.activeButtonText
          ]}>
            Flex Start
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            justifyContent === 'center' && styles.activeButton
          ]}
          onPress={() => setJustifyContent('center')}
        >
          <Text style={[
            styles.buttonText,
            justifyContent === 'center' && styles.activeButtonText
          ]}>
            Center
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            justifyContent === 'space-between' && styles.activeButton
          ]}
          onPress={() => setJustifyContent('space-between')}
        >
          <Text style={[
            styles.buttonText,
            justifyContent === 'space-between' && styles.activeButtonText
          ]}>
            Space Between
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
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    padding: 10,
    marginBottom: 20,
  },
  box: {
    width: 60,
    height: 60,
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
    backgroundColor: '#34C759',
    borderColor: '#34C759',
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

export default JustifyContentControls;