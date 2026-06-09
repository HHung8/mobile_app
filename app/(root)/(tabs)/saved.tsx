import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/context/AuthContext';
import { SavedProperty } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Saved = () => {
  const {accessToken} = useAuth();
  const [saved, setSaved] = useState<SavedProperty[]>([]);
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
      const data: SavedProperty[] = await response.json();
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

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
            <Text className='text-2xl font-bold text-gray-900'>Saved</Text>
            {!loading && (
              <Text className='text-sm text-gray-400 mt-1'>
                  {saved.length} {saved.length === 1 ? "property" : "properties"} saved
              </Text>
            )}
        </View>    
            {loading ? (
              <View className='flex-1 items-center justify-center'>
                  <ActivityIndicator size="large" color="#2563EB" />
              </View>
            ) : (
              <FlatList
                data={saved}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{padding: 20, paddingBottom: 100}}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                 <PropertyCard 
                    property={item.property as any}
                    onUnsave={() => setSaved((prev) => prev.filter((s) => s.id !== item.id))}
                    showSave
                  />
                )}
                ListEmptyComponent={
                  <View className='flex-1 items-center justify-center py-24'>
                      <View className='w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4'>
                          <Ionicons name='heart-outline' size={36} color="#EF4444" />
                      </View>
                      <Text className='text-gray-700 text-lg font-bold mb-1'>No Saved properties</Text>
                      <Text className="text-gray-400 text-sm text-center px-8">Tap the heart icon on any property to save it here</Text>
                      <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/search")}
                        className="mt-6 bg-blue-600 px-6 py-3 rounded-2xl"
                      >
                      <Text className="text-white font-semibold">Browse Properties</Text>
                      </TouchableOpacity>

                  </View>
                }
              />
            )}
    </SafeAreaView>
  )
}

export default Saved

