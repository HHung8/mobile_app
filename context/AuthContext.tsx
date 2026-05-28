import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType { 
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    signIn: (accessToken: string, refreshToken: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadTokens = async () => {
        try{
            const storedAccess = await SecureStore.getItemAsync('accessToken');
            const storedRefresh = await SecureStore.getItemAsync('refreshToken');
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
        }catch(e){
            console.error('Failed to load tokens', e);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTokens();
    }, []); 
    
    const signIn = async (access: string, refresh:string) => {
        await SecureStore.setItemAsync('accessToken', access);
        await SecureStore.setItemAsync('refreshToken', refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
    }

    const signOut = async () => {
        try {
            const token = await SecureStore.getItemAsync('refreshToken');
            if(token) {
                await fetch(`${process.env.EXPO_PUBLIC_API_URL}/Auth/logout`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({refreshToken: token}),
                });
            }
        } catch (error) {
            console.error('Error occurred while logging out', error);
        } finally {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            setAccessToken(null);
            setRefreshToken(null);
        }
    }

   return (
    <AuthContext.Provider value={{accessToken, refreshToken, isLoading, signIn, signOut}}>
        {children}
    </AuthContext.Provider>
   )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}