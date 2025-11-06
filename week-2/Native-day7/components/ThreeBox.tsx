import React from 'react';
import { View, StyleSheet } from 'react-native';

const ColoredBoxes = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.redBox]} />
      <View style={[styles.box, styles.blueBox]} />
      <View style={[styles.box, styles.greenBox]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 80,
    height: 80,
    margin: 10,
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
});

export default ColoredBoxes;