import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import { colors } from '../color/colors';
import { useAuth } from '../utils/useAuth';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../navigation/types';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ImagePickerService from '../utils/imagePickerService';
import UploadProgress from '../components/UploadProgress';
import UploadService, { UploadProgress as UploadProgressType } from '../utils/uploadService';
import { useBiometric } from '../utils/useBiometric';
import { biometricService } from '../utils/biometricService';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

const LoginPrompt: React.FC<{ onLoginPress: () => void }> = ({ onLoginPress }) => (
  <View style={styles.loginPromptContainer}>
    <View style={styles.avatar}>
      <FontAwesome6 name="circle-user" size={60} color={colors.textLight} />
    </View>
    <Text style={styles.loginTitle}>Not Logged In</Text>
    <Text style={styles.loginSubtitle}>
      Login to access your profile and full features
    </Text>
    <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
      <Text style={styles.loginButtonText}>🚪 Login to Account</Text>
    </TouchableOpacity>
  </View>
);

const ProfileContent: React.FC<{
  user: any;
  onLogout: () => Promise<{success: boolean; message: string}>;
  onEditProfile: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  fromDeepLink?: boolean;
  deepLinkUserId?: string;
  validationError?: string;
}> = ({ 
  user, 
  onLogout, 
  onEditProfile, 
  onRefresh, 
  refreshing, 
  fromDeepLink,
  deepLinkUserId,
  validationError 
}) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isTakingKTPPhoto, setIsTakingKTPPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    visible: boolean;
    currentFile: number;
    totalFiles: number;
    progress: number;
    fileName: string;
    overallProgress: number;
  }>({
    visible: false,
    currentFile: 1,
    totalFiles: 1,
    progress: 0,
    fileName: '',
    overallProgress: 0,
  });
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const { biometryType, biometricAvailable } = useBiometric();

  const userStats = {
    orders: user?.orders || 15,
    favorites: user?.favorites || 8,
    discounts: user?.discounts || 12,
    memberSince: user?.memberSince || new Date().getFullYear() - 2,
  };

  // ✅ AUTO REFRESH: Load data ketika screen focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ProfileScreen focused - refreshing data');
      onRefresh();
    }, [onRefresh])
  );

  const handleShowSensitiveData = async () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Konfirmasi Akses',
        'Tampilkan data sensitif profil?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Tampilkan', 
            style: 'default',
            onPress: () => setShowSensitiveData(true)
          },
        ]
      );
      return;
    }

    try {
      const result = await biometricService.promptBiometricLogin();
      
      if (result.success) {
        setShowSensitiveData(true);
        console.log('✅ Biometric verified for sensitive data access');
      } else {
        Alert.alert(
          'Akses Ditolak',
          result.error || 'Autentikasi gagal. Data sensitif tidak dapat ditampilkan.',
          [{ text: 'Mengerti' }]
        );
      }
    } catch (error) {
      console.error('❌ Biometric verification error:', error);
      Alert.alert('Error', 'Gagal memverifikasi akses');
    }
  };

  const handleLogoutWithConfirmation = useCallback(() => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout? This will:\n\n• Clear your cart and wishlist\n• Remove your personal data\n• Require login to access protected features',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        {
          text: 'Logout Now',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const result = await onLogout();
              if (!result.success) {
                Alert.alert('Logout Warning', result.message);
              }
            } catch (error) {
              Alert.alert('Logout Error', 'An unexpected error occurred during logout');
            } finally {
              setIsLoggingOut(false);
            }
          }
        },
      ],
      { cancelable: true }
    );
  }, [onLogout]);

  // Handle KTP photo backup with upload
  const handleTakeKTPPhoto = useCallback(async () => {
    setIsTakingKTPPhoto(true);
    try {
      console.log('🆔 Starting KTP photo process...');
      const result = await ImagePickerService.takeKTPPhotoForBackup();
      
      if (result.success && result.assets && result.assets.length > 0) {
        const ktpPhoto = result.assets[0];
        console.log('✅ KTP photo taken successfully, starting upload...');
        
        // Show upload progress
        setUploadProgress({
          visible: true,
          currentFile: 1,
          totalFiles: 1,
          progress: 0,
          fileName: ktpPhoto.fileName || 'KTP_Photo.jpg',
          overallProgress: 0,
        });

        // Upload the KTP photo
        const uploadResult = await UploadService.uploadFileWithProgress(
          ktpPhoto.uri!,
          ktpPhoto.fileName || 'KTP_Photo.jpg',
          (progress: UploadProgressType) => {
            setUploadProgress(prev => ({
              ...prev,
              progress: progress.percentage,
            }));
          },
          {
            quality: 0.7,
            maxWidth: 800,
            maxHeight: 800,
          }
        );

        // Hide progress modal
        setUploadProgress(prev => ({ ...prev, visible: false }));

        if (uploadResult.success) {
          UploadService.showUploadSuccess('Foto KTP berhasil diupload dan disimpan');
          console.log('✅ KTP photo uploaded successfully');
        } else {
          UploadService.showUploadError(uploadResult.error || 'Gagal mengupload foto KTP');
          console.error('❌ KTP photo upload failed:', uploadResult.error);
        }
      } else if (result.error) {
        console.error('❌ KTP photo error:', result.error);
        if (result.errorCode !== 'User cancelled camera') {
          Alert.alert('Gagal Mengambil Foto', result.error, [{ text: 'OK', style: 'default' }]);
        }
      }
    } catch (error: any) {
      console.error('KTP photo process error:', error);
      setUploadProgress(prev => ({ ...prev, visible: false }));
      Alert.alert('Error', 'Gagal mengambil foto KTP. Silakan coba lagi.', [{ text: 'OK', style: 'default' }]);
    } finally {
      setIsTakingKTPPhoto(false);
    }
  }, []);

  // Handle multiple product photos upload
  const handleUploadProductPhotos = useCallback(async () => {
    try {
      console.log('🖼️ Starting product photos upload...');
      const uploadResult = await ImagePickerService.selectMultipleProductImages(5);
      
      if (uploadResult.success && uploadResult.assets && uploadResult.assets.length > 0) {
        console.log(`✅ Selected ${uploadResult.assets.length} photos, starting upload...`);
        
        // Show upload progress for multiple files
        setUploadProgress({
          visible: true,
          currentFile: 1,
          totalFiles: uploadResult.assets.length,
          progress: 0,
          fileName: uploadResult.assets[0].fileName || 'product_photo_1.jpg',
          overallProgress: 0,
        });

        // Upload all photos
        const uploadResults = await UploadService.uploadMultipleFiles(
          uploadResult.assets.map((asset, index) => ({
            uri: asset.uri!,
            fileName: asset.fileName || `product_photo_${index + 1}.jpg`,
          })),
          (progress) => {
            setUploadProgress({
              visible: true,
              currentFile: progress.currentFile,
              totalFiles: progress.totalFiles,
              progress: progress.fileProgress.percentage,
              fileName: uploadResult.assets![progress.currentFile - 1]?.fileName || `product_photo_${progress.currentFile}.jpg`,
              overallProgress: progress.overallProgress,
            });
          }
        );

        // Hide progress modal
        setUploadProgress(prev => ({ ...prev, visible: false }));

        const successfulUploads = uploadResults.filter(result => result.success).length;
        
        if (successfulUploads > 0) {
          UploadService.showUploadSuccess(
            `${successfulUploads} dari ${uploadResult.assets.length} foto produk berhasil diupload`
          );
          console.log(`✅ ${successfulUploads} product photos uploaded successfully`);
        } else {
          UploadService.showUploadError('Gagal mengupload foto produk');
          console.error('❌ All product photo uploads failed');
        }
      } else if (uploadResult.error) {
        console.error('❌ Product photos selection error:', uploadResult.error);
        if (uploadResult.errorCode !== 'User cancelled image selection') {
          Alert.alert('Gagal Memilih Foto', uploadResult.error, [{ text: 'OK', style: 'default' }]);
        }
      }
    } catch (error: any) {
      console.error('Product photos upload error:', error);
      setUploadProgress(prev => ({ ...prev, visible: false }));
      Alert.alert('Error', 'Gagal mengupload foto produk. Silakan coba lagi.', [{ text: 'OK', style: 'default' }]);
    }
  }, []);

  // Tampilkan error jika ada validasi error dari deep link
  if (validationError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Profile Not Found</Text>
          <Text style={styles.errorMessage}>
            {validationError}
          </Text>
          {deepLinkUserId && (
            <Text style={styles.userIdText}>ID: {deepLinkUserId}</Text>
          )}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                (parent as any).navigate('Home');
              }
            }}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Upload Progress Modal */}
      <UploadProgress
        visible={uploadProgress.visible}
        currentFile={uploadProgress.currentFile}
        totalFiles={uploadProgress.totalFiles}
        progress={uploadProgress.progress}
        fileName={uploadProgress.fileName}
        overallProgress={uploadProgress.overallProgress}
      />

      {fromDeepLink && (
        <View style={styles.deepLinkIndicator}>
          <Text style={styles.deepLinkText}>🔗 Opened from Deep Link</Text>
          {deepLinkUserId && (
            <Text style={styles.deepLinkUserId}>User ID: {deepLinkUserId}</Text>
          )}
        </View>
      )}

      {/* HEADER DIPINDAH KE SINI - TIDAK PAKAI HEADER DARI NAVIGATION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile 👤</Text>
        <Text style={styles.headerSubtitle}>Manage your account information</Text>
        
        {/* Biometric Status Indicator */}
        {biometricAvailable && (
          <View style={styles.biometricStatus}>
            <Text style={styles.biometricStatusIcon}>
              {biometryType === 'FaceID' ? '👁️' : '👆'}
            </Text>
            <Text style={styles.biometricStatusText}>
              {biometryType === 'FaceID' ? 'Face ID' : 'Touch ID'} Ready
            </Text>
          </View>
        )}
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0).toUpperCase() || 
                 user?.username?.charAt(0).toUpperCase() || 
                 'U'}
              </Text>
            </View>
          )}
          <Text style={styles.userName}>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.username || 'User'
            }
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
          <Text style={styles.userUsername}>@{user?.username || 'username'}</Text>
          
          {fromDeepLink && deepLinkUserId && (
            <Text style={styles.deepLinkUserInfo}>
              🔗 Accessed from: {deepLinkUserId}
            </Text>
          )}
          {refreshing && (
            <Text style={styles.refreshingText}>Updating data...</Text>
          )}
        </View>

        {/* ✅ SENSITIVE DATA SECTION DENGAN BIOMETRIC PROTECTION */}
        <View style={styles.sensitiveDataSection}>
          <Text style={styles.sectionTitle}>Data Sensitif</Text>
          
          {!showSensitiveData ? (
            <TouchableOpacity 
              style={styles.revealDataButton}
              onPress={handleShowSensitiveData}
            >
              <FontAwesome6 
                name={biometricAvailable ? "fingerprint" : "eye"} 
                size={20} 
                color={colors.textOnPrimary} 
              />
              <Text style={styles.revealDataButtonText}>
                {biometricAvailable ? 
                  `Verifikasi ${biometryType === 'FaceID' ? 'Wajah' : 'Jari'} untuk Lihat Data` :
                  'Tampilkan Data Sensitif'
                }
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sensitiveDataContent}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nomor Telepon</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Tidak tersedia'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Alamat</Text>
                <Text style={styles.infoValue}>{user?.address || 'Tidak tersedia'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tanggal Lahir</Text>
                <Text style={styles.infoValue}>{user?.birthDate || 'Tidak tersedia'}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.hideDataButton}
                onPress={() => setShowSensitiveData(false)}
              >
                <Text style={styles.hideDataButtonText}>Sembunyikan Data</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* KTP Backup Section */}
        <View style={styles.ktpSection}>
          <Text style={styles.sectionTitle}>Verifikasi KTP</Text>
          <Text style={styles.ktpDescription}>
            Ambil foto KTP untuk verifikasi akun dan backup keamanan
          </Text>
          
          <TouchableOpacity
            style={[
              styles.ktpButton,
              isTakingKTPPhoto && styles.ktpButtonDisabled
            ]}
            onPress={handleTakeKTPPhoto}
            disabled={isTakingKTPPhoto}
          >
            {isTakingKTPPhoto ? (
              <Text style={styles.ktpButtonText}>
                <Text style={styles.loadingSpinner}>⟳</Text> Memproses...
              </Text>
            ) : (
              <Text style={styles.ktpButtonText}>
                📷 Ambil Foto KTP & Backup
              </Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.ktpNote}>
            • Foto akan diupload dan disimpan ke galeri sebagai backup{'\n'}
            • Data KTP hanya untuk verifikasi keamanan{'\n'}
            • Proses ini opsional namun dianjurkan
          </Text>
        </View>

        {/* Product Photos Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Foto Produk</Text>
          <Text style={styles.uploadDescription}>
            Upload foto produk Anda dengan progress indicator
          </Text>
          
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadProductPhotos}
          >
            <Text style={styles.uploadButtonText}>
              🖼️ Upload Foto Produk (Maks 5)
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.uploadNote}>
            • Support upload multiple files dengan progress bar{'\n'}
            • File akan dikompresi untuk optimasi kualitas{'\n'}
            • Progress real-time selama proses upload
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.username || 'Not set'
              }
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>@{user?.username || 'Not set'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>
              #{user?.id || 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
            onPress={handleLogoutWithConfirmation}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Text style={styles.logoutButtonText}>🔄 Logging Out...</Text>
            ) : (
              <Text style={styles.logoutButtonText}>🚪 Logout</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.favorites}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.discounts}</Text>
              <Text style={styles.statLabel}>Discounts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.memberSince}</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
          </View>
        </View>

        <View style={styles.additionalInfo}>
          <Text style={styles.additionalInfoTitle}>Account Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>✅ Active</Text>
          </View>
          <Text style={styles.memberSince}>
            Member since: {userStats.memberSince}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default function ProfileScreen() {
  const { 
    isLoggedIn, 
    user, 
    logout, 
    loadAuthData, 
    validateUserId,
    getUserById 
  } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRedirectToCheckout, setShouldRedirectToCheckout] = useState(false);
  const [deepLinkParams, setDeepLinkParams] = useState<{
    fromDeepLink?: boolean;
    deepLinkUserId?: string;
    validationError?: string;
  }>({});

  // Handle deep link parameters
  useEffect(() => {
    const params = route.params as any;
    
    if (params?.fromDeepLink && params?.deepLinkUserId) {
      console.log('ProfileScreen - Deep link detected:', params.deepLinkUserId);
      
      // Validasi userId dari deep link
      const validationResult = validateUserId(params.deepLinkUserId);
      
      if (validationResult.success && validationResult.userId) {
        // User valid, load user data
        const userData = getUserById(validationResult.userId);
        if (userData) {
          console.log('User data loaded from deep link:', userData);
          setDeepLinkParams({
            fromDeepLink: true,
            deepLinkUserId: validationResult.userId
          });
        }
      } else {
        // User tidak valid, tampilkan error
        setDeepLinkParams({
          fromDeepLink: true,
          deepLinkUserId: params.deepLinkUserId,
          validationError: validationResult.error
        });
      }
    } else {
      // Reset deep link params jika bukan dari deep link
      setDeepLinkParams({});
    }
  }, [route.params, validateUserId, getUserById]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 Manual refresh profile data');
    await loadAuthData();
    setRefreshing(false);
  }, [loadAuthData]);

  const handleLoginPress = useCallback(() => {
    setShouldRedirectToCheckout(true);
    
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('Login');
    } else {
      Alert.alert('Error', 'Cannot open login page');
    }
  }, [navigation]);

  const handleEditProfile = useCallback(() => {
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
  }, []);

  useEffect(() => {
    console.log('👤 ProfileScreen State:', {
      isLoggedIn,
      user: user ? `${user.firstName} ${user.lastName} (${user.username})` : 'null',
      refreshing,
      shouldRedirectToCheckout,
      deepLinkParams
    });
  }, [isLoggedIn, user, refreshing, shouldRedirectToCheckout, deepLinkParams]);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <LoginPrompt onLoginPress={handleLoginPress} />
      </View>
    );
  }

  return (
    <ProfileContent
      user={user}
      onLogout={logout}
      onEditProfile={handleEditProfile}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      fromDeepLink={deepLinkParams.fromDeepLink}
      deepLinkUserId={deepLinkParams.deepLinkUserId}
      validationError={deepLinkParams.validationError}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  deepLinkIndicator: {
    backgroundColor: colors.primary + '20',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '40',
  },
  deepLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  deepLinkUserId: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  deepLinkUserInfo: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  userIdText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  biometricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  biometricStatusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  biometricStatusText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4b4b4bff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  refreshingText: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 8,
  },
  sensitiveDataSection: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  revealDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  revealDataButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sensitiveDataContent: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
  },
  hideDataButton: {
    backgroundColor: colors.textLight + '20',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  hideDataButtonText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  // KTP Section Styles
  ktpSection: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  ktpDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 18,
  },
  ktpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  ktpButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  ktpButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingSpinner: {
    fontSize: 16,
  },
  ktpNote: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 14,
  },
  // Upload Section Styles
  uploadSection: {
    backgroundColor: colors.accent + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 18,
  },
  uploadButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadNote: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.error + '15',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
    alignItems: 'center',
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.success + '40',
    marginBottom: 8,
  },
  statusText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 12,
    color: colors.textLight,
  },
});