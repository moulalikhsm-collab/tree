import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

// Lazy initialization of Gemini API client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. Real-time AI features will fail with API key prompt.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MISSING_API_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  
  // Increase payload limit to support leaf photo uploads
  app.use(express.json({ limit: '10mb' }));

  // API Route - Weather Information
  app.post("/api/weather", (req, res) => {
    const { location } = req.body;
    const loc = location || "Pune, India";
    
    // Custom simulated weather depending on location name for rich client metrics
    let temp = 28;
    let humidity = 65;
    let condition = "Partly Cloudy";
    
    const lower = loc.toLowerCase();
    if (lower.includes("delhi") || lower.includes("north") || lower.includes("dry")) {
      temp = 34;
      humidity = 40;
      condition = "Sunny & Warm";
    } else if (lower.includes("pune") || lower.includes("bangalore") || lower.includes("hills")) {
      temp = 24;
      humidity = 70;
      condition = "Mild & Cool";
    } else if (lower.includes("rain") || lower.includes("mumbai") || lower.includes("kerala")) {
      temp = 26;
      humidity = 85;
      condition = "Humid Rain Showers";
    }

    const forecast = [
      { day: "Tomorrow", temp: temp + Math.floor(Math.random() * 3) - 1, condition: condition },
      { day: "Day after", temp: temp + Math.floor(Math.random() * 3) - 1, condition: condition },
      { day: "In 3 Days", temp: temp + Math.floor(Math.random() * 3) - 1, condition: "Sunny" },
    ];

    res.json({ temp, humidity, condition, location: loc, forecast });
  });

  // API Route - Plant Recommendation Engine
  app.post("/api/recommend", async (req, res) => {
    try {
      const { location, climate, space, season, pref } = req.body;
      
      const prompt = `Suggest suitable plants to grow based on the following:
      Location: ${location || "unspecified"}
      Climate Overview: ${climate || "unspecified"}
      Available Growth Space: ${space || "unspecified"} (e.g. Balcony pot, medium garden, large farm)
      Current Season: ${season || "unspecified"}
      User Category/Preferences: ${pref || "unspecified"} (e.g. Beginners, leafy greens, medicinal plants, low-maintenance)

      Provide exactly 3 custom plant recommendations matching the schema provided. 
      For each plant, return detailed growth specs, soil prep, precise daily and weekly watering targets with rules, climate warnings, and sowing feasibility.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert AI botanist. Output a JSON array matching specified fields accurately.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of plant recommendations based on user input",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { 
                  type: Type.STRING, 
                  description: "One of: vegetable, fruit, flower, medicinal, tree" 
                },
                suitabilityScore: { type: Type.INTEGER, description: "Suitability score out of 100" },
                suitabilityReason: { type: Type.STRING },
                soilType: { type: Type.STRING },
                soilPreparation: { type: Type.STRING },
                fertilizers: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                wateringDailyMl: { type: Type.INTEGER, description: "Daily water requirement in mililitres" },
                wateringWeeklyLiters: { type: Type.NUMBER, description: "Weekly total in liters" },
                wateringInstructions: { type: Type.STRING },
                climateSuitability: {
                  type: Type.OBJECT,
                  properties: {
                    tempRange: { type: Type.STRING },
                    humidityRange: { type: Type.STRING },
                    warning: { type: Type.STRING }
                  },
                  required: ["tempRange", "humidityRange"]
                },
                growthDurationDays: { type: Type.INTEGER },
                sowingSeason: { type: Type.STRING }
              },
              required: [
                "name", "type", "suitabilityScore", "suitabilityReason", 
                "soilType", "soilPreparation", "fertilizers", 
                "wateringDailyMl", "wateringWeeklyLiters", "wateringInstructions", 
                "climateSuitability", "growthDurationDays", "sowingSeason"
              ]
            }
          }
        }
      });

      const dataText = response.text || "[]";
      res.json(JSON.parse(dataText));
    } catch (error: any) {
      console.error("Recommendation Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze recommendations" });
    }
  });

  // API Route - AI Growth Predictor
  app.post("/api/predict-growth", async (req, res) => {
    try {
      const { plantName, soilQuality, waterSupply, climate } = req.body;
      
      const prompt = `Analyze growth predictions for planting: "${plantName}"
      Consider these input parameters:
      - Soil Quality & Nutrients: ${soilQuality || "Medium nutrient garden soil"}
      - Water Supply Routine: ${waterSupply || "Daily light watering"}
      - Local Climate Context: ${climate || "Warm, sunny balcony"}

      Provide plant growth stages, estimated timeline, expected yield with timeframe, and a continuous forecast of height and health score over a simulated 60-day roadmap.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a senior agricultural growth analyst. Output highly accurate growth roadmaps in JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plantName: { type: Type.STRING },
              factors: {
                type: Type.OBJECT,
                properties: {
                  soilQuality: { type: Type.STRING },
                  waterSupply: { type: Type.STRING },
                  climate: { type: Type.STRING }
                },
                required: ["soilQuality", "waterSupply", "climate"]
              },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING, description: "Sowing, Sprouting, Vegetative, Flowering, Harvest, etc." },
                    durationDays: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    progressPercentage: { type: Type.INTEGER }
                  },
                  required: ["stage", "durationDays", "description", "progressPercentage"]
                }
              },
              expectedYield: { type: Type.STRING, description: "e.g., '1.5 - 2.0 kg per plant after 70 days'" },
              estimatedHarvestDate: { type: Type.STRING, description: "Timeline range, e.g., '60 to 75 Days'" },
              growthChartData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    heightCm: { type: Type.NUMBER },
                    healthScore: { type: Type.INTEGER }
                  },
                  required: ["day", "heightCm", "healthScore"]
                }
              }
            },
            required: ["plantName", "factors", "stages", "expectedYield", "estimatedHarvestDate", "growthChartData"]
          }
        }
      });

      const dataText = response.text || "{}";
      res.json(JSON.parse(dataText));
    } catch (error: any) {
      console.error("Growth Prediction Error:", error);
      res.status(500).json({ error: error.message || "Failed to predict plant growth" });
    }
  });

  // API Route - Symptom-based Plant Disease Prediction
  app.post("/api/predict-disease-symptom", async (req, res) => {
    try {
      const { plantName, symptoms } = req.body;
      
      const prompt = `Diagnose potential health condition for Plant: "${plantName}"
      Reported Symptoms: "${symptoms}"

      Analyze likely plant diseases. Suggest immediate treatment instructions, long-term organic/chemical preventive measures, and score your diagnostic confidence.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional plant pathologist. Output structural diagnosis report in JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diseaseName: { type: Type.STRING, description: "Identified disease or 'Healthy Plant'" },
              healthy: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
              treatments: { type: Type.ARRAY, items: { type: Type.STRING } },
              affectedAreaDescription: { type: Type.STRING }
            },
            required: ["diseaseName", "healthy", "confidence", "symptoms", "preventiveMeasures", "treatments"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Disease Symptom Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze symptoms" });
    }
  });

  // API Route - Leaf Scanner image analysis
  app.post("/api/scan-leaf", async (req, res) => {
    try {
      const { imageBase64, plantName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing image base64 data" });
      }

      // Prepare image file part for Gemini multimodal scanning
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      };

      const textPart = {
        text: `Analyze this plant leaf image. The user suspects it could be a: ${plantName || "unknown plant"}.
        Identify if there are visible signs of disease, pests, discoloration, burn, spots, or nutrient deficiency.
        Return the exact state, a brief breakdown of the affected locations seen, treatments, and a confidence score.`
      };

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are an exceptional computer vision algorithm for plant protection. Diagnose leaf images accurately and return the findings in strict JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diseaseName: { type: Type.STRING, description: "e.g., Early Blight, Powdery Mildew, Spider Mites, or Healthy Leaf" },
              healthy: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
              symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
              treatments: { type: Type.ARRAY, items: { type: Type.STRING } },
              affectedAreaDescription: { type: Type.STRING, description: "Description of affected areas found (e.g. 'Concentrated brown spots with yellow halos near the bottom-right leaf margins')" }
            },
            required: ["diseaseName", "healthy", "confidence", "symptoms", "preventiveMeasures", "treatments", "affectedAreaDescription"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Leaf Scan Error:", error);
      res.status(500).json({ error: error.message || "Failed to scan leaf image" });
    }
  });

  // API Route - Trilingual Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;
      const lang = language || "English";
      
      // Construct a conversation thread
      const systemGuide = `You are EcoFriend's expert organic gardening assistant.
      The student has chosen the interface language: ${lang}.
      CRITICAL: You must answer and interact ENTIRELY in ${lang}.
      - English: Answer in highly supportive gardener English.
      - Telugu: Answer in authentic, polite Telugu (మొక్కల పెంపకం సలహాదారుగా మాతృభాషలో సమాధానం ఇవ్వండి).
      - Hindi: Answer in conversational, warm Hindi (पौधों की देखभाल करने वाले मित्र के रूप में उत्तर दें).
      Keep descriptions easy to comprehend for children, students, and beginners. Discuss organic methods, moisture, soil, compost, and simple solutions.`;

      const thread = messages || [];
      const historyPrompt = thread.map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join("\n");
      const currentMessagePrompt = `Conversation History:\n${historyPrompt}\n\nRespond to the last User statement in the chosen language (${lang}). Ensure formatting uses elegant markdown paragraphs and bullet points where useful.`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: currentMessagePrompt,
        config: {
          systemInstruction: systemGuide,
          temperature: 0.7,
        }
      });

      res.json({
        text: response.text || "Apologies, I couldn't formulate a response. Please ask again!"
      });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message || "Error communicating with plant expert helper" });
    }
  });

  // Integrate Vite for standard runtime development or static server in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoFriend full-stack Express server running on high-capacity port ${PORT}`);
  });
}

startServer();
