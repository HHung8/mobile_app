import { useAuth } from '@/context/AuthContext';
import { useSavedProperty } from '@/hooks/useSavedProperty';
import { useUserStore } from '@/store/useUserStore';
import { Property } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL;

const PropertyDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log(`check id`, id);
  const router = useRouter();
  const { accessToken } = useAuth();
  console.log(`check accessToken`, accessToken);
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");
  console.log(`check isSaved`, isSaved);
  const fetchProperyty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_ENDPOINT}/Property/${id}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`, // dùng token từ context
        },
      });
      console.log(`check response`, response);
      if (!response.ok) (`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(`check Data property details`, data);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id || !accessToken) return;
    fetchProperyty();
  }, [id, accessToken]);

  // const authSupabase = useSupabase()

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  if (!property) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <Text className='text-gray-500'>Property not found</Text>
      </View>
    )
  }



  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ opacity: property?.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property?.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)} >
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
            />
          </View>
          {/* Image count badge */}
          <View className='absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full'>
            <Text className='text-white text-xs font-medium'>
              {activeIndex + 1} / {property.images.length}
            </Text>
          </View>
          <SafeAreaView className='absolute top-0 left-0 right-0'>
            <View className='flex-row items-center justify-between px-4 pt-2'>
              <TouchableOpacity
                onPress={() => router.back}
                className='w-10 h-10 bg-white rounded-full items-center justify-center'
                style={{ elevation: 3 }}
              >
                <Ionicons name='arrow-back' size={20} color="#111827" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className='w-10 h-10 bg-white rounded-full items-center justify-center'
                style={{ elevation: 3 }}
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? "#EF4444" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
        
        <View
          className='px-5 pt-5 pb-8'
          style={{opacity: property.isSold ? 0.6 : 1}}
        > 
          <View className='flex-row gap-2 mb-3 flex-wrap'>
              <View className='bg-blue-50 px-3 py-1 rounded-full'>
                  <Text className='text-blue-600 text-xs font-semibold capitalize'>
                    {property.type}
                  </Text>
              </View>
              {property.isFeatured && (
                <View className='bg-amber-50 px-3 py-1 rounded-full'>
                    <Text className='text-amber text-xs font-semibold'>
                        ⭐ Featured
                    </Text>
                </View> 
              )}
              {property.isSold && (
                <View className='bg-red-50 px-3 py-1 rounded-full'>
                    <Text className='text-red-500 text-xs font-semibold'>Sold</Text>
                </View>
              )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default PropertyDetail;