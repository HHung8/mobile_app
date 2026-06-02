import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPES = ["Apartment", "House", "Villa", "Studio"];

const Create = () => {
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter title");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      Alert.alert(
        "Success 🎉",
        "Property created successfully (fake data)"
      );
    }, 1500);
  };

  const Counter = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
  }) => (
    <View className="flex-1">
      <Text className="text-sm font-semibold text-gray-700 mb-2">
        {label}
      </Text>

      <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl">
        <TouchableOpacity
          className="w-12 h-12 items-center justify-center"
          onPress={() => onChange(Math.max(1, value - 1))}
        >
          <Ionicons name="remove" size={18} color="#374151" />
        </TouchableOpacity>

        <Text className="flex-1 text-center font-bold text-gray-800">
          {value}
        </Text>

        <TouchableOpacity
          className="w-12 h-12 items-center justify-center"
          onPress={() => onChange(value + 1)}
        >
          <Ionicons name="add" size={18} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 120,
          }}
        >
          {/* Header */}
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Add Property
          </Text>

          {/* Images */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              Photos
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {images.map((item, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: item }}
                    className="w-24 h-24 rounded-2xl"
                  />

                  <TouchableOpacity className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                    <Ionicons
                      name="close"
                      size={12}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Demo",
                    "Image Picker sẽ làm sau"
                  )
                }
                className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-gray-300 items-center justify-center"
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color="#9CA3AF"
                />

                <Text className="text-gray-400 text-xs mt-1">
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Title
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Modern Apartment"
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4"
            />
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholder="Property description..."
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4 h-28"
            />
          </View>

          {/* Price */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Price
            </Text>

            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="$1000"
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4"
            />
          </View>

          {/* Type */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Property Type
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {TYPES.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setType(item)}
                  className={`px-4 py-2 rounded-full ${
                    type === item
                      ? "bg-blue-600"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      type === item
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bedroom + Bathroom */}
          <View className="flex-row gap-4 mb-5">
            <Counter
              label="Bedrooms"
              value={bedrooms}
              onChange={setBedrooms}
            />

            <Counter
              label="Bathrooms"
              value={bathrooms}
              onChange={setBathrooms}
            />
          </View>

          {/* Area */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Area (sqft)
            </Text>

            <TextInput
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
              placeholder="1200"
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4"
            />
          </View>

          {/* Address */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Address
            </Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street Address"
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4"
            />
          </View>

          {/* City */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              City
            </Text>

            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Tokyo"
              className="bg-white border border-gray-200 rounded-2xl px-4 py-4"
            />
          </View>

          {/* Featured */}
          <TouchableOpacity
            onPress={() => setFeatured(!featured)}
            className={`flex-row items-center justify-between p-4 rounded-2xl border mb-8 ${
              featured
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            <Text className="font-semibold text-gray-700">
              Featured Property
            </Text>

            <Ionicons
              name={
                featured
                  ? "checkmark-circle"
                  : "ellipse-outline"
              }
              size={24}
              color={featured ? "#2563EB" : "#9CA3AF"}
            />
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-blue-600 rounded-2xl py-4 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Create Property
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;