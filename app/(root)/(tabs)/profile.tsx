import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
    const { signOut } = useAuth();
    const user = {
      fullName: "Nguyễn Hữu Hưng",
      email: "hungnguyen@example.com",
      avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };

    const handleSignOut = () => {
        signOut();
    }
    const handleChangeAvatar = () => {
        Alert.alert("Thông báo", "Chức năng đổi ảnh sẽ làm sau");
    }

    return (
      <SafeAreaView className="flex-1 bg-white">
          <View className="items-center py-8">
              <View className="relative">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-28 h-28 rounded-full"
                />
                 <TouchableOpacity
                    onPress={handleChangeAvatar}
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
                  >
                    <Ionicons name="camera" size={16} color="white" />
                  </TouchableOpacity>
              </View> 
              <Text className="text-xl font-bold text-gray-900 mt-4">
                {user.fullName}
              </Text>
              <Text className="text-gray-500 mt-1">
                {user.email}
              </Text>
            </View>
            <View className="flex-row justify-center px-6 mb-6">  
                <View className="flex-1 items-center bg-gray-50 py-4 rounded-2xl mr-2">
                      <Text className="text-xl font-bold text-blue-600">12</Text>
                      <Text className="text-gray-500 text-sm">Saved</Text>
                </View>
                <View className="flex-1 items-center bg-gray-50 py-4 rounded-2xl mx-2">
                  <Text className="text-xl font-bold text-green-600">8</Text>
                  <Text className="text-gray-500 text-sm">Viewed</Text>
                </View>
                <View className="flex-1 items-center bg-gray-50 py-4 rounded-2xl ml-2">
                  <Text className="text-xl font-bold text-orange-500">3</Text>
                  <Text className="text-gray-500 text-sm">Contacted</Text>
                </View>
            </View>
             {/* Menu */}
            <View className="px-5 gap-3">
              <MenuItem
                icon="heart-outline"
                label="Saved Properties"
              />

              <MenuItem
                icon="notifications-outline"
                label="Notifications"
              />

              <MenuItem
                icon="settings-outline"
                label="Settings"
              />

              <MenuItem
                icon="help-circle-outline"
                label="Help & Support"
              />

              <MenuItem
                icon="shield-checkmark-outline"
                label="Privacy Policy"
              />
            </View>
            <View className="px-5 mt-auto mb-8">
                <TouchableOpacity 
                  onPress={handleSignOut}
                  className="flex-row items-center justify-center bg-gray-50 px-4 py-4 rounded-2xl"  
                >
                    <Ionicons name="log-out-outline" size={22} color="#6B7280" />
                    <Text className='text-red-500 font-semibold ml-2'>Sign Out</Text>
                </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
};

const MenuItem = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) => {
    return (
      <TouchableOpacity
        onPress={() => Alert.alert(label)}
        className="flex-row items-center bg-gray-50 px-4 py-4 rounded-2xl"
      >
        <Ionicons name={icon} size={22} color="#6B7280" />
        <Text className="flex-1 ml-4 text-base font-medium text-gray-700">{label}</Text>
        <Ionicons name="chevron-forward" size={22} color="#6B7280" />
      </TouchableOpacity>
    )

}

export default Profile