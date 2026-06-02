import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  UserProfile,
  DEFAULT_USER_PREFERENCES,
  UserFilters,
} from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// 1. Визначаємо, які саме дані ми будемо зберігати (Interface)

interface UpdateProfileArgs extends Partial<UserProfile> {
  _id: Id<"users">;
}

interface AuthContextType {
  user: UserProfile | null; // Тепер тут повна інформація про юзера
  isLoading: boolean;
  isSaving: boolean;
  preferences: UserFilters;
  updatePreferences: (newPrefs: Partial<UserFilters>) => void;
  updateUserProfile: (args: UpdateProfileArgs) => Promise<void>;
  login: (userData: UserProfile) => Promise<void>; // Зробили асинхронним
  logout: () => Promise<void>; // Зробили асинхронним
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Створюємо провайдер, який "огортає" весь додаток
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [storedId, setStoredId] = useState<string | null>(null);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    if (dbUser && JSON.stringify(dbUser) !== JSON.stringify(user)) {
      setUser(dbUser as UserProfile);
    } else if (dbUser === null && storedId && !isStorageLoading) {
      // Якщо Convex відповів null (юзера немає в базі), чистимо все
      setUser(null);
      setStoredId(null);
    }
  }, [dbUser, storedId, isStorageLoading, user]);

  const convexUpdateProfile = useMutation(api.users.updateProfile);

  // Початкові значення (ті самі, що ми малювали на екрані)
  const updatePreferences = async (newPrefs: Partial<UserFilters>) => {
    if (!user?._id) return;

    // setUser((prev) => {
    //   if (!prev) return null;
    //   return {
    //     ...prev,
    //     filters: {
    //       ...(prev.filters || DEFAULT_USER_PREFERENCES),
    //       ...newPrefs,
    //     },
    //   };
    // });

    try {
      setIsSaving(true);

      const { hasSeenWelcome, ...cleanFilters } = newPrefs as any;

      const finalFilters = {
        ...(user.filters || DEFAULT_USER_PREFERENCES),
        ...cleanFilters,
      };
      // 2. Відправляємо в базу даних
      // Тепер кожна зміна фільтрів буде автоматично летіти на сервер
      await convexUpdateProfile({
        _id: user._id as Id<"users">,
        filters: finalFilters,
      });
      console.log("Preferences synced with DB");
    } catch (error) {
      console.error("Failed to sync preferences:", error);
      // Можна додати логіку відкату (rollback), якщо база не прийняла зміни
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserProfile = async (args: UpdateProfileArgs) => {
    if (!user?._id) return;

    // 1. ОПТИМІСТИЧНЕ ОНОВЛЕННЯ
    // Ми вручну міняємо setUser, не чекаючи відповіді від бази
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        ...args,
        details: { ...(prev.details || {}), ...(args.details || {}) },
        filters: { ...(prev.filters || {}), ...(args.filters || {}) },
      };
      return updatedUser;
    });

    // 2. ВИКЛИК ТВОЄЇ МУТАЦІЇ
    try {
      setIsSaving(true);
      const { _id, firstName, bio, photoUrl, details, isTestPassed } = args;
      await convexUpdateProfile({
        _id,
        firstName,
        bio,
        photoUrl,
        details,
        isTestPassed,
      });
    } catch (e) {
      console.error("Помилка синхронізації з базою", e);
      // Тут можна додати логіку відкату до старих даних, якщо база видала помилку
    } finally {
      setIsSaving(false);
    }
  };

  const login = async (userData: UserProfile) => {
    await AsyncStorage.setItem("userId", userData._id);
    setStoredId(userData._id);
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    setStoredId(null);
    await AsyncStorage.removeItem("userId");
  };
  console.log("CURRENT USER IN CONTEXT:", user?.details?.intention);
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSaving,
        preferences: user?.filters || DEFAULT_USER_PREFERENCES,
        updatePreferences,
        updateUserProfile,
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
