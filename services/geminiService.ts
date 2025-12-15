import { GoogleGenAI } from "@google/genai";
import { ProcessingOptions, CameraProfile, RealismLevel } from '../types';

const getSystemPrompt = (options: ProcessingOptions): string => {
  const { cameraProfile, realismLevel, grainAmount } = options;

  let prompt = "Edit this image to make it look like a genuine, real-world photograph captured by a human. Remove all AI generation artifacts, such as overly smooth skin, plastic textures, or perfect symmetry. ";

  switch (cameraProfile) {
    case CameraProfile.DSLR:
      prompt += "Simulate a high-end DSLR camera shot (Canon 5D or Nikon D850). Focus on realistic depth of field, natural lighting dynamics, and sharp but organic details. ";
      break;
    case CameraProfile.FILM:
      prompt += "Simulate a 35mm film photograph (Kodak Portra 400). Add characteristic color grading, slight softness, and organic imperfections common in analog photography. ";
      break;
    case CameraProfile.POLAROID:
      prompt += "Simulate an instant Polaroid photo. Add specific color shifts, softer focus, and the unique texture of instant film. ";
      break;
    case CameraProfile.PHONE:
      prompt += "Simulate a modern smartphone photo (iPhone or Pixel). Add slight digital noise in shadows and natural HDR processing. ";
      break;
  }

  if (realismLevel === RealismLevel.HIGH) {
    prompt += "Prioritize extreme photorealism. Ensure textures on surfaces (skin, fabric, wood) are imperfect and detailed. ";
  } else if (realismLevel === RealismLevel.ULTRA) {
    prompt += "Maximum realism is required. Introduce subtle chaos, micro-imperfections, and atmospheric scattering to completely remove the 'digital' feel. ";
  }

  if (grainAmount > 0) {
    const intensity = grainAmount > 70 ? "heavy" : grainAmount > 30 ? "moderate" : "subtle";
    prompt += `Add ${intensity} natural film grain/noise to enhance the organic feel. `;
  }

  prompt += "Maintain the original composition, subject, and pose exactly, but completely overhaul the rendering style to be indistinguishable from a real photo.";

  return prompt;
};

export const humanizeImage = async (
  base64Image: string, 
  options: ProcessingOptions
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains metadata
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    
    const prompt = getSystemPrompt(options);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Standardizing on jpeg for input
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract image from response
    // The model might return text + image or just image. We need to find the inlineData.
    let generatedImageBase64 = '';
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      console.warn("No image found in response, falling back to text for debug:", response.text);
      throw new Error("The AI processing failed to generate a visual result. Please try again with a different setting.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};