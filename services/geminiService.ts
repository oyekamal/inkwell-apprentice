import { GoogleGenAI, Type } from "@google/genai";
import { LESSON_COUNT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateLessonPlan = async (theme: string, level: string): Promise<string[]> => {
  const prompt = `Create a ${LESSON_COUNT}-lesson drawing plan for a ${level} artist on the theme of "${theme}". Each lesson should be a specific, drawable subject that progresses in difficulty. Return a JSON array of strings, where each string is a lesson subject. For example, for beginner flowers: ["a single daisy", "a simple tulip", "a rosebud", "a sunflower head", "a small bouquet"]. ONLY return the JSON array itself, with no other text or markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A specific subject for a drawing lesson.",
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const lessonPlan = JSON.parse(jsonStr);
    
    if (!Array.isArray(lessonPlan) || lessonPlan.some(item => typeof item !== 'string')) {
      throw new Error("Invalid lesson plan format received from API.");
    }

    return lessonPlan.slice(0, LESSON_COUNT);
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Failed to generate the lesson plan. The AI model may be temporarily unavailable.");
  }
};

export const generateCourseExercises = async (lessonTitle: string, lessonContent: string[]): Promise<string[]> => {
  const prompt = `Based on the drawing lesson titled "${lessonTitle}" with the content "${lessonContent.join(' ')}", create a JSON array of 2 simple, drawable subjects for a beginner to practice the concepts. The subjects should be very specific and easy to visualize. For example, for a lesson on shading with hatching, you might return ["a sphere shaded with hatching", "a cube shaded with cross-hatching"]. ONLY return the JSON array itself, with no other text or markdown.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A specific subject for a drawing exercise.",
          },
        },
      },
    });
    const jsonStr = response.text.trim();
    const exercises = JSON.parse(jsonStr);

    if (!Array.isArray(exercises) || exercises.some(item => typeof item !== 'string')) {
      throw new Error("Invalid exercise format received from API.");
    }
    return exercises.slice(0, 2); // Return max 2 exercises
  } catch (error) {
    console.error("Error generating course exercises:", error);
    throw new Error("Failed to generate the practice exercises for this lesson.");
  }
};

// Function to create a placeholder image as base64
const createPlaceholderImage = (subject: string): string => {
  // Create a simple SVG placeholder image
  const svg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="400" fill="white" stroke="black" stroke-width="2"/>
    <text x="150" y="180" text-anchor="middle" font-family="serif" font-size="16" fill="black">Drawing Placeholder</text>
    <text x="150" y="200" text-anchor="middle" font-family="serif" font-size="12" fill="gray">${subject}</text>
    <text x="150" y="220" text-anchor="middle" font-family="serif" font-size="10" fill="gray">Enable Imagen API billing</text>
    <text x="150" y="235" text-anchor="middle" font-family="serif" font-size="10" fill="gray">to generate AI drawings</text>
    <circle cx="150" cy="280" r="30" fill="none" stroke="black" stroke-width="2"/>
    <path d="M130 270 L150 290 L170 270" stroke="black" stroke-width="2" fill="none"/>
  </svg>`;
  
  // Convert SVG to base64
  return btoa(unescape(encodeURIComponent(svg)));
};

export const generateDrawing = async (subject: string, theme: string, level: string): Promise<string> => {
  const prompt = `A professional, clean, artistic, minimalist black ink pen drawing of "${subject}".
Style: High-contrast, beautiful fine line art, monochrome, elegant composition. The drawing should be isolated on a pure white background.
This is for a ${level} artist learning to draw ${theme}. The style should be inspiring and clear.
No text, no watermarks, no signatures, no colored elements.`;
  
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '3:4',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating drawing:", error);
    
    // Check if it's a billing-related error
    if (error instanceof Error && error.message.includes('billed users')) {
      console.warn(`Imagen API requires billing. Using placeholder for "${subject}"`);
      return createPlaceholderImage(subject);
    }
    
    // For other errors, also provide a placeholder but with error info
    console.warn(`Image generation failed for "${subject}". Using placeholder.`);
    return createPlaceholderImage(subject);
  }
};