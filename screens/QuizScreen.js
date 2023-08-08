import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../config/theme';

const QuizScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const quizQuestions = [
    {
      question: 'Ich verspüre ein starkes Bedürfnis nach Schlaf.',
      category: 'Schlaf',
      recommendation: 'Nutze unseren Schlaf-Tracker, um deinen Schlaf zu verbessern.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich verspüre ein starkes Bedürfnis nach Flüssigkeitszufuhr.',
      category: 'Trinken',
      recommendation: 'Probier unseren Drink Reminder aus, um ausreichend zu trinken.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich fühle mich oft gestresst.',
      category: 'Stress',
      recommendation: 'Versuche unsere Atemübungen, um Stress abzubauen.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich fühle mich von meinen Gefühlen erschlagen.',
      category: 'Emotionen',
      recommendation: 'Nutze den Stimmungstracker und Journal, um deine Gefühle zu verstehen.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich möchte gerne Hilfe anonym erhalten',
      category: 'Soziale Hilfe',
      recommendation: 'Tritt unserem anonymen Netzwerk bei, um frei Fragen zu stellen.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich brauche mehr Motivation.',
      category: 'Motivation',
      recommendation: 'Nutze unseren Motivations-Tracker, um motiviert zu bleiben.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich habe Schwierigkeiten, diszipliniert zu bleiben.',
      category: 'Disziplin',
      recommendation: 'Versuche unser Ziel-Journal, um disziplinierter zu werden.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
    {
      question: 'Ich strebe nach Selbstverwirklichung.',
      category: 'Selbstverwirklichung',
      recommendation: 'Höre unseren Podcast der Erleuchtung, um dich selbst zu verwirklichen.',
      answers: ['Trifft nicht zu', 'Neutral', 'Trifft zu'],
    },
   
  ];

  const handleAnswerSelect = (answer) => {
    const selectedQuestion = quizQuestions[currentQuestion];
    const updatedAnswers = [...answers, { answer, category: selectedQuestion.category, recommendation: selectedQuestion.recommendation }];
    setAnswers(updatedAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (updatedAnswers.length === quizQuestions.length) {
      calculateRecommendation(updatedAnswers);
    }
  };

  const calculateRecommendation = (updatedAnswers) => {
    let recommendation = 'Basierend auf deinen Antworten, solltest du an folgenden Bedürfnissen arbeiten:\n\n';
    updatedAnswers.forEach(({ answer, category, recommendation: rec }) => {
      if (answer === 'Trifft zu') {
        recommendation += ` - ${category}: ${rec}\n`;
      }
    });

    setResult(recommendation);
  };

  return (
    <View style={styles.container}>
      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => restartQuiz()}>
            <Text style={styles.restartButtonText}>Quiz neu starten</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.question}>{quizQuestions[currentQuestion].question}</Text>
          {quizQuestions[currentQuestion].answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.answerButton}
              onPress={() => handleAnswerSelect(answer)}
            >
              <Text style={styles.answerText}>{answer}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
  },
  answerButton: {
    backgroundColor: Colors.purple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  answerText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: Colors.purple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  restartButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
