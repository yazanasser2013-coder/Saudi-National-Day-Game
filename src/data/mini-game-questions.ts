import type { TrueFalseQuestion, TypingQuestion, SortQuestion } from "../types/game";

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  { id: "TF01", statement: "اليوم الوطني السعودي يُحتفل به في 23 سبتمبر", isTrue: false, difficulty: "easy", basePoints: 200 },
  { id: "TF02", statement: "الملك عبدالعزيز هو مؤسس المملكة العربية السعودية", isTrue: true, difficulty: "easy", basePoints: 200 },
  { id: "TF03", statement: "عاصمة المملكة العربية السعودية هي جدة", isTrue: false, difficulty: "easy", basePoints: 200 },
  { id: "TF04", statement: "العلم السعودي مكتوب عليه كلمة التوحيد", isTrue: true, difficulty: "easy", basePoints: 200 },
  { id: "TF05", statement: "تأسست المملكة العربية السعودية عام 1935م", isTrue: false, difficulty: "easy", basePoints: 200 },
  { id: "TF06", statement: "السعودية دولة إسلامية تستند إلى القرآن والسنة", isTrue: true, difficulty: "easy", basePoints: 200 },
  { id: "TF07", statement: "أول بئر نفطية في السعودية اكتُشفت في الدمام", isTrue: true, difficulty: "hard", basePoints: 300 },
  { id: "TF08", statement: "جامعة الملك سعود هي أول جامعة في المملكة", isTrue: false, difficulty: "hard", basePoints: 300 },
  { id: "TF09", statement: "المملكة العربية السعودية بها 13 منطقة إدارية", isTrue: true, difficulty: "hard", basePoints: 300 },
  { id: "TF10", statement: "الملك فهد هو من قام بتوحيد المملكة", isTrue: false, difficulty: "hard", basePoints: 300 },
  { id: "TF11", statement: "اللغة الرسمية في المملكة هي العربية", isTrue: true, difficulty: "easy", basePoints: 200 },
  { id: "TF12", statement: "مكة المكرمة هي عاصمة المملكة العربية السعودية", isTrue: false, difficulty: "easy", basePoints: 200 },
  { id: "TF13", statement: "الزكاة هي الضرية على النفط في السعودية", isTrue: false, difficulty: "hard", basePoints: 300 },
  { id: "TF14", statement: "نظام المناطق الإدارية صدر عام 1992م", isTrue: true, difficulty: "hard", basePoints: 300 },
  { id: "TF15", statement: "المملكة تقع في شبه الجزيرة العربية", isTrue: true, difficulty: "easy", basePoints: 200 },
];

export const TYPING_QUESTIONS: TypingQuestion[] = [
  { id: "TP01", question: "ما اسم مؤسس المملكة العربية السعودية؟", acceptedAnswers: ["عبدالعزيز", "عبد العزيز", "ابن سعود"], difficulty: "easy", basePoints: 300 },
  { id: "TP02", question: "ما هي عاصمة المملكة العربية السعودية؟", acceptedAnswers: ["الرياض"], difficulty: "easy", basePoints: 300 },
  { id: "TP03", question: "في أي عام تأسست المملكة العربية السعودية؟", acceptedAnswers: ["1932", "1351", "1351هـ"], difficulty: "easy", basePoints: 300 },
  { id: "TP04", question: "ما اسم الشعار الموجود على العلم السعودي؟", acceptedAnswers: ["التوحيد", "شهادة التوحيد", "لا اله الا الله"], difficulty: "hard", basePoints: 400 },
  { id: "TP05", question: "من هو الملك الحالي للمملكة العربية السعودية؟", acceptedAnswers: ["سلمان", "الملك سلمان", "سلمان بن عبدالعزيز"], difficulty: "easy", basePoints: 300 },
  { id: "TP06", question: "ما هي أقدم مدينة في المملكة العربية السعودية؟", acceptedAnswers: ["مكة", "مكة المكرمة"], difficulty: "hard", basePoints: 400 },
  { id: "TP07", question: "كم عدد أبناء الملك عبدالعزيز الذكور؟", acceptedAnswers: ["36", "36 ولد", "36 ولدا"], difficulty: "hard", basePoints: 400 },
  { id: "TP08", question: "ما اسم أول بئر نفطية في المملكة؟", acceptedAnswers: ["الدمام", "بئر الدمام", "بئر الدمام رقم 7"], difficulty: "hard", basePoints: 400 },
  { id: "TP09", question: "ما هي اللغة الرسمية في المملكة العربية السعودية؟", acceptedAnswers: ["العربية", "اللغة العربية"], difficulty: "easy", basePoints: 300 },
  { id: "TP10", question: "في أي تاريخ هجري تم تأسيس المملكة؟", acceptedAnswers: ["1351", "1351هـ", "21 جمادى الأولى 1351"], difficulty: "hard", basePoints: 400 },
  { id: "TP11", question: "ما اسم المنطقة التي يقع فيها الرياض؟", acceptedAnswers: ["المنطقة الوسطى", "نجد"], difficulty: "hard", basePoints: 400 },
  { id: "TP12", question: "كم عدد أبناء الملك سلمان من الذكور؟", acceptedAnswers: ["6", "6 ولد", "ستة"], difficulty: "hard", basePoints: 400 },
  { id: "TP13", question: "ما هو اسم أول صحيفة في المملكة؟", acceptedAnswers: ["اليوم", "جريدة اليوم"], difficulty: "hard", basePoints: 400 },
  { id: "TP14", question: "ما هي أطول منطقة في المملكة من حيث المساحة؟", acceptedAnswers: ["المنطقة الشرقية"], difficulty: "hard", basePoints: 400 },
  { id: "TP15", question: "ما اسم العاصمة السعودية؟", acceptedAnswers: ["الرياض"], difficulty: "easy", basePoints: 300 },
];

export function getShuffledTrueFalse(count: number = 15): TrueFalseQuestion[] {
  const shuffled = [...TRUE_FALSE_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getShuffledTyping(count: number = 10): TypingQuestion[] {
  const shuffled = [...TYPING_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const SORT_QUESTIONS: SortQuestion[] = [
  {
    id: "SO01",
    instruction: "رتب الأحداث من الأقدم إلى الأحدث",
    items: ["تأسيس المملكة", "اكتشاف النفط", "نظام المناطق الإدارية", "أول جامعة حكومية"],
    correctOrder: [0, 1, 3, 2],
    difficulty: "easy",
    basePoints: 200,
  },
  {
    id: "SO02",
    instruction: "رتب الملوك حسب ترتيب الحكم",
    items: ["الملك فهد", "الملك عبدالعزيز", "الملك سلمان", "الملك عبدالله"],
    correctOrder: [1, 0, 3, 2],
    difficulty: "easy",
    basePoints: 200,
  },
  {
    id: "SO03",
    instruction: "رتب الأحداث من الأقدم إلى الأحدث",
    items: ["توحيد الحجاز", "فتح الرياض", "استعادة الأحساء", "توحيد نجد والحجاز"],
    correctOrder: [2, 1, 0, 3],
    difficulty: "hard",
    basePoints: 300,
  },
  {
    id: "SO04",
    instruction: "رتب المنشآت حسب تاريخ الإنشاء",
    items: ["جامعة الملك سعود", "أول خط بحري", "أول بئر نفطية", "أول صحيفة سعودية"],
    correctOrder: [2, 1, 3, 0],
    difficulty: "hard",
    basePoints: 300,
  },
  {
    id: "SO05",
    instruction: "رتب الأحداث من الأقدم إلى الأحدث",
    items: ["إعلان التوحيد", "معركة جزيرة النعيم", "استرداد الأحساء", "تأسيس نجد"],
    correctOrder: [3, 2, 1, 0],
    difficulty: "easy",
    basePoints: 200,
  },
  {
    id: "SO06",
    instruction: "رتب الإنجازات حسب تاريخ الإنجاز",
    items: ["شبكة الطرق السريعة", "الأولمبياد الخاص", " Metro الرياض", "نيوم"],
    correctOrder: [0, 1, 2, 3],
    difficulty: "hard",
    basePoints: 300,
  },
  {
    id: "SO07",
    instruction: "رتب الملوك من أول إلى آخر",
    items: ["الملك عبدالله", "الملك سلمان", "الملك فهد", "الملك عبدالعزيز"],
    correctOrder: [3, 2, 0, 1],
    difficulty: "easy",
    basePoints: 200,
  },
  {
    id: "SO08",
    instruction: "رتب الأحداث من الأقدم إلى الأحدث",
    items: ["تأسيس هيئة الترفيه", "رؤية 2030", "افتتاح برج المملكة", "أول رحلة فضائية سعودية"],
    correctOrder: [2, 1, 0, 3],
    difficulty: "hard",
    basePoints: 300,
  },
  {
    id: "SO09",
    instruction: "رتب الكيانات حسب تاريخ التأسيس",
    items: ["هيئة الاتصالات", "الهيئة العامة للترفيه", "صندوق الاستثمارات العامة", "نيوم"],
    correctOrder: [0, 2, 1, 3],
    difficulty: "hard",
    basePoints: 300,
  },
  {
    id: "SO10",
    instruction: "رتب الأحداث من الأقدم إلى الأحدث",
    items: ["توحيد نجد", "توحيد الحجاز", "التوحيد الكامل", "نظامAreas"],
    correctOrder: [0, 1, 2, 3],
    difficulty: "easy",
    basePoints: 200,
  },
];

export function getShuffledSort(count: number = 10): SortQuestion[] {
  const shuffled = [...SORT_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
