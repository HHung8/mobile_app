import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Language = 'vi' | 'en';
type Theme = 'light' | 'dark' | 'system';

const LANGUAGES: {value: Language; label: string; flag: string}[] = [
    {value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳'},
    {value: 'en', label: 'English', flag: '🇺🇸'},
]

const THEMES: {value: Theme, label: string, icon:string}[] = [
    {value: 'light', label: 'Sáng', icon: 'sunny-outline'},
    {value: 'dark', label: 'Tối', icon: 'moon-outline'},
    {value: 'system', label: 'Hệ thống', icon: 'phone-portrait-outline'},
];

const SectionTitle = ({title}:{title:string}) => (
    <Text className='text-xs font-semibold text-gray-400 uppercase tracking-widest px-5 mb-2 mt-6'>
        {title}
    </Text>
)


const SettingRow = ({
  icon, label, value, onPress, colors
}: {
  icon: string; label: string; value?: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ borderBottomColor: colors.border, borderBottomWidth: 1, backgroundColor: colors.bgCard }}
    className='flex-row items-center px-4 py-4'
  >
    <View style={{ backgroundColor: colors.iconBg }}
      className='w-9 h-9 rounded-xl items-center justify-center mr-3'>
      <Ionicons name={icon as any} size={18} color={colors.iconColor} />
    </View>
    <Text style={{ color: colors.text }} className="flex-1 text-base font-medium">{label}</Text>
    {value && <Text style={{ color: colors.textMuted }} className='text-sm mr-2'>{value}</Text>}
    <Ionicons name='chevron-forward' size={18} color={colors.textMuted} />
  </TouchableOpacity>
);

function OptionModal<T extends string>({
  visible, title, options, selected, onSelect, onClose, renderLabel, colors
}: {
  visible: boolean; title: string; options: T[]; selected: T;
  onSelect: (v: T) => void; onClose: () => void;
  renderLabel: (v: T) => string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity className='flex-1 bg-black/40 justify-end' activeOpacity={1} onPress={onClose}>
        <View style={{ backgroundColor: colors.bgCard }} className='rounded-t-3xl px-5 pt-5 pb-10'>
          <View className='w-10 h-1 bg-gray-400 rounded-full self-center mb-5' />
          <Text style={{ color: colors.text }} className='text-lg font-bold mb-4'>{title}</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { onSelect(opt); onClose(); }}
              style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }}
              className="flex-row items-center py-4"
            >
              <Text style={{ color: colors.text }} className="flex-1 text-base">{renderLabel(opt)}</Text>
              {selected === opt && <Ionicons name="checkmark-circle" size={22} color={colors.iconColor} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function SettingsScreen() {
  const { language, theme, setLanguage, setTheme } = useSettingsStore();
  const {signOut} = useAuth();
  const { colors, isDark } = useTheme();  // ✅ lấy colors hex
  const [showLangModal, setShowLangModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.value === language);
  const currentTheme = THEMES.find((t) => t.value === theme);
  const handleSignOut = () => { signOut() };

  return (
    // ✅ dùng style thay vì className cho màu nền
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPage }}>
      {/* Header */}
      <View className='flex-row items-center px-5 py-4'>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.bgCard }}
          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
        >
          <Ionicons name='arrow-back' size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className='text-xl font-bold'>Cài đặt</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Giao diện */}
        <Text style={{ color: colors.textMuted }}
          className='text-xs font-semibold uppercase tracking-widest px-5 mb-2 mt-6'>
          Giao diện
        </Text>
        <View style={{ backgroundColor: colors.bgCard, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' }}>
          <SettingRow
            icon="moon-outline"
            label="Theme"
            value={currentTheme?.label}
            onPress={() => setShowThemeModal(true)}
            colors={colors}
          />
          <SettingRow
            icon="language-outline"
            label="Ngôn ngữ"
            value={`${currentLang?.flag} ${currentLang?.label}`}
            onPress={() => setShowLangModal(true)}
            colors={colors}
          />
        </View>

        {/* Section Thông tin */}
        <Text style={{ color: colors.textMuted }}
          className='text-xs font-semibold uppercase tracking-widest px-5 mb-2 mt-6'>
          Thông tin
        </Text>
        <View style={{ backgroundColor: colors.bgCard, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
          <View className='flex-row items-center px-4 py-4'>
            <View style={{ backgroundColor: colors.iconBg }}
              className='w-9 h-9 rounded-xl items-center justify-center mr-3'>
              <Ionicons name="information-circle-outline" size={18} color={colors.iconColor} />
            </View>
            <Text style={{ color: colors.text }} className='flex-1 text-base font-medium'>Phiên bản</Text>
            <Text style={{ color: colors.textMuted }} className='text-sm'>1.0.0</Text>
          </View>
        </View>
      </ScrollView>


       {/* Sign Out */}
      <View style={{ paddingHorizontal: 20, marginTop: 'auto', marginBottom: 32 }}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: isDark ? '#2D1515' : '#FEF2F2',
            paddingVertical: 16, borderRadius: 16,
            borderWidth: 1, borderColor: isDark ? '#7F1D1D' : '#FECACA' }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontWeight: '600', marginLeft: 8, fontSize: 15 }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <OptionModal
        visible={showThemeModal}
        title="Chọn theme"
        options={THEMES.map((t) => t.value)}
        selected={theme}
        onSelect={setTheme}
        onClose={() => setShowThemeModal(false)}
        renderLabel={(v) => THEMES.find((x) => x.value === v)!.label}
        colors={colors}
      />
      <OptionModal
        visible={showLangModal}
        title="Chọn ngôn ngữ"
        options={LANGUAGES.map((l) => l.value)}
        selected={language}
        onSelect={setLanguage}
        onClose={() => setShowLangModal(false)}
        renderLabel={(v) => {
          const l = LANGUAGES.find((x) => x.value === v)!;
          return `${l.flag} ${l.label}`;
        }}
        colors={colors}
      />
    </SafeAreaView>
  );
}