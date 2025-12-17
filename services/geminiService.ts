import { GoogleGenAI, Type } from "@google/genai";
import { Gender, MatchProfile } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to get image based on gender
const getProfileImage = (gender: string, seedIndex: number): string => {
  const normGender = gender.toLowerCase();
  // randomuser.me provides 0-99 images for men and women
  const imageIndex = seedIndex % 100;
  
  if (normGender === 'male') {
    return `https://randomuser.me/api/portraits/men/${imageIndex}.jpg`;
  } else if (normGender === 'female') {
    return `https://randomuser.me/api/portraits/women/${imageIndex}.jpg`;
  } else {
    // For transgender, we randomly assign a visual for the mock from both sets
    const type = seedIndex % 2 === 0 ? 'men' : 'women';
    return `https://randomuser.me/api/portraits/${type}/${imageIndex}.jpg`;
  }
};

export const generateMatches = async (
  county: string,
  interestedIn: Gender[]
): Promise<MatchProfile[]> => {
  try {
    const prompt = `Generate 6 realistic dating profiles for Kenyans living in or near ${county}, Kenya.
    The profiles should be for people of gender: ${interestedIn.join(" or ")}.
    Each profile needs a realistic Kenyan name (first and last), age (19-35), a specific town within ${county}, and a short, engaging bio (under 150 chars).
    Return strictly JSON.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              age: { type: Type.INTEGER },
              gender: { type: Type.STRING }, // "Male", "Female", "Transgender"
              town: { type: Type.STRING },
              bio: { type: Type.STRING },
            },
            required: ["name", "age", "gender", "town", "bio"],
          },
        },
      },
    });

    const rawProfiles = JSON.parse(response.text || "[]");

    // Enhance with IDs and gender-specific images
    return rawProfiles.map((p: any, index: number) => {
        // Create a pseudo-random seed based on name char codes to keep it consistent
        const seed = p.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) + index;
        
        return {
          id: `match_${Date.now()}_${index}`,
          name: p.name,
          age: p.age,
          gender: p.gender as Gender,
          county: county,
          town: p.town,
          bio: p.bio,
          imageUrl: getProfileImage(p.gender, seed),
          isOnline: Math.random() > 0.5,
          distanceKm: Math.floor(Math.random() * 20) + 1,
        };
    });
  } catch (error) {
    console.error("Gemini Match Generation Error:", error);
    // Fallback data if API fails
    return [
      {
        id: "fallback_1",
        name: "Wanjiku Mwangi",
        age: 24,
        gender: Gender.Female,
        county: county,
        town: "Town Center",
        bio: "Loves nature and hiking. Looking for something serious.",
        imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        isOnline: true,
        distanceKm: 5,
      },
      {
        id: "fallback_2",
        name: "Brian Otieno",
        age: 27,
        gender: Gender.Male,
        county: county,
        town: "Market Area",
        bio: "Tech enthusiast and coffee lover. Let's chat!",
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        isOnline: false,
        distanceKm: 12,
      },
    ];
  }
};

export const generateChatReply = async (
  userName: string,
  matchName: string,
  lastUserMessage: string,
  history: { sender: string; text: string }[]
): Promise<string> => {
  try {
    // Construct a simple conversation history for context
    const conversation = history.map(h => `${h.sender === 'me' ? userName : matchName}: ${h.text}`).join('\n');

    const prompt = `
    You are roleplaying as ${matchName}, a Kenyan dating app user.
    The user ${userName} just sent you: "${lastUserMessage}".
    
    Context so far:
    ${conversation}

    Reply naturally, casually, and briefly (under 2 sentences). Use a little Kenyan slang (Sheng) if appropriate but keep it understandable.
    Strictly return only the reply text.
    `;

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text || "Hey! Nice to hear from you.";

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Hey there! 👋";
  }
};