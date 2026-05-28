import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function RootGuard() {
  const { isLoading, accessToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isAuthGroup = segments[0] === '(auth)';
    const isRootGroup = segments[0] === '(root)';

    console.log('segments:', segments, '| accessToken:', !!accessToken);

    if (!accessToken && !isAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (accessToken && isAuthGroup) {
      router.replace('/(root)/(tabs)');
    }
  }, [accessToken, isLoading, segments]);

  if (isLoading) return null;

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}