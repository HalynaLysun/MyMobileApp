export type Gender = "male" | "female" | "all";
export type Intention =
  | "dating"
  | "friendship"
  | "chat"
  | "serious relationship";

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
  intention: "chat",
  // options: {
  //   activeOnly: false,
  //   verifiedOnly: false,
  // },
};

export interface UserProfile extends UserPreferences {
  id: string;
  email: string;
  firstName: string;
  age: number;
  userGender: "male" | "female" | "non-binary";
  city: string;
  bio?: string;
  photoUrl?: string;
}
