import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    if(!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      console.log('API_URL:', API_URL); // ← kiểm tra URL
      console.log('Calling:', `${API_URL}/Auth/login`);
      const res = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email.trim(), password}),
      })
      const data = await res.json();
      console.log(`check data`, data);
      if(!res.ok) {
        Alert.alert('Đăng nhập thất bại', data.message || 'Sai email hoặc mật khẩu');
        return;
      }
      console.log(`dataacesstoken`, data.accessToken);
      console.log(`datarefreshtoken`, data.refreshToken);
      await signIn(data.accessToken, data.refreshToken);
    } catch (error) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }



  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8F7F4] px-7 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />
      {/* Header */}
      <View className="mb-11">
        <View className="w-11 h-11 rounded-2xl bg-[#1A1A1A] mb-6" />
        <Text className="text-[34px] font-bold text-[#1A1A1A] tracking-tight"
          style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
        >
          Xin chào
        </Text>
        <Text className="text-[15px] text-[#7A7167] mt-1.5">
          Đăng nhập để tiếp tục
        </Text>
      </View>

      {/* Form */}
      <View>
        {/* Email */}
        <View className="mb-5">
          <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">
            Email
          </Text>
          <TextInput
            className="h-[52px] bg-white rounded-2xl px-4 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]"
            placeholder="your@email.com"
            placeholderTextColor="#B0A99F"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {/* Password */}
        <View className="mb-5">
          <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">
            Password
          </Text>
          <View className="relative">
            <TextInput
              className="h-[52px] bg-white rounded-2xl px-4 pr-14 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]"
              placeholder="your password"
              placeholderTextColor="#B0A99F"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              className="absolute right-4 top-3.5 w-6 h-6 justify-center items-center"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="self-end mb-7 mt-1.5">
          <Text className="text-sm text-[#7A7167] tracking-wider">
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center shadown-log ${loading ? 'opacity-60' : ''}`}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#F8F7F4" />
          ) : (
            <Text className="text-base font-bold text-[#F8F7F4] tracking-wide">
              Đăng nhập
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-7 gap-3">
          <View className="flex-1 h-[1px] bg-[#E8E4DF]" />
          <Text className="text-[13px] text-[#B0A99F]">hoặc</Text>
          <View className="flex-1 h-px bg-[#E8E4DF]" />
        </View>
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-[#7A7167]">Chưa có tài khoản? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-[#1A1A1A] underline">
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default SignIn