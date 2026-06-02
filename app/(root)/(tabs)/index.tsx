import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const mockFeatured = [
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
];

const mockRecommended = [
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
        city: "Yokohama",
        price: "$1,800/month",
        image:
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200",
    },
    {
        id: "5",
        title: "City Apartment",
        city: "Nagoya",
        price: "$1,100/month",
        image:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200",
    },
];

export default function HomeScreen() {
    const { signOut } = useAuth();
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <FlatList
                data={mockRecommended}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
                            <View>
                                <Text className="text-gray-500 text-xs">
                                    Welcome back 👋
                                </Text>
                                <Text className="text-gray-900 text-xl font-bold">
                                    Hưng Nguyễn
                                </Text>
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
                            className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.08,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            <Ionicons
                                name="search-outline"
                                size={18}
                                color="#9CA3AF"
                            />
                            <Text className="ml-3 flex-1 text-gray-400">Search properties...</Text>
                            <View className="bg-blue-600 w-8 h-8 rounded-xl items-center justify-center">
                                <Ionicons
                                    name="options-outline"
                                    size={18}
                                    color="#fff"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="px-5 mb-4 text-lg font-bold text-gray-900">
                            Featured
                        </Text>
                        <FlatList
                            horizontal
                            data={mockFeatured}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                            }}
                            renderItem={({ item }) => (
                                <TouchableOpacity className="mr-4 w-72 bg-white rounded-3xl overflow-hidden">
                                    <Image
                                        source={{ uri: item.image }}
                                        className="w-full h-44"
                                    />

                                    <View className="p-4">
                                        <Text className="font-bold text-lg text-gray-900">
                                            {item.title}
                                        </Text>

                                        <Text className="text-gray-500 mt-1">
                                            {item.city}
                                        </Text>

                                        <Text className="text-blue-600 font-bold mt-3">
                                            {item.price}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            )}
                        />

                        <Text className="px-5 mb-4 text-lg font-bold text-gray-900">
                            Recommended
                        </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity className="mx-5 mb-4 bg-white rounded-3xl overflow-hidden">
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

                                <Ionicons
                                    name="heart-outline"
                                    size={22}
                                    color="#6B7280"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />



        </SafeAreaView>
    )
}