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

export interface UserPreferences {
  gender: Gender;
  distance: number;
  ageRange: [number, number];
  intention: Intention;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  gender: "all",
  distance: 10,
  ageRange: [24, 38],
  intention: "chatting",
  // options: {
  //   activeOnly: false,
  //   verifiedOnly: false,
  // },
};

export interface UserProfile extends UserPreferences {
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
  hasSeenWelcome: boolean;
  isTestPassed: boolean;
  testAnswers?: TestAnswersMap;
}
