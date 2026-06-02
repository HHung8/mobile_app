import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Saved = () => {
  const [saved, setSaved] = useState([
    {
      id: "1",
      title: "Modern Apartment",
      location: "Tokyo, Japan",
      price: "$1,200/month",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
    },
    {
      id: "2",
      title: "Luxury Villa",
      location: "Osaka, Japan",
      price: "$3,500/month",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200",
    },
    {
      id: "3",
      title: "Cozy Studio",
      location: "Kyoto, Japan",
      price: "$850/month",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200",
    },
  ]);
  const handleUnsave = (id:string) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
  }
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-5 pt-4 pb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Saved Properties
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {saved.length} properties saved
          </Text>
        </View>
        <FlatList 
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
          <View className="bg-white rounded-3xl overflow-hidden mb-5">
            <Image
              source={{ uri: item.image }}
              className="w-full h-52"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {item.title}
                  </Text>

                  <Text className="text-gray-500 mt-1">
                    {item.location}
                  </Text>

                  <Text className="text-blue-600 font-bold mt-3">
                    {item.price}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleUnsave(item.id)}
                  className="w-10 h-10 bg-red-50 rounded-full items-center justify-center"
                >
                  <Ionicons
                    name="heart"
                    size={20}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-24" >
              <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
                <Ionicons
                  name="heart-outline"
                  size={36}
                  color="#EF4444"
                />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                  No saved properties
              </Text>
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

