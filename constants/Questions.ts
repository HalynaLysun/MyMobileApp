export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export type TestAnswers = {
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
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "What does a 'perfect' day look like to you?",
    options: [
      { id: "a", text: "Quiet, cozy, and productive (home/cafe)" },
      { id: "b", text: "Active adventure and exploring new places" },
      { id: "c", text: "Socializing with friends and having fun" },
      { id: "d", text: "Relaxed, no plans, just going with the flow" },
    ],
  },
  {
    id: "q2",
    title: "What is your biggest deal-breaker in a relationship?",
    options: [
      { id: "a", text: "Dishonesty and keeping secrets" },
      { id: "b", text: "Lack of ambition or personal goals" },
      { id: "c", text: "Emotional coldness or lack of empathy" },
      { id: "d", text: "Disrespect for personal boundaries" },
    ],
  },
  {
    id: "q3",
    title: "How do you usually handle stress or bad news?",
    options: [
      { id: "a", text: "I need complete solitude to process it" },
      { id: "b", text: "I need to vent and talk it out immediately" },
      { id: "c", text: "I go into 'solve mode' and take action" },
      { id: "d", text: "I distract myself with hobbies or work" },
    ],
  },
  {
    id: "q4",
    title: "What is your primary 'love language'?",
    options: [
      { id: "a", text: "Words of affirmation and support" },
      { id: "b", text: "Quality time and undivided attention" },
      { id: "c", text: "Physical touch and closeness" },
      { id: "d", text: "Acts of service or thoughtful gifts" },
    ],
  },
  {
    id: "q5",
    title: "How do you balance planning vs spontaneity?",
    options: [
      { id: "a", text: "I am a strict planner, I hate surprises" },
      { id: "b", text: "I am 100% spontaneous, live for the moment" },
      { id: "c", text: "I plan work, but I am flexible in life" },
      { id: "d", text: "I plan basics but leave room for fun" },
    ],
  },
  {
    id: "q6",
    title: "What is your main long-term priority right now?",
    options: [
      { id: "a", text: "Building a stable and loving family" },
      { id: "b", text: "Reaching a high level of career success" },
      { id: "c", text: "Financial independence and security" },
      { id: "d", text: "Personal growth and self-discovery" },
    ],
  },
  {
    id: "q7",
    title: "How much 'alone time' do you need to be happy?",
    options: [
      { id: "a", text: "Almost none, I love being social" },
      { id: "b", text: "A healthy balance (daily solo time)" },
      { id: "c", text: "I highly value my space and independence" },
      { id: "d", text: "A few hours a week is enough for me" },
    ],
  },
  {
    id: "q8",
    title: "Which budget model is closest to your ideal?",
    options: [
      { id: "a", text: "Joint: everything in one pot" },
      { id: "b", text: "Separate: each for their own" },
      { id: "c", text: "Hybrid: shared expenses + personal money" },
      {
        id: "d",
        text: "One focuses more on the finances, and the other cares more for other important parts in family life",
      },
    ],
  },
  {
    id: "q9",
    title: "What is your honest view on having children?",
    options: [
      { id: "a", text: "I want biological children in the future" },
      { id: "b", text: "I am open to adoption or fostering" },
      { id: "c", text: "I prefer a child-free lifestyle" },
      { id: "d", text: "I already have kids and they are my priority" },
    ],
  },
  {
    id: "q10",
    title: "How do you behave during a disagreement?",
    options: [
      { id: "a", text: "Discuss everything calmly right away" },
      { id: "b", text: "I need some time to be alone first" },
      { id: "c", text: "Express emotions strongly, then cool down" },
      { id: "d", text: "Avoid conflicts as much as possible" },
    ],
  },
];
