import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/context/AuthContext";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
    const { signOut, accessToken } = useAuth();
    const router = useRouter();
    const [featured, setFeatured] = useState<Property[]>([]);
    const [recommended, setRecommended] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if(!accessToken) return;
        try{
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            };
            const [featuredRes, recommendedRes] = await Promise.all([
                fetch(`${API_BASE}/Property/featured`, { headers }),
                fetch(`${API_BASE}/Property/recommended`, { headers }),
            ])
            if(featuredRes.ok) setFeatured(await featuredRes.json());
            if(recommendedRes.ok) setRecommended(await recommendedRes.json());            
        }catch(e){
            console.error('Failed to fetch properties', e); 
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [accessToken]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <FlatList
                data={recommended}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
                            <View>
                                <Text className="text-gray-500 text-xs">Welcome back 👋</Text>
                                <Text className="text-gray-900 text-xl font-bold">Hưng Nguyễn</Text>
                            </View>
                            <TouchableOpacity onPress={signOut}>
                                <Ionicons
                                    name="log-out-outline"
                                    size={24}
                                    color="#2563EB"
                                />
                            </TouchableOpacity>
                        </View>
                        {/* Search */}
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/(tabs)/search")}
                            className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.08,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            <Ionicons name="search-outline" size={18} color="#9CA3AF"/>
                            <Text className="ml-3 flex-1 text-gray-400">Search properties...</Text>
                            <View className="bg-blue-600 w-8 h-8 rounded-xl items-center justify-center">
                            <TouchableOpacity
                                onPress = {() => router.push("/(root)/(tabs)/search?openFilters=true")}
                            >
                                <Ionicons name="options-outline" size={15} color="white" />
                            </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                        {/* Featured Section */}
                        <View className="mb-6">
                            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                                Featured
                            </Text>
                            {loading ? (
                                <ActivityIndicator size="large" color="#2563EB" className="mb-4" />
                            ) : (
                                <FlatList 
                                    data={featured}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => <FeaturedCard property={item} />}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 20 }} 
                                />
                            )}
                        </View>

                        {/* Recommended Header */}
                        <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                            Recommended
                        </Text>
                    </>
                }
                renderItem={({item}) => (
                    <View className="px-5">
                       <PropertyCard property={item} />
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center py-10">
                            <Text className="text-gray-500">No properties found</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    )
}