import { useAuth } from "@/context/AuthContext";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const Search = () => {
  const {accessToken} = useAuth();
  const {search, setSearch, type, bedrooms, minPrice, maxPrice} = useFilterStore();
  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = async () => {
    if(!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if(search.trim()) params.append("Search", search.trim());
      if(type)          params.append("Type", type);
      if (bedrooms)        params.append("Bedrooms", String(bedrooms));
      if (minPrice)        params.append("MinPrice", String(minPrice));
      if (maxPrice)        params.append("MaxPrice", String(maxPrice));
      params.append("Page", "1");
      params.append("PageSize", "20");

       const res = await fetch(`${API_BASE}/Property?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

       if (res.ok) {
        const data = await res.json();
        setResults(data.items ?? []);
        setTotal(data.total ?? 0);
      }

    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchResults, 500);
    return () => {
      if(debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search, type, bedrooms, minPrice, maxPrice, accessToken])

  return (
 <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Find Property</Text>
        <View
          className="flex-row items-center bg-white rounded-2xl px-4"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 py-4 ml-3 text-gray-800"
            placeholder="Search by title or city..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}  // ghi thẳng vào store
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4">
            {loading ? "Searching..." : `${total} properties found`}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white rounded-3xl overflow-hidden mb-5">
            <Image source={{ uri: item.images?.[0] }} className="w-full h-52" />
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
              <Text className="text-gray-500 mt-1">{item.city}</Text>
              <View className="flex-row items-center justify-between mt-3">
                <Text className="text-blue-600 font-bold">${item.price}/month</Text>
                <Ionicons name="heart-outline" size={22} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#2563EB" className="py-20" />
          ) : (
            <View className="items-center py-20">
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4 text-base">No properties found</Text>
              <Text className="text-gray-300 text-sm mt-1">Try another keyword</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Search;