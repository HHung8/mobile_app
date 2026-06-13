import { useSettingsStore } from "@/store/useSettingsStore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

const lightColors = {
  bg: '#FFFFFF',
  bgPage: '#F9FAFB',
  bgCard: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#F3F4F6',
  iconBg: '#EFF6FF',
  iconColor: '#2563EB',
};

const darkColors = {
  bg: '#1F2937',
  bgPage: '#111827',
  bgCard: '#1F2937',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  border: '#374151',
  iconBg: '#1E3A5F',
  iconColor: '#60A5FA',
};

interface ThemeContextType {
    isDark: boolean;
    colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    colors: lightColors,
})

export function ThemeProvider({children}: {children: React.ReactNode}) {
    const {theme} = useSettingsStore();
    const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme());

    // Lắng nghe system theme thay đổi
    useEffect(() => {
        const sub = Appearance.addChangeListener(({colorScheme}) => {
            setSystemScheme(colorScheme)
        });
        return () => sub.remove();
    }, []);

    const isDark = 
        theme === 'dark' ? true :
        theme === 'light' ? false :
        systemScheme === 'dark';

    return (
        <ThemeContext.Provider value={{isDark, colors: isDark ? darkColors : lightColors}} >
            {children}
        </ThemeContext.Provider>
    );    
}

export const useTheme = () => useContext(ThemeContext);

