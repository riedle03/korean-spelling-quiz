import { GoogleGenAI, Type } from "@google/genai";
import { QuizData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizObjectSchema = {
    type: Type.OBJECT,
    properties: {
        sentence: {
            type: Type.STRING,
            description: "퀴즈를 풀 단어가 들어갈 자리를 '__'로 표시한, 자연스러운 한국어 문장입니다.",
        },
        correctWord: {
            type: Type.STRING,
            description: "맞춤법에 맞는 정확한 단어입니다.",
        },
        incorrectWord: {
            type: Type.STRING,
            description: "자주 틀리는 형태의 단어입니다.",
        },
        explanation: {
            type: Type.STRING,
            description: "왜 그 단어가 정답이고 다른 단어는 오답인지, 그 핵심 차이를 10대들이 이해하기 쉽게 한 문장으로 설명합니다."
        }
    },
    required: ["sentence", "correctWord", "incorrectWord", "explanation"],
};

const quizBatchSchema = {
    type: Type.ARRAY,
    items: quizObjectSchema
};

export const generateQuizBatch = async (count: number = 5): Promise<QuizData[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `고등학생들이 자주 틀리는 한국어 어휘나 맞춤법에 대한 퀴즈를 ${count}개 생성해줘. 각 퀴즈는 문맥에 맞는 단어를 고르는 형식이야. 매우 어려운 단어나 혼동하기 쉬운 단어로 출제해줘. 각 문제마다 정답과 오답의 핵심 차이에 대한 간결한 해설도 함께 제공해줘.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizBatchSchema,
                temperature: 1.0,
                topP: 0.95,
            },
        });

        const jsonText = response.text.trim();
        const quizBatch: QuizData[] = JSON.parse(jsonText);
        
        if (!Array.isArray(quizBatch) || quizBatch.length === 0) {
            throw new Error("Received empty or invalid data from API.");
        }

        for (const quizData of quizBatch) {
            if (!quizData.sentence || !quizData.correctWord || !quizData.incorrectWord || !quizData.explanation) {
              throw new Error("Received incomplete data for a quiz item.");
            }
            if (!quizData.sentence.includes('__')) {
                throw new Error("A sentence from API does not contain placeholder '__'.");
            }
        }

        return quizBatch;

    } catch (error) {
        console.error("Error generating quiz batch:", error);
        throw error;
    }
};