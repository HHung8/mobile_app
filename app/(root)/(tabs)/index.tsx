import { useAuth } from "@/context/AuthContext";
import React from 'react';
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const {signOut} = useAuth();
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Text>
                毎日日本語を勉強してるでも日本語が難しいですね
                頑張ってくださいね。
                生活はたいへんでねでもきれです。
            </Text>
            <Image
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
                source={{uri:"https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}
            />
        </SafeAreaView> 
    )
}