import { useAuth } from '@/context/AuthContext';
import { useAdminProperty } from '@/hooks/useAdminProperty';
import { useSavedProperty } from '@/hooks/useSavedProperty';
import { formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { Property } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from "react-native-webview";


const { width } = Dimensions.get('window');
const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL;
const ADMIN_PHONE = "919999999999";

const PropertyDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const isAdmin = useUserStore((state) => state.isAdmin);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");
  
  const { markSold, markSoldLoading, deleteProperty, deleteLoading } = useAdminProperty(
    property,
    () => router.replace("/(root)/(tabs)"),          // onDelete
    (updated) => setProperty(updated)                // onMarkSold → cập nhật UI luôn
  );

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

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handlerContact = () => {
    const message = `Hi ! I'm interested in the property: ${property?.title}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  }

  if (!property) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <Text className='text-gray-500'>Property not found</Text>
      </View>
    )
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.003}%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${property.latitude + 0.003}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`
  const isLongDesc = (property.description?.length ?? 0) >  150;
  const displayDesc = expanded || !isLongDesc ? property.description : property.description?.slice(0,150) + "...";
  
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ opacity: property?.isSold ? 0.5 : 1 }}>
            <FlatList
              data={property?.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
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
              onScroll={onScroll}
            />
          </View>
          {/* Image count badge */}
          <View className='absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full'>
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>
          
          {/* Dot indicators */}
          {property.images.length > 1 && (
            <View className='absolute bottom-3 left-0 right-0 flex-row justify-center gap-1'>
                {
                  property.images.map((_,i) => (
                    <View 
                      key={i}
                      className={`h-1.5 rounded-full ${i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                    >
                    </View>  
                  ))
                }
            </View>
          )}

          {/* Back + Save buttons */}
          <SafeAreaView className='absolute top-0 left-0 right-0'>
            <View className='flex-row items-center justify-between px-4 pt-2'>
              <TouchableOpacity
                onPress={() => router.back()}
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
          {/* Title + Price */}
          <Text className='text-2xl font-bold text-gray-900 mb-1'>
              {property.title}
          </Text>
          <Text className='text-blue-600 text-xl font-bold mb-4'>
              {formatPrice(property.price)}
          </Text>

          {/* Specs Row */}
          <View className='flex-row justify-between bg-gray-50 rounded-2xl p-4 mb-5'>
              <SpecItem 
                icon='bed-outline'
                label='Beds'
                value={`${property.bedrooms}`}
              />
              <SpecItem 
                icon='water-outline'
                label='Baths'
                value={`${property.bathrooms}`}
              />
              <SpecItem 
                icon='expand-outline'
                label='Area'
                value={`${property.area_sqft} ft²`}
              />
              <SpecItem icon="home-outline" label="Type" value={property.type} />
          </View>
          
          {/* Description */}
          <Text className='text-base font-bold text-gray-900 mb-2'>Description</Text>
          <Text className='text-gray-500 text-sm leading-6 mb-1'>{displayDesc}</Text>
          {isLongDesc && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
               <Text className="text-blue-600 text-sm font-medium mb-5">
                  {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
          <View className='mb-5' />
          {/* Location */}
          <Text className='text-base font-bold text-gray-900 mb-2'>Location</Text>
          <View className='flex-row items-center gap-2 mb-4'>
              <Ionicons name='location-outline' size={16} color="#6B7280" />
              <Text className='text-gray-500 text-sm flex-1'>{property.address},{property.city}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => 
            router.push({
              pathname:"/(root)/property/map",
              params: {
                  latitude: property.latitude,
                  longitude: property.longitude,
                  title: property.title,
                  address: `${property.address}, ${property.city}`,
              },
          })
        }
          activeOpacity={0.9}
          className="rounded-2xl overflow-hidden mb-6"
          style={{ height: 200 }}
        >
          <WebView
            source={{ uri: mapUrl }}
            style={{ flex: 1 }}
            scrollEnabled={false}
            pointerEvents="none"
          />  
          <View className='absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full flex-row items-center gap-1'>
              <Ionicons name="expand-outline" size={12} color="#374151"/>
              <Text className='text-gray-600 text-xs font-medium'>
                  Tap to expand
              </Text>
          </View>
        </TouchableOpacity>
        {/* Contact button */}
        <TouchableOpacity
          onPress={handlerContact}
          className='flex-row items-center justify-center gap-2 bg-blue-600 py-4 rounded-2xl mb-4'
        >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className='text-white font-bold text-base'>Contact Agent</Text>
        </TouchableOpacity>
        
         {isAdmin && (
            <View className="flex-row gap-3">
              {!property.isSold && (
                <TouchableOpacity
                  onPress={markSold}
                  disabled={markSoldLoading}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-amber-50 py-4 rounded-2xl border border-amber-200"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#D97706"
                  />
                  <Text className="text-amber-600 font-semibold">
                    Mark Sold
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={deleteProperty}
                disabled={deleteLoading}
                className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text className="text-red-500 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
      {/* Image Viewer */}
      {/* <ImageViewing
        images={property.images.map((uri) => ({ uri }))}
        imageIndex={activeIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      /> */}
    </View>
  );
};

export default PropertyDetail;
function SpecItem ({
  icon, 
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color="#2563EB" />
      <Text className="text-gray-900 font-bold text-sm">{value}</Text>
      <Text className="text-gray-400 text-xs">{label}</Text>
    </View>
  );
}