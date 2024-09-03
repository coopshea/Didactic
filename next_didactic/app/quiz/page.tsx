'use client';
import { useState } from 'react';

const questions = [
  {
    id: 1,
    text: 'What is React?',
    options: ['A JavaScript library', 'A programming language', 'A database', 'An operating system'],
    correctAnswer: 'A JavaScript library',
  },
  // Add more questions here
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz Completed</h1>
        <p className="text-xl">Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="text-xl mb-4">{questions[currentQuestion].text}</p>
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full p-2 text-left bg-gray-100 hover:bg-gray-200 rounded"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}