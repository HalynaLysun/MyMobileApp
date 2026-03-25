import { Id } from "@/convex/_generated/dataModel";

export type Gender = "male" | "female" | "all";
export type Intention =
  | "chatting"
  | "serious relationship"
  | "casual dating"
  | "friendship";

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
  id: Id<"users">;
  email: string;
  firstName: string;
  age: number;
  userGender: "male" | "female" | "non-binary";
  city: string;
  bio?: string;
  photoUrl?: string;
}
