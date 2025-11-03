import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ProfileImage = () => {
  return (
    <Image
      source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
      style={styles.image}
    />
  );
};

const styles = StyleSheet.create({
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
});

export default ProfileImage;
