import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { JwtPayload } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Profile = () => {
  const { signOut, accessToken } = useAuth();
  const { colors, isDark } = useTheme();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const user = useMemo(() => {
    if (!accessToken) return { id: '', username: '', email: '', isAdmin: false };
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '',
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? '',
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? '',
        isAdmin: decoded.isAdmin === true || decoded.isAdmin === 'true',
      };
    } catch {
      return { id: '', username: '', email: '', isAdmin: false };
    }
  }, [accessToken]);

  

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAvatarUri(asset.uri);
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', { uri: asset.uri, name: `avatar_${user.id}.jpg`, type: 'image/jpeg' } as any);
      const response = await fetch(`${API_URL}/User/avatar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.message ?? "Upload thất bại");
        setAvatarUri(null);
        return;
      }
      setAvatarUri(data.avatarUrl);
      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện");
    } catch {
      setAvatarUri(null);
      Alert.alert("Error", "Not connected to server");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadAvatar = async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${API_URL}/User/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (data.avatarUrl) setAvatarUri(data.avatarUrl);
      } catch (e) {
        console.log('No loaded avatar', e);
      }
    };
    loadAvatar();
  }, [accessToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>

      {/* Avatar + Info */}
      <View style={{ alignItems: 'center', paddingVertical: 32 }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: avatarUri ?? DEFAULT_AVATAR }}
            style={{ width: 104, height: 104, borderRadius: 52,
              borderWidth: 3, borderColor: isDark ? '#374151' : '#E5E7EB' }}
          />
          <TouchableOpacity
            onPress={handleChangeAvatar}
            disabled={uploading}
            style={{ position: 'absolute', bottom: 0, right: 0,
              backgroundColor: '#2563EB', borderRadius: 999, padding: 7,
              borderWidth: 2, borderColor: colors.bgPage }}
          >
            <Ionicons name="camera" size={15} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 14 }}>
          {user.username}
        </Text>
        <Text style={{ color: colors.textMuted, marginTop: 4, fontSize: 14 }}>
          {user.email}
        </Text>
        {user.isAdmin && (
          <View style={{ marginTop: 8, backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE',
            paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
            <Text style={{ color: isDark ? '#60A5FA' : '#2563EB', fontSize: 12, fontWeight: '600' }}>
              Admin
            </Text>
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {[
          { icon: 'heart-outline',         label: 'Saved Properties', onPress: () => router.push('/(root)/(tabs)/saved') },
          { icon: 'notifications-outline', label: 'Notifications',    onPress: () => Alert.alert('Coming Soon') },
          { icon: 'settings-outline',      label: 'Settings',         onPress: () => router.push('/(root)/profile/settings') },
          { icon: 'help-circle-outline',   label: 'Help & Support',   onPress: () => Linking.openURL('mailto:support@example.com') },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={item.onPress}
            style={{ flexDirection: 'row', alignItems: 'center',
              backgroundColor: colors.bgCard, paddingHorizontal: 16,
              paddingVertical: 14, borderRadius: 16,
              borderWidth: 1, borderColor: colors.border }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 12,
              backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Ionicons name={item.icon as any} size={20} color={colors.iconColor} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.text }}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Profile;