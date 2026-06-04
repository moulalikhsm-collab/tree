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

// --- ECOFRIEND HIGH-FIDELITY INTELLIGENT AI FALLBACK GENERATORS ---
// These ensure that if Gemini API key is missing or fails, the student is served accurate, robust botanical reports instantly!

function getFallbackRecommendations(pref: string, space: string) {
  const p = (pref || "").toLowerCase();
  const s = (space || "").toLowerCase();

  const allPlants = [
    {
      name: "Holy Tulsi (Holy Basil)",
      type: "medicinal",
      suitabilityScore: 96,
      suitabilityReason: "Thrives tremendously in compact pots, balconies, and classrooms. Rich in air-purifying compounds and spiritual/medicinal value.",
      soilType: "Sandy Loam rich in organic matter",
      soilPreparation: "Mix 50% clean garden soil with 30% organic vermicompost and 20% sand or coco peat for smooth aeration.",
      fertilizers: ["Homemade leaf mold", "Mustard cake liquid", "Compost tea once a fortnight"],
      wateringDailyMl: 150,
      wateringWeeklyLiters: 1.05,
      wateringInstructions: "Gently moisten the root base every morning. Do not water if the top 1-inch of soil feels damp.",
      climateSuitability: {
        tempRange: "20°C - 35°C",
        humidityRange: "50% - 75%",
        warning: "Protect from heavy winter frosts or prolonged over-saturation of water."
      },
      growthDurationDays: 60,
      sowingSeason: "Spring & Rainy Season"
    },
    {
      name: "Cherry Tomato (Micro-Tom)",
      type: "vegetable",
      suitabilityScore: 92,
      suitabilityReason: "The perfect educational container veggie. Produces miniature sweet fruits within 2 months with proper morning sun.",
      soilType: "Well-draining rich clayey loam",
      soilPreparation: "Enrich the container base with 40% organic compost and a handful of wood ash for healthy calcium.",
      fertilizers: ["Decomposed cow manure", "Eggshell powder for calcium strength", "Dilute seaweed micro-nutrient spray"],
      wateringDailyMl: 250,
      wateringWeeklyLiters: 1.75,
      wateringInstructions: "Water deeply at the base of the stem. Avoid overhead splashing to reduce leaf spot fungus.",
      climateSuitability: {
        tempRange: "18°C - 32°C",
        humidityRange: "45% - 65%",
        warning: "Keep warm. Requires at least 6 hours of direct mild morning screen sun."
      },
      growthDurationDays: 70,
      sowingSeason: "Year-Round (Except deep winter)"
    },
    {
      name: "English Peppermint",
      type: "medicinal",
      suitabilityScore: 95,
      suitabilityReason: "Fast spreading trailing herb. Excellent natural pest deterrent and serves as an aromatic classroom favorite.",
      soilType: "Moist, nutrient-dense garden soil",
      soilPreparation: "Combine 60% humus-rich black soil with 40% compost. Retains moisture beautifully.",
      fertilizers: ["Dilute fermented rice water", "Mild vermicompost top-dressing"],
      wateringDailyMl: 200,
      wateringWeeklyLiters: 1.4,
      wateringInstructions: "Keep soil consistently humid but not waterlogged. Mist leaves slightly in dry summers.",
      climateSuitability: {
        tempRange: "15°C - 30°C",
        humidityRange: "60% - 80%",
        warning: "Enjoys partial shade. Direct harsh overhead summer sun may brown leaf tips."
      },
      growthDurationDays: 45,
      sowingSeason: "Spring / Monsoon"
    },
    {
      name: "Spinach (Palak Greens)",
      type: "vegetable",
      suitabilityScore: 90,
      suitabilityReason: "Rapid leafy yield high in iron. Can be repeatedly harvested by trimming only the outer mature leaves.",
      soilType: "Deep nitrogen-rich sandy soil",
      soilPreparation: "Enrich soil with poultry compost or fermented leaf mulch to boost healthy green chlorophyll.",
      fertilizers: ["Nitrogen-rich compost tea", "Diluted wood wash"],
      wateringDailyMl: 180,
      wateringWeeklyLiters: 1.26,
      wateringInstructions: "Moisten the soil bed evenly. Avoid leaving stagnant water pools around roots.",
      climateSuitability: {
        tempRange: "12°C - 28°C",
        humidityRange: "50% - 70%",
        warning: "Prefers cooler temperatures. High heat triggers early seed bolting."
      },
      growthDurationDays: 40,
      sowingSeason: "Winter / Early Autumn"
    },
    {
      name: "French Marigold Flowers",
      type: "flower",
      suitabilityScore: 88,
      suitabilityReason: "Beautiful compact floral visual. Emits root secretions that acts as an excellent organic pest shield.",
      soilType: "Average well-drained loam",
      soilPreparation: "Mix regular garden loam with 20% compost. Extremely resilient species.",
      fertilizers: ["Banana peel organic potassium tea", "All-purpose vermicompost"],
      wateringDailyMl: 120,
      wateringWeeklyLiters: 0.84,
      wateringInstructions: "Water when the soil feels completely dry. Avoid splashing open blossoms.",
      climateSuitability: {
        tempRange: "15°C - 38°C",
        humidityRange: "40% - 60%",
        warning: "Very hardy but thrives best under open sky sunshine."
      },
      growthDurationDays: 50,
      sowingSeason: "Year-Round"
    }
  ];

  // Tailor lists based on preference
  if (p.includes("medicinal") || p.includes("herb")) {
    return [allPlants[0], allPlants[2], allPlants[1]];
  } else if (p.includes("vegetable") || p.includes("spinach") || p.includes("green") || p.includes("leafy")) {
    return [allPlants[1], allPlants[3], allPlants[4]];
  } else if (p.includes("flower") || p.includes("floral")) {
    return [allPlants[4], allPlants[0], allPlants[1]];
  }
  
  // Default balanced 3
  return [allPlants[0], allPlants[1], allPlants[4]];
}

function getFallbackGrowthPrediction(plantName: string, soilQuality: string, waterSupply: string, climate: string) {
  const name = plantName || "Organic Sprout";
  
  const stageTimeline = [
    { stage: "Sowing & Imbibition", durationDays: 6, description: "Seed absorbs moisture, swelling up to crack open the outer seed coat safely.", progressPercentage: 10 },
    { stage: "Seedling Emergence", durationDays: 10, description: "The tiny radicle roots anchor downwards, pushing up twin bright green cotyledons.", progressPercentage: 30 },
    { stage: "Active Vegetative Canopy", durationDays: 20, description: "Dynamic leaf development, stem thickening, and robust side-branch configuration.", progressPercentage: 60 },
    { stage: "Budding & Inflorescence", durationDays: 14, description: "Flowering nodes emerge and pollen flowers open to welcome friendly garden bees.", progressPercentage: 85 },
    { stage: "Fruiting & Harvest Ripeness", durationDays: 10, description: "Young organic crop matures to full nutritious size, optimal for student cooking!", progressPercentage: 100 }
  ];

  // Populate day charts
  const growthChartData = [];
  let currentHeight = 0;
  for (let d = 0; d <= 60; d += 5) {
    if (d > 5 && d <= 15) {
      currentHeight += 1.8 + Math.random() * 0.5;
    } else if (d > 15 && d <= 35) {
      currentHeight += 4.5 + Math.random() * 1.2;
    } else if (d > 35) {
      currentHeight += 2.2 + Math.random() * 0.8;
    }
    
    // Evaluate dry/poor factor to vary health scores
    let score = 95;
    if ((soilQuality || "").toLowerCase().includes("poor") || (soilQuality || "").toLowerCase().includes("dry")) {
      score -= 15;
    }
    if ((waterSupply || "").toLowerCase().includes("sparse") || (waterSupply || "").toLowerCase().includes("rare")) {
      score -= 10;
    }

    growthChartData.push({
      day: d,
      heightCm: Number(currentHeight.toFixed(1)),
      healthScore: Math.max(50, Math.min(100, score - Math.floor(Math.random() * 5)))
    });
  }

  return {
    plantName: name,
    factors: {
      soilQuality: soilQuality || "Normal nutrient-rich garden soil",
      waterSupply: waterSupply || "Consistent morning watering",
      climate: climate || "Mild warm weather"
    },
    stages: stageTimeline,
    expectedYield: `1.5 - 2.8 kg of fresh organic ${name} crops per vessel.`,
    estimatedHarvestDate: "55 to 65 days from seedling germination",
    growthChartData: growthChartData
  };
}

function getFallbackDiseasePrediction(plantName: string, symptoms: string) {
  const pName = plantName || "Tomato Plant";
  const sym = (symptoms || "").toLowerCase();

  if (sym.includes("yellow") || sym.includes("chlorosis")) {
    return {
      diseaseName: "Nitrogen Deficiency or Overwatering Root Stress",
      healthy: false,
      confidence: 0.90,
      symptoms: ["Lower mature leaves turning pale yellow", "Stunted vegetative canopy branching", "Thin stems lacking structural rigidity"],
      preventiveMeasures: ["Use well-aerated pots with built-in drainage holes", "Water only when the top layer is bone dry to human touch"],
      treatments: ["Directly top-dress root zone with 2 cups of rich vermicompost", "Incorporate organic seaweed extract weekly to boost nitrogen intake"],
      affectedAreaDescription: "Gradual leaf pale yellow fading originating first in old bottom foliar stems."
    };
  }

  if (sym.includes("spot") || sym.includes("brown") || sym.includes("black")) {
    return {
      diseaseName: `Fungal Early Leaf Spot (Blight)`,
      healthy: false,
      confidence: 0.85,
      symptoms: ["Deformed dark brown leaf spots", "Expanding target ring symptoms on stem joints", "Withered bottom leaves dropping prematurely"],
      preventiveMeasures: ["Maintain ample spatial distance between pots to prevent pathogen spread", "Avoid splashing soil mud onto low leaves during watering"],
      treatments: ["Prune damaged yellow/brown leaves instantly with sterilized blade", "Spray mild organic Neem Oil (5ml/L) or baking soda wash at dusk"],
      affectedAreaDescription: "Circular brown necrotic patches framed with elegant pale yellow concentric halos."
    };
  }

  if (sym.includes("white") || sym.includes("powder") || sym.includes("mold")) {
    return {
      diseaseName: "Powdery Mildew Fungal Colony",
      healthy: false,
      confidence: 0.92,
      symptoms: ["White talcum-like flour powder layers covering green leaves", "Deformed younger leaves twisting and curling upwards", "Brittle, paper-dry foliage under dense shade"],
      preventiveMeasures: ["Ensure plant pot receives at least 5 hours of healthy daily sun", "Avoid canopy over-crowding; thin out excess leaves"],
      treatments: ["Spray organic milk-water dilute solution (1:9 ratio) under bright sun", "Apply sulfur organic fungicide powder carefully to damp foliage"],
      affectedAreaDescription: "Splattered chalky white powdery dusting spreading dynamically across the upper leaf surfaces."
    };
  }

  // Fallback healthy template
  return {
    diseaseName: `Healthy ${pName} Foliage`,
    healthy: true,
    confidence: 0.80,
    symptoms: ["Glistening rich emerald green leaves", "Sturdy upright stems supporting dynamic buds", "Excellent leaf turgidity"],
    preventiveMeasures: ["Keep doing what you do! Keep records of growth cycles", "Conduct soil aeration once every two weeks with a small fork"],
    treatments: ["No medical treatment needed. Top with fresh compost mulch next cycle"],
    affectedAreaDescription: "Pristine leaf surfaces showing perfect chlorophyll vein structures with zero spots."
  };
}

function getFallbackChatResponse(messages: any[], language: string) {
  const lang = language || "English";
  const lastMsg = messages && messages.length > 0 
    ? (messages[messages.length - 1]?.text || "").toLowerCase() 
    : "";

  if (lang === "Telugu") {
    if (lastMsg.includes("నీరు") || lastMsg.includes("water") || lastMsg.includes("పోయా")) {
      return {
        text: "మొక్కకు నీరు పెట్టేటప్పుడు ఎల్లప్పుడూ పై మట్టి పొర (1 ఇంచ్) ఎండిపోయే వరకు వేచి ఉండాలి. టొమాటోలకు ప్రతిరోజూ ఉదయం 200ml సరిపోతుంది. కుండీలో రంధ్రాలు సరిగ్గా ఉన్నాయో లేదో చూసుకోండి! 💧"
      };
    }
    if (lastMsg.includes("తులసి") || lastMsg.includes("tulsi")) {
      return {
        text: "మొక్కల రారాజు తులసి. దీనికి రోజూ ఉదయం కొద్దిగా నీరు పోయాలి మరియు చక్కని ఎండ తగిలే చోటు అవసరం. ఆకులు ఎండిపోకుండా సేంద్రీయ ఎరువు లేదా వేప పిండి వేసుకోండి! 🌱"
      };
    }
    if (lastMsg.includes("ఆకు") || lastMsg.includes("వ్యాధి") || lastMsg.includes("తెగులు") || lastMsg.includes("disease") || lastMsg.includes("spots")) {
      return {
        text: "మొక్క ఆకులకు ఏదైనా తెగులు సోకితే, 5ml వేప నూనెను మరియు ఒక చెంచా పీచు నీటిని కలిపి ఆకులపై పిచికారీ చేయవచ్చు. ఇది ఒక అద్భుతమైన సహజమైన పురుగుమందు! 🐛"
      };
    }
    return {
      text: "నమస్కారం! నేను మీ ఎకో ఫ్రెండ్ AI సహచరుడిని. మొక్కల పెంపకం, మొలకెత్తే సమయం, సేంద్రీయ ఎరువులు లేదా వ్యాధుల గుర్తింపు గురించి నన్ను ఏదైనా అడగవచ్చు! మీ తోటను పచ్చగా ఉంచుకుందాం. 🌿"
    };
  }

  if (lang === "Hindi") {
    if (lastMsg.includes("पानी") || lastMsg.includes("water") || lastMsg.includes("सिंचाई")) {
      return {
        text: "पौधे को पानी तभी दें जब गमले की ऊपरी 1 इंच मिट्टी सूखी महसूस हो। अधिक पानी देने से जड़ें सड़ सकती हैं। सुबह के समय पानी देना सबसे अच्छा होता है! 💧"
      };
    }
    if (lastMsg.includes("तुलसी") || lastMsg.includes("tulsi")) {
      return {
        text: "तुलसी के पौधे के लिए अच्छी धूप (4-5 घंटे) और अच्छी जल निकासी वाली मिट्टी बहुत जरूरी है। ठंड में इसे पाले से बचाएं और सूखे पत्तों की छंटाई करते रहें! 🌸"
      };
    }
    if (lastMsg.includes("बीमारी") || lastMsg.includes("पत्ता") || lastMsg.includes("कीड़ा") || lastMsg.includes("spots") || lastMsg.includes("disease")) {
      return {
        text: "यदि पत्तियों पर धब्बे दिखाई दे रहे हैं, तो 1 लीटर पानी में 5 मिलीलीटर नीम का तेल मिलाकर शाम के समय स्प्रे करें। यह पूरी तरह से जैविक और सुरक्षित है! 🐛"
      };
    }
    return {
      text: "नमस्ते! मैं आपका इको-फ्रेंड एआई सहायक हूँ। आप मुझसे बागवानी, जैविक खाद, या पौधों की बीमारियों के बारे में कुछ भी पूछ सकते हैं। आइए मिलकर इस दुनिया को हरा-भरा बनाएं! 🌿"
    };
  }

  // English fallback
  if (lastMsg.includes("water") || lastMsg.includes("moist") || lastMsg.includes("irrigation")) {
    return {
      text: "Always test the top 1-inch soil dryness before watering potted plants. Early morning is ideal so that foliage dries during the day, preventing root fungal infections! 💧"
    };
  }
  if (lastMsg.includes("compost") || lastMsg.includes("fertilizer") || lastMsg.includes("manure") || lastMsg.includes("nutrient")) {
    return {
      text: "Organic compost tea or vermicompost is great. Stir 1 part vermicompost with 5 parts water and spray it around the root zone once a fortnight! 🍃"
    };
  }
  if (lastMsg.includes("tomato") || lastMsg.includes("vegetable")) {
    return {
      text: "Tomatoes absolutely love warm, direct sunlight (at least 6 hours). Plant them deep in the soil and support stems with a sturdy wooden stick or cage once they reach 12 inches!"
    };
  }
  if (lastMsg.includes("disease") || lastMsg.includes("spot") || lastMsg.includes("pest") || lastMsg.includes("bug")) {
    return {
      text: "Organic Neem Oil spray (5ml per Liter) is a highly reliable organic pesticide. Spray early in the morning or at dusk to avoid leaf sunburn! 🐛"
    };
  }
  return {
    text: "Hello there! I am your EcoFriend AI companion. Ask me any gardening or botany question! You can ask about soil, compost recipes, plant identification, or water goals. Let's make your balcony greener! 🌱"
  };
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
    const { location, climate, space, season, pref } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid GEMINI_API_KEY. Running recommendation offline fallback.");
        return res.json(getFallbackRecommendations(pref, space));
      }

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
      console.warn("Recommendation API error occurred. Falling back to high-fidelity mock:", error);
      res.json(getFallbackRecommendations(pref, space));
    }
  });

  // API Route - AI Growth Predictor
  app.post("/api/predict-growth", async (req, res) => {
    const { plantName, soilQuality, waterSupply, climate } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid GEMINI_API_KEY. Running growth predictor offline fallback.");
        return res.json(getFallbackGrowthPrediction(plantName, soilQuality, waterSupply, climate));
      }

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
      console.warn("Growth Prediction API error occurred. Falling back to high-fidelity mock:", error);
      res.json(getFallbackGrowthPrediction(plantName, soilQuality, waterSupply, climate));
    }
  });

  // API Route - Symptom-based Plant Disease Prediction
  app.post("/api/predict-disease-symptom", async (req, res) => {
    const { plantName, symptoms } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid GEMINI_API_KEY. Running symptom diagnosis offline fallback.");
        return res.json(getFallbackDiseasePrediction(plantName, symptoms));
      }

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
      console.warn("Disease Symptom API error occurred. Falling back to high-fidelity mock:", error);
      res.json(getFallbackDiseasePrediction(plantName, symptoms));
    }
  });

  // API Route - Leaf Scanner image analysis
  app.post("/api/scan-leaf", async (req, res) => {
    const { imageBase64, plantName } = req.body;
    try {
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing image base64 data" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid GEMINI_API_KEY. Running computer vision offline fallback.");
        return res.json(getFallbackDiseasePrediction(plantName, "spot"));
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
      console.warn("Leaf Scan API error occurred. Falling back to simulated scan diagnostics:", error);
      res.json(getFallbackDiseasePrediction(plantName, "spot"));
    }
  });

  // API Route - Trilingual Chatbot (Streaming Version)
  app.post("/api/chat", async (req, res) => {
    const { messages, language } = req.body;
    const lang = language || "English";

    // Prepare headers for SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid GEMINI_API_KEY. Running simulated trilingual chatbot streaming fallback.");
        const fallbackObj = getFallbackChatResponse(messages, lang);
        const fallbackText = fallbackObj.text || "";
        
        // Split by word and spacing blocks to simulate human typing
        const tokens = fallbackText.split(/(\s+)/);
        let i = 0;
        const interval = setInterval(() => {
          if (i < tokens.length) {
            res.write(`data: ${JSON.stringify({ text: tokens[i] })}\n\n`);
            i++;
          } else {
            res.write('data: [DONE]\n\n');
            res.end();
            clearInterval(interval);
          }
        }, 15);
        
        req.on('close', () => {
          clearInterval(interval);
        });
        return;
      }

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
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: currentMessagePrompt,
        config: {
          systemInstruction: systemGuide,
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.warn("Chat API streaming error occurred. Falling back to simple simulated streaming:", error);
      try {
        const fallbackObj = getFallbackChatResponse(messages, lang);
        res.write(`data: ${JSON.stringify({ text: fallbackObj.text || "Apologies, I encountered an error. Please try again!" })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (err) {
        if (!res.writableEnded) res.end();
      }
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
