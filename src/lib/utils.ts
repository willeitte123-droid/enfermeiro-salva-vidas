import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "@/context/QuestionsContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shuffleQuestionOptions = (question: Question): Question => {
  if (!question || !question.options || question.options.length === 0) {
    return question;
  }

  // 1. Encontre o texto da resposta correta antes de embaralhar.
  const correctAnswerOption = question.options.find(opt => opt.id === question.correctAnswer);
  if (!correctAnswerOption) {
    // Retorna a questão original se a resposta correta não for encontrada (salvaguarda).
    return question;
  }
  const correctAnswerText = correctAnswerOption.text;

  // 2. Crie uma nova array com os textos das opções e embaralhe-a (algoritmo Fisher-Yates).
  const optionTexts = question.options.map(opt => opt.text);
  for (let i = optionTexts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionTexts[i], optionTexts[j]] = [optionTexts[j], optionTexts[i]];
  }

  // 3. Crie a nova array de opções com os IDs originais ('A', 'B', etc.) mas com os textos embaralhados.
  let newCorrectAnswerId = '';
  const shuffledOptions = question.options.map((opt, index) => {
    const newText = optionTexts[index];
    if (newText === correctAnswerText) {
      // O ID ('A', 'B', etc.) desta posição é a nova resposta correta.
      newCorrectAnswerId = opt.id;
    }
    return { ...opt, text: newText };
  });

  // 4. Retorne o objeto da questão modificado com as opções embaralhadas e a nova resposta correta.
  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswerId,
  };
};