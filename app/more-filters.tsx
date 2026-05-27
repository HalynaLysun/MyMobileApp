import { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useAuth } from "@/context/AuthContext";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";

interface MoreFilters {
  distance: number;
  minHeight?: number;
  maxHeight?: number;
  verifiedOnly: boolean;
  onlyNew: boolean;
  smoking?: string;
  alcohol?: string;
  wantChildren?: string;
  religion?: string[];
  zodiac?: string[];
  orientation?: string[];
  relationshipStatus?: string[];
  personalityType?: string[];
}

export default function MoreFiltersScreen() {
  const router = useRouter();
  const { user, updatePreferences, isLoading } = useAuth();

  // Ініціалізуємо стан усіма полями з твого інтерфейсу
  const [filters, setFilters] = useState<MoreFilters>({
    distance: user?.filters?.distance ?? 10000,
    minHeight: user?.filters?.minHeight ?? 150,
    maxHeight: user?.filters?.maxHeight ?? 220,
    verifiedOnly: user?.filters?.verifiedOnly ?? false,
    onlyNew: user?.filters?.onlyNew ?? false,
    smoking: user?.filters?.smoking,
    alcohol: user?.filters?.alcohol,
    wantChildren: user?.filters?.wantChildren,
    religion: user?.filters?.religion ?? [],
    zodiac: user?.filters?.zodiac ?? [],
    orientation: user?.filters?.orientation ?? [],
    relationshipStatus: user?.filters?.relationshipStatus ?? [],
    personalityType: user?.filters?.personalityType ?? [],
  });

  const updateField = (partialFilters: Partial<MoreFilters>) => {
    setFilters((prev) => ({ ...prev, ...partialFilters }));
  };

  const handleSave = async () => {
    console.log("Sending filters to DB:", filters);
    // Використовуємо твій метод з AuthContext
    await updatePreferences(filters);
    router.back();
  };

  return (
    <ScreenContainer withScroll={true}>
      <Text style={styles.header}>Additional Filters</Text>

      {/* Distance Slider */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.sectionLabel}>Distance</Text>
          <Text style={styles.valueText}>{filters.distance} km</Text>
        </View>
        <View style={styles.sliderWrapper}>
          <MultiSlider
            values={[filters.distance]}
            sliderLength={280}
            onValuesChange={(v) => updateField({ distance: v[0] })}
            min={5}
            max={200}
            step={1}
            trackStyle={styles.track}
            selectedStyle={{ backgroundColor: Colors.secondary }}
            unselectedStyle={{ backgroundColor: Colors.inputBorder }}
            customMarker={() => <View style={styles.customMarkerStyle} />}
          />
        </View>
      </View>

      {/* Height Range */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.sectionLabel}>Height</Text>
          <Text style={styles.valueText}>
            {filters.minHeight} - {filters.maxHeight} cm
          </Text>
        </View>
        <View style={styles.sliderWrapper}>
          <MultiSlider
            values={[filters.minHeight || 150, filters.maxHeight || 220]}
            sliderLength={280}
            onValuesChange={(v) => {
              updateField({ minHeight: v[0], maxHeight: v[1] });
            }}
            min={150}
            max={220}
            step={1}
            trackStyle={styles.track}
            selectedStyle={{ backgroundColor: Colors.secondary }}
            unselectedStyle={{ backgroundColor: Colors.inputBorder }}
            customMarker={() => <View style={styles.customMarkerStyle} />}
          />
        </View>
      </View>

      {/* Toggles */}
      <View style={styles.row}>
        <Text style={styles.label}>Verified profiles only</Text>
        <Switch
          value={filters.verifiedOnly}
          onValueChange={(val) => updateField({ verifiedOnly: val })}
          trackColor={{ false: Colors.inputBorder, true: Colors.secondary }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Only new users</Text>
        <Switch
          value={filters.onlyNew}
          onValueChange={(val) => updateField({ onlyNew: val })}
          trackColor={{ false: Colors.inputBorder, true: Colors.secondary }}
        />
      </View>

      {/* Smoking Choice */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Smoking</Text>
        <View style={styles.chipContainer}>
          {["non-smoker", "smoker", "socially"].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.chip,
                filters.smoking === opt && styles.chipActive,
              ]}
              onPress={() => updateField({ smoking: opt })}
            >
              <Text
                style={[
                  styles.chipText,
                  filters.smoking === opt && styles.chipTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <AppButton
        title="Save and Apply"
        onPress={handleSave}
        loading={isLoading}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    color: Colors.textMain,
    textAlign: "center",
  },
  section: { marginBottom: 30 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: "600", color: Colors.textMain },
  valueText: { fontSize: 16, fontWeight: "bold", color: Colors.secondary },
  sliderWrapper: { alignItems: "center", height: 40, justifyContent: "center" },
  track: { height: 6, borderRadius: 3 },
  customMarkerStyle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: Colors.secondary,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, color: Colors.textMain },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  chipText: { color: Colors.textMain },
  chipTextActive: { color: "#fff", fontWeight: "bold" },
  saveButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
