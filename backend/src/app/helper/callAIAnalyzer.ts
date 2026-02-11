import axios from 'axios';
import FormData from 'form-data';
import AppError from '../error/appError';

// export const callAIAnalyzer = async (file: Express.Multer.File) => {
//   const formData = new FormData();

//   formData.append('file', file.buffer, {
//     filename: file.originalname,
//     contentType: file.mimetype,
//   });

//   const response = await axios.post(
//     'https://kgodt1-report-analyzer.onrender.com/api/process-document',
//     formData,
//     {
//       headers: formData.getHeaders(),
//       maxBodyLength: Infinity,
//       timeout: 120000,
//     },
//   );

//   // AI returns JSON as string
//   const parsed = JSON.parse(response.data.text);
//   return parsed;
// };



export const callAIAnalyzer = async (file: Express.Multer.File) => {
  const formData = new FormData();

  formData.append('file', file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await axios.post(
    'https://kgodt1-report-analyzer.onrender.com/api/process-document',
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 120000,
    },
  );

  const rawText = response.data?.text;

  if (!rawText || typeof rawText !== 'string') {
    console.error('❌ AI document response missing');
    return null;
  }

  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ AI document JSON parse failed');
    console.error(rawText);
    return null;
  }
};





export const callAiText = async (text: string) => {
  const formData = new FormData();
  formData.append('txt', text);

  const response = await axios.post(
    'https://kgodt1-report-analyzer.onrender.com/api/process-text',
    formData,
    {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      timeout: 120000,
    },
  );

  if (!response.status) {
    throw new AppError(500, 'AI text analysis failed');
  }

  const rawText = response.data?.text;

  if (!rawText || typeof rawText !== 'string') {

    console.error('❌ AI response text missing');
    return null;
  }

  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error('❌ AI JSON parse failed');
    console.error(rawText);
    return null;
  }
};
