import { createContext, useState, useContext, ReactNode } from "react";
import {
  UserProfile,
  UserPreferences,
  DEFAULT_USER_PREFERENCES,
} from "@/types/user";
// 1. Визначаємо, які саме дані ми будемо зберігати (Interface)

interface AuthContextType {
  user: UserProfile | null; // Тепер тут повна інформація про юзера
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  login: (userData: UserProfile) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Створюємо провайдер, який "огортає" весь додаток
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Початкові значення (ті самі, що ми малювали на екрані)
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...newPrefs };
    });
  };

  const login = (userData: UserProfile) => {
    setUser(userData);
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
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
