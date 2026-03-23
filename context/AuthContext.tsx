import React, { createContext, useState, useContext, ReactNode } from "react";

// 1. Визначаємо, які саме дані ми будемо зберігати (Interface)
interface UserPreferences {
  gender: "male" | "female" | "all";
  distance: number;
  ageRange: [number, number];
  intention: string;
  options: {
    activeOnly: boolean;
    verifiedOnly: boolean;
  };
}

interface AuthContextType {
  user: { id: string; email: string } | null; // Дані юзера
  preferences: UserPreferences; // Його фільтри
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  login: (userData: { id: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Створюємо провайдер, який "огортає" весь додаток
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  // Початкові значення (ті самі, що ми малювали на екрані)
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: "all",
    distance: 10,
    ageRange: [24, 37],
    intention: "Chat",
    options: {
      activeOnly: false,
      verifiedOnly: false,
    },
  });

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const login = (userData: { id: string; email: string }) => {
    setUser(userData);
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, preferences, updatePreferences, login, logout }}
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
