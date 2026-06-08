// hooks/useAdminProperty.ts
import { useAuth } from "@/context/AuthContext";
import { Property } from "@/types";
import { useState } from "react";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useAdminProperty(
  property: Property | null,
  onDelete?: () => void,                          
  onMarkSold?: (updated: Property) => void      
) {
  const { accessToken } = useAuth();
  const [markSoldLoading, setMarkSoldLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    accept: "*/*",
    Authorization: `Bearer ${accessToken}`,
  };

  // DELETE /api/Admin/properties/{id}
  const deleteProperty = () => {
    if (!property) return;
    Alert.alert("Delete Property", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleteLoading(true);
          try {
            const res = await fetch(`${API_URL}/Admin/properties/${property.id}`, {
              method: "DELETE",
              headers,
            });
            if (res.ok) onDelete?.();            // → router.replace("/(root)/(tabs)")
            else console.error("deleteProperty failed", res.status);
          } catch (e) {
            console.error("deleteProperty error", e);
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  // PUT /api/Admin/properties/{id} — giữ nguyên toàn bộ, chỉ đổi isSold: true
  const markSold = () => {
    if (!property) return;
    Alert.alert("Mark as Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          setMarkSoldLoading(true);
          try {
            const res = await fetch(`${API_URL}/Admin/properties/${property.id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({
                title: property.title,
                description: property.description,
                price: property.price,
                type: property.type,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                areaSqft: property.area_sqft,
                address: property.address,
                city: property.city,
                latitude: property.latitude,
                longitude: property.longitude,
                images: property.images,
                isFeatured: property.isFeatured,
                isSold: true,
              }),
            });
            if (res.ok) {
              // ✅ cập nhật local state ngay, không cần refetch — giống logic của họ
              onMarkSold?.({ ...property, isSold: true });
            } else {
              console.error("markSold failed", res.status);
            }
          } catch (e) {
            console.error("markSold error", e);
          } finally {
            setMarkSoldLoading(false);
          }
        },
      },
    ]);
  };
 
  return { markSold, markSoldLoading, deleteProperty, deleteLoading };
}