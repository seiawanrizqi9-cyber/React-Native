import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

type FlexDirection = 'row' | 'column' | 'row-reverse';
type JustifyContent = 'flex-start' | 'center' | 'space-between';
type AlignItems = 'flex-start' | 'center' | 'stretch';

const FlexboxPlayground = () => {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('column');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Flexbox Playground</Text>
        <Text style={styles.subtitle}>Experiment with Flexbox Layouts</Text>
      </View>
      
      {/* Playground Area */}
      <View style={styles.playgroundContainer}>
        <View style={styles.playgroundCard}>
          <Text style={styles.playgroundTitle}>Flex Container</Text>
          <View style={[
            styles.flexContainer, 
            { flexDirection, justifyContent, alignItems }
          ]}>
            <View style={[styles.box, styles.redBox]}>
              <Text style={styles.boxText}>1</Text>
            </View>
            <View style={[styles.box, styles.blueBox]}>
              <Text style={styles.boxText}>2</Text>
            </View>
            <View style={[styles.box, styles.greenBox]}>
              <Text style={styles.boxText}>3</Text>
            </View>
          </View>
        </View>
        
        {/* Current Settings Display */}
        <View style={styles.settingsDisplay}>
          <Text style={styles.settingsText}>
            flexDirection: <Text style={styles.settingsValue}>{flexDirection}</Text>
          </Text>
          <Text style={styles.settingsText}>
            justifyContent: <Text style={styles.settingsValue}>{justifyContent}</Text>
          </Text>
          <Text style={styles.settingsText}>
            alignItems: <Text style={styles.settingsValue}>{alignItems}</Text>
          </Text>
        </View>
      </View>

      {/* Controls Section */}
      <ScrollView style={styles.controlsContainer} showsVerticalScrollIndicator={false}>
        <ControlGroup 
          title="flexDirection"
          values={['row', 'column', 'row-reverse'] as FlexDirection[]}
          currentValue={flexDirection}
          onValueChange={setFlexDirection}
          color="#6366F1"
        />
        
        <ControlGroup 
          title="justifyContent"
          values={['flex-start', 'center', 'space-between'] as JustifyContent[]}
          currentValue={justifyContent}
          onValueChange={setJustifyContent}
          color="#10B981"
        />
        
        <ControlGroup 
          title="alignItems"
          values={['flex-start', 'center', 'stretch'] as AlignItems[]}
          currentValue={alignItems}
          onValueChange={setAlignItems}
          color="#F59E0B"
        />
      </ScrollView>
    </View>
  );
};

interface ControlGroupProps<T extends string> {
  title: string;
  values: T[];
  currentValue: T;
  onValueChange: (value: T) => void;
  color: string;
}

const ControlGroup = <T extends string>({ 
  title, 
  values, 
  currentValue, 
  onValueChange,
  color
}: ControlGroupProps<T>) => (
  <View style={styles.controlGroup}>
    <Text style={styles.controlGroupTitle}>{title}</Text>
    <View style={styles.buttonGroup}>
      {values.map(value => (
        <TouchableOpacity
          key={value}
          style={[
            styles.button,
            { borderColor: color + '40' },
            currentValue === value && [styles.activeButton, { backgroundColor: color }]
          ]}
          onPress={() => onValueChange(value)}
        >
          <Text style={[
            styles.buttonText,
            { color: color },
            currentValue === value && styles.activeButtonText
          ]}>
            {value.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#0F172A',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  playgroundContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  playgroundCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#020617',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  playgroundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 16,
    textAlign: 'center',
  },
  flexContainer: {
    minHeight: 200,
    borderWidth: 3,
    borderColor: '#374151',
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  box: {
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  redBox: {
    backgroundColor: '#EF4444',
  },
  blueBox: {
    backgroundColor: '#3B82F6',
  },
  greenBox: {
    backgroundColor: '#10B981',
  },
  settingsDisplay: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#6366F1',
    shadowColor: '#020617',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  settingsText: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 6,
    fontWeight: '500',
  },
  settingsValue: {
    color: '#F1F5F9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  controlsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  controlGroup: {
    marginBottom: 30,
  },
  controlGroupTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    color: '#F1F5F9',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  activeButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default FlexboxPlayground;