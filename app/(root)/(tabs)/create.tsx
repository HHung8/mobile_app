import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPES = ["Apartment", "House", "Villa", "Studio"];
const CURRENCIES = ["USD", "VND", "JPY", "EUR"];

const API_BASE = process.env.EXPO_PUBLIC_API_URL;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;


const Create = () => {
  const { colors, isDark } = useTheme();
  const {accessToken} = useAuth();
  const [loading, setLoading] = useState(false);
  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Apartment");
  const [currency, setCurrency] = useState("USD");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [featured, setFeatured] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!title.trim())       return "Please enter a title";
    if (!price.trim() || isNaN(Number(price))) return "Please enter a valid price";
    if (!address.trim())     return "Please enter an address";
    if (!city.trim())        return "Please enter a city";
    if (latitude  && isNaN(Number(latitude)))  return "Latitude must be a number";
    if (longitude && isNaN(Number(longitude))) return "Longitude must be a number";
    return null;
  };

  const uploadToCloudinary = async(uri:string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `photo_${Date.now()}.jpg`,
    } as any);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, {
      method:"POST",
      body: formData,
    });
    if(!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  }

  const handlePickImage = async () => {
  // Xin quyền
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission denied", "Please allow photo access in Settings");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,   // iOS 14+ / Android
    quality: 0.8,
    selectionLimit: 10,
  });

  if (result.canceled) return;

  setLoading(true);
  try {
    const uploaded = await Promise.all(
      result.assets.map((asset) => uploadToCloudinary(asset.uri))
    );
    setImages((prev) => [...prev, ...uploaded]);
  } catch (e: any) {
    Alert.alert("Upload failed", e.message);
  } finally {
    setLoading(false);
  }
};

const handleTakePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission denied", "Please allow camera access in Settings");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
  });

  if (result.canceled) return;

  setLoading(true);
  try {
    const url = await uploadToCloudinary(result.assets[0].uri);
    setImages((prev) => [...prev, url]);
  } catch (e: any) {
    Alert.alert("Upload failed", e.message);
  } finally {
    setLoading(false);
  }
};


  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const error = validate();
    if (error) { Alert.alert("Validation", error); return; }

    setLoading(true);
    try {
      const body = {
        title:       title.trim(),
        description: description.trim(),
        price:       Number(price),
        type,   
        bedrooms,
        bathrooms,
        areaSqft:    Number(area) || 0,
        address:     address.trim(),
        city:        city.trim(),
        latitude:    latitude  ? Number(latitude)  : 0,
        longitude:   longitude ? Number(longitude) : 0,
        images,
        isFeatured:  featured,
      };

      const res = await fetch(`${API_BASE}/Admin/properties`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "accept":        "*/*",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      console.log(`check response create`, res);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      Alert.alert("Success 🎉", `Property created!\nID: ${data.id}`, [
        {
          text: "OK",
          onPress: () => router.replace("/(root)/(tabs)"),
        }
      ]);

      // Reset form
      setTitle(""); setDescription(""); setPrice("");
      setArea(""); setAddress(""); setCity("");
      setLatitude(""); setLongitude("");
      setBedrooms(1); setBathrooms(1);
      setFeatured(false); setCurrency("USD");
      setImages(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200"]);

    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = {
    backgroundColor: colors.bgCard, borderColor: colors.border,
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 16,
    paddingVertical: 14, color: colors.text, fontSize: 14,
  };

  const labelStyle = {
    color: colors.text, fontSize: 13,
    fontWeight: "600" as const, marginBottom: 8,
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const Counter = ({
    label, value, onChange,
  }: { label: string; value: number; onChange: (v: number) => void }) => (
    <View style={{ flex: 1 }}>
      <Text style={labelStyle}>{label}</Text>
      <View style={{
        flexDirection: "row", alignItems: "center",
        backgroundColor: colors.bgCard, borderWidth: 1,
        borderColor: colors.border, borderRadius: 16,
      }}>
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          onPress={() => onChange(Math.max(1, value - 1))}
        >
          <Ionicons name="remove" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontWeight: "700", color: colors.text }}>
          {value}
        </Text>
        <TouchableOpacity
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
          onPress={() => onChange(value + 1)}
        >
          <Ionicons name="add" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        >
          {/* Header */}
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700", marginBottom: 24 }}>
            Add Property
          </Text>

          {/* Photos */}
          <View style={{ marginBottom: 24 }}>
            <Text style={labelStyle}>Photos</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {images.map((item, index) => (
                <View key={index} style={{ position: "relative" }}>
                  <Image source={{ uri: item }}
                    style={{ width: 96, height: 96, borderRadius: 16 }} />
                  <TouchableOpacity
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                    style={{
                      position: "absolute", top: 4, right: 4,
                      backgroundColor: "#EF4444", borderRadius: 999, padding: 4,
                    }}>
                    <Ionicons name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => 
                  Alert.alert("Add Photo", "Choose source", [
                      { text: "Camera",        onPress: handleTakePhoto },
                      { text: "Photo Library", onPress: handlePickImage },
                      { text: "Cancel", style: "cancel" },
                  ])
                }
                style={{
                  width: 96, height: 96, borderRadius: 16,
                  backgroundColor: colors.bgCard, borderWidth: 2,
                  borderStyle: "dashed", borderColor: colors.border,
                  alignItems: "center", justifyContent: "center",
                }}>
                <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Title *</Text>
            <TextInput value={title} onChangeText={setTitle}
              placeholder="Modern Apartment" placeholderTextColor={colors.textMuted}
              style={inputStyle} />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Description</Text>
            <TextInput value={description} onChangeText={setDescription}
              multiline textAlignVertical="top"
              placeholder="Property description..." placeholderTextColor={colors.textMuted}
              style={[inputStyle, { height: 112 }]} />
          </View>

          {/* Price + Currency */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Price *</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {/* Currency selector */}
              <View style={{ flexDirection: "row", gap: 6 }}>
                {CURRENCIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCurrency(c)}
                    style={{
                      paddingHorizontal: 12, paddingVertical: 14, borderRadius: 16,
                      backgroundColor: currency === c ? "#2563EB" : colors.bgCard,
                      borderWidth: 1,
                      borderColor: currency === c ? "#2563EB" : colors.border,
                    }}>
                    <Text style={{ fontWeight: "600", fontSize: 13,
                      color: currency === c ? "#FFF" : colors.text }}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              value={price} onChangeText={setPrice}
              keyboardType="numeric" placeholder="1000"
              placeholderTextColor={colors.textMuted}
              style={[inputStyle, { marginTop: 8 }]} />
          </View>

          {/* Property Type */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Property Type</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TYPES.map((item) => (
                <TouchableOpacity
                  key={item} onPress={() => setType(item)}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
                    backgroundColor: type === item ? "#2563EB" : colors.bgCard,
                    borderWidth: 1,
                    borderColor: type === item ? "#2563EB" : colors.border,
                  }}>
                  <Text style={{ fontWeight: "500",
                    color: type === item ? "#FFFFFF" : colors.text }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bedrooms + Bathrooms */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
            <Counter label="Bedrooms"  value={bedrooms}  onChange={setBedrooms} />
            <Counter label="Bathrooms" value={bathrooms} onChange={setBathrooms} />
          </View>

          {/* Area */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Area (sqft)</Text>
            <TextInput value={area} onChangeText={setArea}
              keyboardType="numeric" placeholder="1200"
              placeholderTextColor={colors.textMuted} style={inputStyle} />
          </View>

          {/* Address */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Address *</Text>
            <TextInput value={address} onChangeText={setAddress}
              placeholder="Street Address" placeholderTextColor={colors.textMuted}
              style={inputStyle} />
          </View>

          {/* City */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>City *</Text>
            <TextInput value={city} onChangeText={setCity}
              placeholder="Tokyo" placeholderTextColor={colors.textMuted}
              style={inputStyle} />
          </View>

          {/* Latitude + Longitude */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Latitude</Text>
              <TextInput value={latitude} onChangeText={setLatitude}
                keyboardType="numeric" placeholder="21.0278"
                placeholderTextColor={colors.textMuted} style={inputStyle} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>Longitude</Text>
              <TextInput value={longitude} onChangeText={setLongitude}
                keyboardType="numeric" placeholder="105.8342"
                placeholderTextColor={colors.textMuted} style={inputStyle} />
            </View>
          </View>

          {/* Featured */}
          <TouchableOpacity
            onPress={() => setFeatured(!featured)}
            style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1,
              backgroundColor: featured
                ? (isDark ? "#1E3A5F" : "#EFF6FF")
                : colors.bgCard,
              borderColor: featured
                ? (isDark ? "#2563EB" : "#BFDBFE")
                : colors.border,
            }}>
            <Text style={{ fontWeight: "600", color: colors.text }}>Featured Property</Text>
            <Ionicons
              name={featured ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={featured ? "#2563EB" : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#93C5FD" : "#2563EB",
              borderRadius: 16, paddingVertical: 16, alignItems: "center",
            }}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
                  Create Property
                </Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;