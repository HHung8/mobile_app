import { PropertyType, useFilterStore } from '@/store/filterStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';


const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
    {label:"Any", value: null},
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4+", value: 4 },
]

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "$50USD – $100USD", min: 5000000, max: 10000000 },
  { label: "$100USD – $200USD", min: 10000000, max: 20000000 },
  { label: "Above $200USD", min: 20000000, max: null },
];

const chip = (active:boolean) => `px-4 py-2 rounded-full border ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}`
const chipText = (active:boolean) => `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

const FilterModal = ({visible, onClose}:{visible: boolean, onClose: () => void;}) => {
  const {type, bedrooms, minPrice, maxPrice, setType, setBedrooms, setMinPrice, setMaxPrice,resetFilters} = useFilterStore();
  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  }
  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  };

  return (
    <Modal
        visible={visible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-gray-50">
           <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
              <TouchableOpacity onPress={onClose} className="p-1">
                  <Ionicons name="close" size={22} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">Filters</Text>
              <TouchableOpacity onPress={handleReset}>
                  <Text className="text-blue-600 font-semibold text-sm">Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
                <Text className="text-base font-bold text-gray-800 mb-3">
            Property Type
          </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {TYPES.map((item) => (
                  <TouchableOpacity
                    key={String(item.value)}
                    onPress={() => setType(item.value)}
                    className={chip(type === item.value)}
                    style={shadow}
                  >
                    <Text 
                        className={chipText(type === item.value)}
                      >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
        </View> 
    </Modal>
  )
}

export default FilterModal