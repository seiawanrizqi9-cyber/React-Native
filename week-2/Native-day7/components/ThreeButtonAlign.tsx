import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type AlignItems = 'flex-start' | 'center' | 'stretch';

const AlignItemsControls = () => {
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');

  return (
    <View style={styles.container}>
      <View style={[styles.flexContainer, { alignItems }]}>
        <View style={[styles.box, styles.redBox]} />
        <View style={[styles.box, styles.blueBox]} />
        <View style={[styles.box, styles.greenBox]} />
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[
            styles.button, 
            alignItems === 'flex-start' && styles.activeButton
          ]}
          onPress={() => setAlignItems('flex-start')}
        >
          <Text style={[
            styles.buttonText,
            alignItems === 'flex-start' && styles.activeButtonText
          ]}>
            Flex Start
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            alignItems === 'center' && styles.activeButton
          ]}
          onPress={() => setAlignItems('center')}
        >
          <Text style={[
            styles.buttonText,
            alignItems === 'center' && styles.activeButtonText
          ]}>
            Center
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            alignItems === 'stretch' && styles.activeButton
          ]}
          onPress={() => setAlignItems('stretch')}
        >
          <Text style={[
            styles.buttonText,
            alignItems === 'stretch' && styles.activeButtonText
          ]}>
            Stretch
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
    marginHorizontal: 5,
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
    backgroundColor: '#FF9500',
    borderColor: '#FF9500',
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

export default AlignItemsControls;