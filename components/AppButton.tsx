import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

// Описуємо типи для пропсів [cite: 2026-01-24]
interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "pink" | "blue" | "white"; // Твої три варіанти [cite: 2026-01-24]
  icon?: React.ReactNode;
  isActive?: boolean;
  textSize?: number;
  // Для визначення активного стану (якщо потрібно) [cite: 2026-01-24]
}

export default function AppButton({
  title,
  variant = "pink",
  icon,
  isActive = false,
  textSize = 18,
  style,
  ...props
}: AppButtonProps) {
  // Логіка визначення кольорів [cite: 2026-01-24]
  const getStyles = () => {
    if (isActive) {
      return { bg: Colors.primary, text: Colors.white };
    }

    switch (variant) {
      case "blue":
        return {
          bg: Colors.primary, // Твій синій з Colors.ts [cite: 2026-01-24]
          text: Colors.white,
        };
      case "white":
        return {
          bg: Colors.white,
          text: Colors.textMain, // Чорний текст [cite: 2026-01-24]
        };
      case "pink":
      default:
        return {
          bg: Colors.secondary, // Рожевий акцент [cite: 2026-01-24]
          text: Colors.white,
        };
    }
  };

  const currentStyle = getStyles();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentStyle.bg }, style]}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.text,
            { color: currentStyle.text },
            textSize ? { fontSize: textSize } : null,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
    // Тіні для солідного вигляду (Web + iOS + Android) [cite: 2026-01-14]
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    // @ts-ignore
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 5,
  },
  text: {
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

// import React from "react";
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   TouchableOpacityProps,
//   View,
// } from "react-native";
// import { Colors } from "../constants/Colors";

// interface AppButtonProps extends TouchableOpacityProps {
//   title: string;
//   variant?: "primary" | "secondary";
//   isActive?: boolean;
//   icon?: React.ReactNode;
// }

// export default function AppButton({
//   title,
//   variant = "primary",
//   isActive,
//   icon,
//   style,
//   ...props
// }: AppButtonProps) {
//   const getBackgroundColor = () => {
//     if (variant === "primary") return Colors.secondary; // Рожева завжди рожева [cite: 2026-01-24]
//     return isActive ? Colors.primary : Colors.white; // Блакитна або Біла [cite: 2026-01-24]
//   };

//   // 2. Визначаємо колір тексту [cite: 2026-01-24]
//   const getTextColor = () => {
//     if (variant === "primary") return Colors.white;
//     return isActive ? Colors.white : Colors.primary;
//   };
//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         { backgroundColor: getBackgroundColor() },
//         variant === "secondary" ? styles.secondary : styles.primary,
//         style, // Дозволяємо додавати зовнішні стилі [cite: 2026-01-24]
//       ]}
//       activeOpacity={0.8} // Ефект при натисканні [cite: 2026-01-14]
//       {...props}
//     >
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
//         <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     height: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//     marginVertical: 10,
//     // Додаємо солідну тінь для "дорогого" вигляду [cite: 2026-01-14]
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 12,
//     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//   },
//   primary: {
//     backgroundColor: Colors.secondary, // Твій фірмовий рожевий [cite: 2026-01-24]
//   },
//   secondary: {
//     backgroundColor: Colors.white, // Твій блакитний [cite: 2026-01-24]
//   },
//   text: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
// });
