import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/context/AuthContext";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { QUESTIONS, TestAnswers } from "@/constants/Questions";
import { Colors } from "@/constants/Colors";

export default function QuestionsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const saveResults = useMutation(api.questions.saveTestResults);
  const update = useMutation(api.users.updateFilters);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<TestAnswers>({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: [],
    q6: [],
    q7: [],
    q8: [],
    q9: [],
    q10: [],
  });

  const currentQuestion = QUESTIONS[currentStep];

  const toggleOption = (optionId: string) => {
    const questionId = currentQuestion.id as keyof TestAnswers;
    const selected = answers[questionId];

    if (selected.includes(optionId)) {
      setAnswers({
        ...answers,
        [questionId]: selected.filter((id) => id !== optionId),
      });
    } else {
      if (selected.length < 2) {
        setAnswers({ ...answers, [questionId]: [...selected, optionId] });
      } else {
        Alert.alert("Limit reached", "You can select up to 2 options.");
      }
    }
  };

  const handleNext = async () => {
    const questionId = currentQuestion.id as keyof TestAnswers;
    if (answers[questionId].length === 0) {
      Alert.alert("Attention", "Please select at least one option.");
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!user?._id || isSubmitting) return;

      setIsSubmitting(true);
      try {
        if (!user) return;

        await saveResults({
          userId: user?._id,
          testAnswers: answers,
        });

        await update({
          _id: user?._id,
          hasSeenWelcome: true,
          intention: "serious relationship",
          gender: "all",
          ageRange: [18, 100],
        });

        console.log("Navigating to home...");
        // Alert.alert(
        //   "Success",
        //   "Test passed! Serious matching is now available.",
        //   [
        //     {
        //       text: "Continue",
        // onPress: () =>

        router.replace("/");

        //     },
        //   ],
        // );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert("Error", "Could not save results. Please try again.");
      }
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <AppButton
          title="Back"
          variant="pink"
          onPress={() => router.back()}
          // Якщо твоя кнопка підтримує зміну стилю, можна зробити її меншою
          style={{ width: 80, height: 40 }}
        />
      </View>
      <Text>
        Hi! To find a truly serious relationship, others need to know that
        you’re serious too. So, let’s take this quick test!
      </Text>

      <View style={styles.header}>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
        <Text style={styles.subTitle}>Pick 1 or 2 options</Text>

        {currentQuestion.options.map((option) => {
          const questionId = currentQuestion.id as keyof TestAnswers;
          const isSelected = answers[questionId].includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.8}
              style={[styles.optionCard, isSelected && styles.selectedOption]}
              onPress={() => toggleOption(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={
            currentStep === QUESTIONS.length - 1 ? "Complete" : "Next Question"
          }
          onPress={handleNext}
          loading={isSubmitting}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: 15 },
  progressText: { fontSize: 14, color: Colors.textLight, marginBottom: 8 },
  progressBar: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.linkPink,
    borderRadius: 3,
  },
  scrollContent: { paddingVertical: 20 },
  questionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  subTitle: { fontSize: 16, color: Colors.textLight, marginBottom: 25 },
  optionCard: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  selectedOption: {
    borderColor: Colors.linkPink,
    backgroundColor: Colors.inputBack,
  },
  optionText: { fontSize: 16, color: Colors.textMain },
  selectedOptionText: { color: Colors.linkPink, fontWeight: "bold" },
  footer: { paddingVertical: 20 },
  topBar: {
    paddingTop: 10, // Щоб не перекривало камеру зверху
    alignItems: "flex-start", // Кнопка зліва
  },
});
