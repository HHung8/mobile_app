import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
    const { signOut, accessToken } = useAuth();
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const [featured, setFeatured] = useState<Property[]>([]);
    const [recommended, setRecommended] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!accessToken) return;
        try {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            };
            const [featuredRes, recommendedRes] = await Promise.all([
                fetch(`${API_BASE}/Property/featured`, { headers }),
                fetch(`${API_BASE}/Property/recommended`, { headers }),
            ]);
            if (featuredRes.ok) setFeatured(await featuredRes.json());
            if (recommendedRes.ok) setRecommended(await recommendedRes.json());
        } catch (e) {
            console.error('Failed to fetch properties', e);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [accessToken])
    )



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
            <FlatList
                data={recommended}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between', paddingHorizontal: 20,
                            paddingTop: 16, paddingBottom: 20
                        }}>
                            <View>
                                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                                    Welcome back 👋
                                </Text>
                            </View>
                            <TouchableOpacity onPress={signOut}>
                                <Ionicons name="log-out-outline" size={24} color={colors.iconColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Search */}
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/(tabs)/search")}
                            style={{
                                marginHorizontal: 20, marginBottom: 24,
                                flexDirection: 'row', alignItems: 'center',
                                backgroundColor: colors.bgCard,
                                borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
                                borderWidth: 1, borderColor: colors.border,
                                shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isDark ? 0 : 0.06, shadowRadius: 6, elevation: isDark ? 0 : 2,
                            }}
                        >
                            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                            <Text style={{ marginLeft: 10, flex: 1, color: colors.textMuted, fontSize: 14 }}>
                                Search properties...
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/(root)/(tabs)/search?openFilters=true")}
                                style={{
                                    backgroundColor: '#2563EB', width: 32, height: 32,
                                    borderRadius: 10, alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Ionicons name="options-outline" size={15} color="white" />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {/* Featured */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{
                                color: colors.text, fontSize: 18, fontWeight: '700',
                                paddingHorizontal: 20, marginBottom: 16
                            }}>
                                Featured
                            </Text>
                            {loading ? (
                                <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 16 }} />
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
                        <Text style={{
                            color: colors.text, fontSize: 18, fontWeight: '700',
                            paddingHorizontal: 20, marginBottom: 16
                        }}>
                            Recommended
                        </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 20 }}>
                        <PropertyCard property={item} />
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Text style={{ color: colors.textMuted }}>No properties found</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}