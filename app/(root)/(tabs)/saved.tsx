import { useAuth } from '@/context/AuthContext';
import { SavedItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Saved = () => {
  const {accessToken} = useAuth();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaved = useCallback(async () => {
    if(!accessToken) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/Saved`, {
        method: 'GET',
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if(!response.ok) {
        throw new Error(`Lỗi ${response.status} : ${response.statusText}`);
      }
      const data: SavedItem[] = await response.json();
      setSaved(data);
    } catch (error:any) {
      setError(error.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchSaved()
  }, [fetchSaved])

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSaved();
  };

  const handleUnsave = async (savedId: string) => {
    // Optimistic update
    setSaved((prev) => prev.filter((item) => item.id !== savedId));

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/Saved/${savedId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Xóa thất bại');
    } catch {
      // Rollback nếu API thất bại
      fetchSaved();
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" />
        <Text className="text-lg font-bold text-gray-800 mt-4">Đã xảy ra lỗi</Text>
        <Text className="text-gray-500 text-center mt-2">{error}</Text>
        <TouchableOpacity
          onPress={() => { setLoading(true); fetchSaved(); }}
          className="bg-blue-600 px-6 py-3 rounded-2xl mt-6"
        >
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
  <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-4">
        <Text className="text-2xl font-bold text-gray-900">Saved Properties</Text>
        <Text className="text-sm text-gray-500 mt-1">{saved.length} properties saved</Text>
      </View>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563EB" />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl overflow-hidden mb-5">
            <Image
              source={{ uri: item.property.images[0] }}
              className="w-full h-52"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                    {item.property.title}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    {item.property.address}, {item.property.city}
                  </Text>
                  <Text className="text-blue-600 font-bold mt-3">
                    ${item.property.price.toLocaleString()}
                  </Text>
                  <View className="flex-row gap-3 mt-2">
                    <Text className="text-gray-400 text-xs">🛏 {item.property.bedrooms} beds</Text>
                    <Text className="text-gray-400 text-xs">🚿 {item.property.bathrooms} baths</Text>
                    <Text className="text-gray-400 text-xs">📐 {item.property.area_sqft} sqft</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleUnsave(item.id)}
                  className="w-10 h-10 bg-red-50 rounded-full items-center justify-center"
                >
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
              <Ionicons name="heart-outline" size={36} color="#EF4444" />
            </View>
            <Text className="text-lg font-bold text-gray-800">No saved properties</Text>
            <Text className="text-gray-500 text-center mt-2 px-10">
              Properties you save will appear here.
            </Text>
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-2xl mt-6">
              <Text className="text-white font-semibold">Browse Properties</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default Saved

