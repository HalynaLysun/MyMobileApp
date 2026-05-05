import { Id } from "@/convex/_generated/dataModel";

export type Gender = "male" | "female" | "all";
export type Intention =
  | "chatting"
  | "serious relationship"
  | "casual dating"
  | "friendship";

export type UserGender = "male" | "female" | "non-binary";

export interface TestAnswersMap {
  q1: string[];
  q2: string[];
  q3: string[];
  q4: string[];
  q5: string[];
  q6: string[];
  q7: string[];
  q8: string[];
  q9: string[];
  q10: string[];
}

export interface UserFilters {
  gender: Gender;
  distance: number;
  ageRange: [number, number]; // Кортеж для мінімального та максимального віку
  intention: Intention;
  verifiedOnly: boolean; // Додано згідно з новою схемою
  onlyNew: boolean;
  minHeight?: number;
  maxHeight?: number;
  smoking?: string;
  alcohol?: string;
  wantChildren?: string;
  religion?: string[];
  zodiac?: string[];
  orientation?: string[];
  relationshipStatus?: string[];
  personalityType?: string[]; // Додано згідно з новою схемою
}

export interface UserDetails {
  intention: Intention;
  height?: number;
  zodiac?: string;
  smoking?: string;
  alcohol?: string;
  religion?: string[];
  personalityType?: string[];
  wantChildren?: string;
  relationshipStatus?: string;
}

// export interface UserPreferences {
//   gender: Gender;
//   distance: number;
//   ageRange: [number, number];
//   intention: Intention;
// }

export const DEFAULT_USER_PREFERENCES: UserFilters = {
  gender: "all",
  distance: 10,
  ageRange: [24, 38],
  intention: "chatting",
  verifiedOnly: false,
  onlyNew: false,
  minHeight: 150, // додай значення за замовчуванням
  maxHeight: 200,
};

export interface UserProfile {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  password?: string;
  firstName: string;
  age: number;
  userGender: UserGender;
  city: string;
  bio?: string;
  photoUrl?: string;
  createdAt: number;
  updatedAt?: number;
  isVerified: boolean;
  hasSeenWelcome: boolean;
  isTestPassed: boolean;
  testAnswers?: TestAnswersMap;
  filters: UserFilters;
  details: UserDetails;
}
