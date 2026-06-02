import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment",
    city: "Tokyo",
    price: "$1,200/month",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
  },
  {
    id: "2",
    title: "Luxury Villa",
    city: "Osaka",
    price: "$3,500/month",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200",
  },
  {
    id: "3",
    title: "Cozy Studio",
    city: "Kyoto",
    price: "$850/month",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200",
  },
  {
    id: "4",
    title: "Family House",
    city: "Nagoya",
    price: "$1,800/month",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200",
  },
];

const Search = () => {
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const results = useMemo(() => {
    if (!search.trim()) return mockProperties;

    return mockProperties.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Find Property
        </Text>

        {/* Search Bar */}
        <View
          className="flex-row items-center bg-white rounded-2xl px-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color="#9CA3AF"
          />

          <TextInput
            className="flex-1 py-4 ml-3 text-gray-800"
            placeholder="Search by title or city..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Result List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4">
            {loading
              ? "Searching..."
              : `${results.length} properties found`}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white rounded-3xl overflow-hidden mb-5">
            <Image
              source={{ uri: item.image }}
              className="w-full h-52"
            />

            <View className="p-4">
              <Text className="text-lg font-bold text-gray-900">
                {item.title}
              </Text>

              <Text className="text-gray-500 mt-1">
                {item.city}
              </Text>

              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-blue-600 font-bold">
                  {item.price}
                </Text>

                <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={22}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-20">
              <Ionicons
                name="search-outline"
                size={48}
                color="#D1D5DB"
              />

              <Text className="text-gray-400 mt-4 text-base">
                No properties found
              </Text>

              <Text className="text-gray-300 text-sm mt-1">
                Try another keyword
              </Text>
            </View>
          ) : (
            <ActivityIndicator
              size="large"
              color="#2563EB"
              className="py-20"
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default Search;