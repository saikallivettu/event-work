const { GoogleGenerativeAI } = require('@google/generative-ai');
const Course = require('../models/Course');
const pdf = require('pdf-parse');

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function getGenerativeModel(modelName) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
}

// Handle a chat conversation with course context (Gemini)
// POST /api/ai/chat
exports.handleChat = async (req, res) => {
  try {
    const model = getGenerativeModel('gemini-pro');
    if (!model) {
      return res.status(503).json({ message: 'AI services are currently unavailable. Please set GEMINI_API_KEY.' });
    }

    const { question, courseId } = req.body || {};
    if (!question || !courseId) {
      return res.status(400).json({ message: 'Question and courseId are required.' });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ message: 'Course not found.' });

    const chatContext = `
You are a friendly AI Tutor named 'Neuro'. You are tutoring for the course: "${course.title}".
Course description: "${course.description || ''}".
Based on this context, answer the student's question. If the question seems unrelated to the course, gently guide them back to the topic.
`;
    const fullPrompt = `${chatContext}\n\nStudent question: "${question}"`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const answer = response.text();
    return res.json({ answer });
  } catch (error) {
    console.error('Error with Gemini API (handleChat):', error);
    const message = error.message && error.message.includes('GEMINI_API_KEY')
      ? 'AI services are unavailable.'
      : 'Failed to get AI chat response.';
    return res.status(503).json({ message });
  }
};

// @desc    Grade a submission using AI (Gemini)
// @route   POST /api/ai/grade-submission
// @access  Private (Teacher)
exports.gradeSubmission = async (req, res) => {
  const { question, rubric, studentAnswer } = req.body || {};
  if (!question || !rubric || !studentAnswer) {
    return res.status(400).json({ message: 'Missing required fields for grading.' });
  }

  try {
    const model = getGenerativeModel('gemini-pro');
    if (!model) return res.status(503).json({ message: 'AI services are unavailable.' });

    const prompt = `
You are an AI teaching assistant. Your task is to grade a student's submission based on a provided question and rubric.
Provide the grade as a score out of 100 and detailed feedback.
IMPORTANT: Output ONLY a valid JSON object. Do not include any text, markdown formatting like \`\`\`json, or explanations outside of the JSON object itself.

The JSON format MUST be:
{
  "score": <integer_from_0_to_100>,
  "feedback": "<string_of_detailed_feedback>",
  "strengths": "<string_highlighting_what_the_student_did_well>",
  "areasForImprovement": "<string_suggesting_how_the_student_can_improve>"
}

Here is the information:
---
Question: ${question}
---
Rubric: ${rubric}
---
Student's Answer: ${studentAnswer}
---
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const aiResponse = JSON.parse(text);
    return res.status(200).json(aiResponse);
  } catch (error) {
    console.error('Error with Gemini API (gradeSubmission):', error);
    const message = error.message && error.message.includes('GEMINI_API_KEY')
      ? 'AI services are unavailable.'
      : 'Failed to get AI grading.';
    return res.status(503).json({ message });
  }
};

// @desc    Summarize an uploaded document (Gemini)
// @route   POST /api/ai/summarize
// @access  Private
exports.summarizeDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  try {
    const model = getGenerativeModel('gemini-pro');
    if (!model) return res.status(503).json({ message: 'AI services are unavailable.' });

    let textContent = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.path);
      textContent = data.text || '';
    } else if (req.file.mimetype === 'text/plain') {
      const fs = require('fs');
      textContent = fs.readFileSync(req.file.path, 'utf8');
    } else {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    const prompt = `
You are a highly skilled academic assistant. Summarize the following text into clear, concise bullet points, capturing the main arguments and conclusions.
---\nTEXT:\n${textContent.substring(0, 15000)}\n---
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    return res.json({ summary });
  } catch (error) {
    console.error('Error with Gemini API (summarizeDocument):', error);
    const message = error.message && error.message.includes('GEMINI_API_KEY')
      ? 'AI services are unavailable.'
      : 'Failed to summarize document.';
    return res.status(503).json({ message });
  }
};
