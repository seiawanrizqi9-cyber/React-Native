import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../color/colors';
import { useWishlist } from '../utils/useWishlist';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/types';

type WishlistIndicatorNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const WishlistIndicator: React.FC = () => {
  const { meta, isLoading } = useWishlist();
  const navigation = useNavigation<WishlistIndicatorNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Wishlist');
  };

  if (isLoading || meta.count === 0) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <FontAwesome6 name="heart" size={20} color={colors.error} solid />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {meta.count > 99 ? '99+' : meta.count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textOnPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default WishlistIndicator;