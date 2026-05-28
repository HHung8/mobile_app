import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const SignUp = () => {
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    console.log('fullName:', username);
    console.log('email:', email);
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    // ✅ Kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    // ✅ Kiểm tra độ dài
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      console.log('=== BẮT ĐẦU GỌI API ===');
      const res = await fetch(`${API_URL}/Auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username.trim(), email: email.trim(), password})
      });
      
      const data = await res.json();
      console.log('Status:', res.status);
      console.log('Response data:', JSON.stringify(data)); 
      
      if(!res.ok) {
        Alert.alert('Đăng ký thất bại', data.message || 'Vui lòng thử lại');
        return;
      }
      Alert.alert('Thành công 🎉', 'Tài khoản đã được tạo. Vui lòng đăng nhập.', [
        { text: 'Đăng nhập', onPress: () => router.replace('/(auth)/sign-in') },
      ]);
    } catch (e) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }
  const passwordMismatch = confirmPassword !== '' && confirmPassword !== password;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8F7F4]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />
      <ScrollView
        contentContainerClassName="px-7 py-16 justify-center flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className='mb-10'>
          <View className='w-11 h-11 rounded-2xl bg-[#1A1A1A] mb-6' />
          <Text
            className='text-[34px] font-bold text-[#1A1A1A] tracking-tight'
            style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
          >
            Tạo tài khoản
          </Text>
          <Text className='text-[15px] text-[#7A7167] mt-1.5'>
            Bắt đầu hành trình của bạn
          </Text>
        </View>
        {/* Form */}
        <View>
          <View className='mb-5'>
            <Text className='text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase'>Họ và tên</Text>
            <TextInput
              className='h-[52px] bg-white rounded-2xl px-4 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]'
              placeholder='Your Name'
              placeholderTextColor="#B0A99F"
              autoCapitalize='words'
              value={username}
              onChangeText={setUserName}
            />
          </View>
          <View className='mb-5'>
            <Text className='text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase'>Email</Text>
            <TextInput
              className='h-[52px] bg-white rounded-2xl px-4 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]'
              placeholder='your@gmail.com'
              placeholderTextColor="#B0A99F"
              autoCapitalize='none'
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className='mb-5'>
            <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">Mật khẩu</Text>
            <View className='relative'>
              <TextInput
                className="h-[52px] bg-white rounded-2xl px-4 pr-14 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]"
                placeholder="Tối thiểu 6 ký tự"
                placeholderTextColor="#B0A99F"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className='absolute right-4 top-3.5 w-6 h-6 justify-center items-center'
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text className='text-base'>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className='mb-7'>
            <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">
              Xác nhận mật khẩu
            </Text>
            <TextInput
              className={`h-[52px] bg-white rounded-2xl px-4 text-[15px] text-[#1A1A1A] border-[1.5px] ${passwordMismatch ? 'border-[#E05252]' : 'border-[#E8E4DF]'}`}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#B0A99F"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
         <TouchableOpacity
            className={`h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center shadow-lg mb-7 ${
              loading ? 'opacity-60' : ''
            }`}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#F8F7F4" />
            ) : (
              <Text className="text-base font-bold text-[#F8F7F4] tracking-wide">
                Đăng ký
              </Text>
            )}
          </TouchableOpacity>
          {/* Sign In Link */}
          <View className='flex-row justify-center items-center'>
              <Text className='text-sm text-[#7A7167]'>Đã có tài khoản?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                    <Text className='text-sm font-bold text-[#1A1A1A] underline'>
                      Đăng nhập
                    </Text>
                </TouchableOpacity>
              </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUp       