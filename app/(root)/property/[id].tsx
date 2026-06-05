import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const PropertyDetail = () => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const images = [
    {
      uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setImageViewerVisible(true)}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default PropertyDetail;