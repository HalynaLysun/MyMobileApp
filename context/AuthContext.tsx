import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  UserProfile,
  UserPreferences,
  DEFAULT_USER_PREFERENCES,
} from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
// 1. Визначаємо, які саме дані ми будемо зберігати (Interface)

interface AuthContextType {
  user: UserProfile | null; // Тепер тут повна інформація про юзера
  isLoading: boolean;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  login: (userData: UserProfile) => Promise<void>; // Зробили асинхронним
  logout: () => Promise<void>; // Зробили асинхронним
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Створюємо провайдер, який "огортає" весь додаток
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [storedId, setStoredId] = useState<string | null>(null);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedId = await AsyncStorage.getItem("userId");
        if (savedId) setStoredId(savedId);
      } catch (e) {
        console.error("Failed to load userId", e);
      } finally {
        setIsStorageLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // 2. Отримуємо повні дані юзера з Convex, якщо знайшли ID в пам'яті
  const dbUser = useQuery(
    api.users.getUser,
    storedId ? { _id: storedId as Id<"users"> } : "skip",
  );
  const isLoading = isStorageLoading || (!!storedId && dbUser === undefined);
  // 3. Коли дані з бази прийшли — синхронізуємо їх з локальним стейтом
  useEffect(() => {
    if (dbUser) {
      setUser({
        ...dbUser,
        ageRange: [dbUser.ageRange[0], dbUser.ageRange[1]] as [number, number],
      } as UserProfile);
    } else if (dbUser === null && storedId && !isStorageLoading) {
      // Якщо Convex відповів null (юзера немає в базі), чистимо все
      setUser(null);
      setStoredId(null);
    }
  }, [dbUser, storedId, isStorageLoading]);

  // Початкові значення (ті самі, що ми малювали на екрані)
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...newPrefs };
    });
  };

  const login = async (userData: UserProfile) => {
    setUser(userData);
    await AsyncStorage.setItem("userId", userData._id);
  };

  const logout = async () => {
    setUser(null);
    setStoredId(null);
    await AsyncStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        preferences: user
          ? (user as UserPreferences)
          : DEFAULT_USER_PREFERENCES,
        updatePreferences,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Кастомний хук для легкого доступу
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
