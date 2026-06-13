import FilterModal from "@/components/FilterModal";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { formatPrice } from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const Search = () => {
  const { accessToken } = useAuth();
  const { colors, isDark } = useTheme();
  const { search, type, bedrooms, minPrice, maxPrice, setSearch, setType, setBedrooms, setMinPrice, setMaxPrice } = useFilterStore();
  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") setShowFilters(true);
  }, [openFilters]);

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const fetchResults = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim())  params.append("Search", search.trim());
      if (type)           params.append("Type", type);
      if (bedrooms)       params.append("Bedrooms", String(bedrooms));
      if (minPrice)       params.append("MinPrice", String(minPrice));
      if (maxPrice)       params.append("MaxPrice", String(maxPrice));
      params.append("Page", "1");
      params.append("PageSize", "20");

      const res = await fetch(`${API_BASE}/Property?${params.toString()}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
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
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchResults, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, type, bedrooms, minPrice, maxPrice, accessToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 16 }}>
          Find Property
        </Text>

        {/* Search bar + Filter button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            flex: 1, flexDirection: 'row', alignItems: 'center',
            backgroundColor: colors.bgCard, borderRadius: 16,
            paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border,
            shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0 : 0.06, shadowRadius: 6, elevation: isDark ? 0 : 2,
          }}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8,
                color: colors.text, fontSize: 14 }}
              placeholder="Search by title or city..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter button */}
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={{
              width: 48, height: 48, borderRadius: 16,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: activeFilterCount > 0 ? '#2563EB' : colors.bgCard,
              borderWidth: 1, borderColor: activeFilterCount > 0 ? '#2563EB' : colors.border,
              shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0 : 0.06, shadowRadius: 6, elevation: isDark ? 0 : 2,
            }}
          >
            <Ionicons name="options-outline" size={20}
              color={activeFilterCount > 0 ? '#fff' : colors.text} />
            {activeFilterCount > 0 && (
              <View style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, backgroundColor: '#EF4444',
                borderRadius: 8, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {type && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
                borderWidth: 1, borderColor: isDark ? '#2563EB' : '#BFDBFE',
                borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
              }}>
                <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 12, fontWeight: '600' }}>
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </TouchableOpacity>
              </View>
            )}
            {bedrooms !== null && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
                borderWidth: 1, borderColor: isDark ? '#2563EB' : '#BFDBFE',
                borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
              }}>
                <Ionicons name="bed-outline" size={11} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 12, fontWeight: '600' }}>
                  {bedrooms === 4 ? '4+ beds' : `${bedrooms} bed${bedrooms > 1 ? 's' : ''}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" size={12} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </TouchableOpacity>
              </View>
            )}
            {(minPrice !== null || maxPrice !== null) && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
                borderWidth: 1, borderColor: isDark ? '#2563EB' : '#BFDBFE',
                borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
              }}>
                <Text style={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontSize: 12, fontWeight: '600' }}>
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : minPrice ? `From ${formatPrice(minPrice)}`
                    : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity onPress={() => { setMinPrice(null); setMaxPrice(null); }}>
                  <Ionicons name="close" size={12} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16 }}>
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
              <Ionicons name="search-outline" size={48} color={colors.border} />
              <Text style={{ color: colors.textMuted, marginTop: 16, fontSize: 16 }}>
                No properties found
              </Text>
              <Text style={{ color: colors.border, fontSize: 13, marginTop: 4 }}>
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#2563EB" style={{ paddingVertical: 80 }} />
          )
        }
      />

      <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} />
    </SafeAreaView>
  );
};

export default Search;