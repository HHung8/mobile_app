import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
type Step = 'email' | 'otp' | 'newPassword' | 'done';

const ForotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const steps: Step[] = ['email', 'otp', 'newPassword'];
    const currentIndex = steps.indexOf(step); 

    const handleSendEmail = async () => {
        if(!email.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập email');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/Auth/forgot-password`, {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email.trim()})
            });
            const data = await res.json();
            console.log(`check data response`, data);
            if(!res.ok) {
                Alert.alert('Lỗi', data.message || 'Email không tồn tại');
                return;
            }
            setStep('otp')
        } catch (error) {
            Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () => {
        if(otp.trim().length < 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập đủ mã OTP 6 số');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/Auth/verify-otp`, {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({email: email.trim(), otp:otp.trim()}),
            });
            const text = await res.text();
            console.log(`check data otp`, text)
            if (!res.ok) {
                Alert.alert('Lỗi', text || 'Mã OTP không đúng');
                return;
            }

            setStep('newPassword')
        } catch (error) {
           console.log('verify otp error', error);
           Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    }

    const handleResetPassword = async () => {
        if(!newPassword || !confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if(newPassword.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/Auth/reset-password`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    email:  email.trim(),
                    otp: otp.trim(),
                    newPassword,
                }),
            });
            console.log(`check res resetpassword`,res);
            const data = await res.json();
            console.log(`check data resetpassword`, data);
            if(!res.ok) {
                Alert.alert('Lỗi', data.message || 'Không thể đặt lại mật khẩu');
                return;
            };
            setStep('done');
        } catch (error) {
            Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server')
        } finally {
            setLoading(false);
        }
    }

    const passwordMismatch = confirmPassword != '' && confirmPassword !== newPassword;

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-[#F8F7F4] px-7 justify-center"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4"/>
            
            {/* Back Button */}
            {step !== 'done' && (
                <TouchableOpacity
                className="absolute top-14 left-7 w-10 h-10 bg-white rounded-full justify-center items-center border border-[#E8E4DF]"
                onPress={() => {
                    if (step === 'email') router.back();
                    else if (step === 'otp') setStep('email');
                    else if (step === 'newPassword') setStep('otp');
                }}
                >
                <Text className="text-lg text-[#1A1A1A]">←</Text>
                </TouchableOpacity>
            )}
            {/* Step Progress Bar */}
            {step !== 'done' && (
                <View className="flex-row gap-2 mb-10">
                {steps.map((s, i) => (
                    <View
                    key={s}
                    className={`h-1 rounded-full flex-1 ${
                        i <= currentIndex ? 'bg-[#1A1A1A]' : 'bg-[#E8E4DF]'
                    }`}
                    />
                ))}
                </View>
            )}
            {/* ── STEP 1: Email ── */}
            {step === 'email' && (
                <View>
                <View className="mb-10">
                    <Text
                    className="text-[32px] font-bold text-[#1A1A1A] tracking-tight mb-2"
                    style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                    >
                    Quên mật khẩu?
                    </Text>
                    <Text className="text-[15px] text-[#7A7167] leading-6">
                    Nhập email của bạn, chúng tôi sẽ gửi mã xác nhận.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">Email</Text>
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

                <TouchableOpacity
                    className={`h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center ${loading ? 'opacity-60' : ''}`}
                    // onPress={handleSendEmail}
                    onPress={handleSendEmail}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                    <ActivityIndicator color="#F8F7F4" />
                    ) : (
                    <Text className="text-base font-bold text-[#F8F7F4] tracking-wide">
                        Gửi mã xác nhận
                    </Text>
                    )}
                </TouchableOpacity>
                </View>
            )}
            {/* -- STEP 2: OTP */}
            {step === 'otp' && (
                <View>
                    <View className='mb-10'>
                        <Text
                            className='text-[32px] font-bold text-[#1A1A1A] tracking-tight mb-2'
                            style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                        >
                            Nhận mã OTP
                        </Text>
                        <Text className='text-[15px] text-[#7A7167] leading-6'>
                            Mã xác nhận đã được gửi đến
                            <Text className='font-semibold text-[#1A1A1A]'>{email}</Text>
                        </Text>
                    </View>
                    <View className='mb-6'>
                        <Text className='text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase'>Mã OTP</Text>
                        <TextInput
                            className='h-[62px] bg-white rounded-2xl px-4 text-[28px] font-bold text-[#1A1A1A] border-[1.5px] border-[#E8E4DF] text-center'
                            placeholder='......'
                            placeholderTextColor="#B0A99F"
                            keyboardType='number-pad'
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />
                    </View>
                    <TouchableOpacity
                        className='h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center mb-4'
                        onPress={handleVerifyOtp}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#F8F7F4" />
                            ) : (
                            <Text className='text-base font-bold text-[#F8F7F4] tracking-wide'>
                                Xác nhận
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity className='items-center' onPress={handleSendEmail}>
                        <Text className='text-sm text-[#7A7167]'>
                            Không nhận được mã?{''}
                            <Text className='font-bold text-[#1A1A1A] underline'>Gửi lại</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            )}        

            {/* -- STEP 3: New Password */}
            {step === 'newPassword' && (
                <View>
                    <View className='mb-10'>
                        <Text
                            className="text-[32px] font-bold text-[#1A1A1A] tracking-tight mb-2"
                            style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                        >
                            Mật khẩu mới
                        </Text>
                        <Text className='text-[15px] text-[#7A7167] leading-6'>
                            Tạo mật khâir mới cho tài khoản của bạn 
                        </Text>
                    </View>
                    <View>
                        <Text className="text-xs font-semibold text-[#3D3830] mb-2 tracking-wider uppercase">
                            Mật khẩu mới
                        </Text>
                        <View className='relative'>
                            <TextInput 
                                className="h-[52px] bg-white rounded-2xl px-4 pr-14 text-[15px] text-[#1A1A1A] border-[1.5px] border-[#E8E4DF]"
                                placeholder="Tối thiểu 6 ký tự"
                                placeholderTextColor="#B0A99F"
                                secureTextEntry={!showPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-3.5 w-6 h-6 justify-center items-center"
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text className="text-base">{showPassword ? '🙈' : '👁'}</Text>
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
                        {passwordMismatch && (
                            <Text className="text-xs text-[#E05252] mt-1.5 ml-1">
                                Mật khẩu không khớp
                            </Text>
                        )}
                    </View>

                   <TouchableOpacity
                        className={`h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center ${loading ? 'opacity-60' : ''}`}
                        onPress={handleResetPassword}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                        <ActivityIndicator color="#F8F7F4" />
                        ) : (
                        <Text className="text-base font-bold text-[#F8F7F4] tracking-wide">
                            Đặt lại mật khẩu
                        </Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* ── STEP 4: Done ── */}
            {step === 'done' && (
                <View className='items-center'>
                    <View className="w-20 h-20 bg-[#1A1A1A] rounded-full justify-center items-center mb-8">
                    <Text className="text-white text-4xl font-bold">✓</Text>
                </View>
                    <Text
                        className="text-[32px] font-bold text-[#1A1A1A] mb-3 tracking-tight"
                        style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}
                    >
                        Thành công!
                    </Text>
                    <Text className="text-[15px] text-[#7A7167] text-center leading-6 mb-10 px-4">
                        Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.
                    </Text>
                    <TouchableOpacity
                        className="h-[54px] bg-[#1A1A1A] rounded-2xl justify-center items-center w-full"
                        onPress={() => router.replace('/(auth)/sign-in')}
                        activeOpacity={0.85}
                    >
                        <Text className="text-base font-bold text-[#F8F7F4] tracking-wide">
                            Về trang đăng nhập
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

    </KeyboardAvoidingView>

    )
}

export default ForotPassword