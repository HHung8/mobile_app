import { useAuth } from '@/context/AuthContext';
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
  const handleSignOut = () => { signOut() }

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,   // crop hình vuông
      aspect: [1, 1],
      quality: 0.8,
    })

    if (result.canceled) return;
    const asset = result.assets[0];
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: `avatar_${user.id}.jpg`,
        type: 'image/jpeg'
      } as any);

      const response = await fetch(`${API_URL}/User/avatar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData
      });
      const data = await response.json();
      console.log(`check data upaload file`, data)
      if (!response.ok) {
        Alert.alert("Error", data.message ?? "Upload thất bại");
        return;
      }
      setAvatarUri(data.avatarUrl);
      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện");
      console.log('avatarUri:', avatarUri);
      console.log('Image source:', avatarUri ?? DEFAULT_AVATAR);
    } catch (error) {
      setUploading(false);
      Alert.alert("Error", "Not connected to server");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadAvatar = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch(`${API_URL}/User/me`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`check response load Avatar`, response);
        const data = await response.json();
        console.log(`check response conevert json`, data);
        if(data.avatarUrl) {
          setAvatarUri(data.avatarUrl);
        }
      } catch (error) {
        console.log(`No loaded data avatar`, error);
      }
    };
    loadAvatar();
  }, [accessToken])

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Avartar + info */}
      <View className='items-center py-8'>
        <View className='relative'>
          <Image source={{ uri: avatarUri ?? DEFAULT_AVATAR }} className='w-28 h-28 rounded-full' />
          <TouchableOpacity
            onPress={handleChangeAvatar}
            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-bold text-gray-900 mt-4">{user.username}</Text>
        <Text className='text-gray-500 mt-1'>{user.email}</Text>
        {
          user.isAdmin && (
            <View className='mt-2 bg-blue-100 px-3 py-1 rounded-full'>
              <Text className='text-blue-600 text-xs font-semibold'>Admin</Text>
            </View>
          )
        }
      </View>

      {/* Menu */}
      <View className="px-5 gap-3">
        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() => router.push("/(root)/(tabs)/saved")}
        />

        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => Alert.alert("Coming Soon", "Notifications coming soon!")}
        />

        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => Alert.alert("Coming Soon", "Setting coming soon!")}
        />

        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() =>
            Linking.openURL("mailto:piyushagarwalvo@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App")
          }
        />
      </View>
      <View className="px-5 mt-auto mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center bg-gray-50 px-4 py-4 rounded-2xl"
        >
          <Ionicons name="log-out-outline" size={22} color="#6B7280" />
          <Text className='text-red-500 font-semibold ml-2'>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-gray-50 px-4 py-4 rounded-2xl"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 ml-4 text-base font-medium text-gray-700">{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#6B7280" />
    </TouchableOpacity>
  )

}

export default Profile