import Itinerary from "../models/itinerary.model.js";
import type { Document } from "mongoose";

export type Activity = {
  time: string;
  title: string;
  category: string;
  estimatedCost: number;
  notes: string;
};

export type ItineraryDay = {
  day: number;
  city: string;
  theme: string;
  estimatedDailyBudget: number;
  activities: Activity[];
};

export type ItineraryResult = {
  aiGenerated: boolean;
  summary: {
    totalDays: number;
    totalBudget: number;
    currency: string;
    destinations: string[];
    preferences: string[];
    strategy: string;
  };
  days: ItineraryDay[];
};

export type ItineraryPace = "slow" | "medium" | "fast";

export type ItineraryGenerationInput = {
  durationDays: number;
  budget: number;
  currency?: string;
  destinations: string[];
  preferences: string[];
  pace?: ItineraryPace;
  startDate?: string;
};

export type SaveItineraryInput = {
  userId: string;
  title?: string;
  description?: string;
  aiGenerated: boolean;
  summary: ItineraryResult["summary"];
  days: ItineraryDay[];
  isPublished?: boolean;
};

type CityCatalog = Record<string, Record<string, string[]>>;

const cityCatalog: CityCatalog = {
  tokyo: {
    culinary: [
      "Breakfast at Tsukiji Outer Market sushi area",
      "Street food evening at Omoide Yokocho",
      "Ramen tasting in Ikebukuro area",
    ],
    anime: [
      "Explore Akihabara Electric Town",
      "Shop for merchandise at Ikebukuro Sunshine City",
      "Visit anime-themed museum or studio",
    ],
    nature: [
      "Morning stroll at Shinjuku Gyoen",
      "Sunset walk at Odaiba Seaside Park",
      "Day trip to Mount Takao",
    ],
  },
  osaka: {
    culinary: [
      "Food walk at Dotonbori: takoyaki and okonomiyaki",
      "Local seafood at Kuromon Ichiba Market",
      "Izakaya hopping in Namba",
    ],
    anime: [
      "Shop at Den Den Town figurine district",
      "Visit anime-themed cafe",
      "Arcade tour in Shinsaibashi",
    ],
    nature: [
      "Morning walk at Osaka Castle Park",
      "River cruise at Tombori",
      "Relax at Tennoji Park",
    ],
  },
  kyoto: {
    culinary: [
      "Budget kaiseki lunch in Gion",
      "Tea house with traditional wagashi",
      "Yudofu dinner specialty",
    ],
    anime: [
      "Pop-culture shops near Kyoto Station",
      "Local manga drawing workshop",
      "Collector bookstore for anime art",
    ],
    nature: [
      "Morning at Arashiyama Bamboo Grove",
      "Light hiking at Fushimi Inari",
      "Sunset at Kamo River",
    ],
  },
};

const genericSuggestions: Record<string, string[]> = {
  culinary: [
    "Local food market breakfast",
    "Budget lunch set at popular restaurant",
    "Street food night walk in busy district",
  ],
  anime: [
    "Pop-culture district with merchandise stores",
    "Arcade and game center",
    "Themed cafe with reservation",
  ],
  nature: [
    "Main city park for morning walk",
    "Riverside area for evening relaxation",
    "Sunset point with easy access",
  ],
  history: [
    "Visit iconic temple or shrine",
    "Local history museum",
    "Walking tour of historic district",
  ],
};

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/\s+/g, "");

const buildFallbackItinerary = (
  input: ItineraryGenerationInput,
): ItineraryResult => {
  const durationDays = Math.max(1, Math.min(30, input.durationDays));
  const budget = Math.max(1, input.budget);
  const currency = (input.currency || "JPY").toUpperCase();
  const pace: ItineraryPace = input.pace || "medium";

  const destinations = input.destinations.map((city) => city.trim());
  const preferences = input.preferences.map((pref) => pref.trim());

  const normalizedDestinations = destinations.map(normalizeKey);
  const normalizedPreferences = preferences.map(normalizeKey);

  const paceMultiplier =
    pace === "slow" ? 0.85 : pace === "fast" ? 1.15 : 1;
  const dailyBudgetBase = Math.round(
    (budget / durationDays) * paceMultiplier,
  );

  const days: ItineraryDay[] = [];

  for (let dayIndex = 0; dayIndex < durationDays; dayIndex += 1) {
    const destinationIndex = dayIndex % destinations.length;
    const city = destinations[destinationIndex] || "Tokyo";
    const cityKey = normalizedDestinations[destinationIndex] || "tokyo";
    const themeKey =
      normalizedPreferences[dayIndex % normalizedPreferences.length] ||
      "culinary";
    const theme =
      preferences[dayIndex % preferences.length] || "culinary";

    const cityOptions = cityCatalog[cityKey];
    const specificSuggestions = cityOptions?.[themeKey];
    const genericOptions =
      genericSuggestions[themeKey] || genericSuggestions.culinary;
    const picked =
      specificSuggestions && specificSuggestions.length >= 3
        ? specificSuggestions
        : genericOptions ?? [];

    const mealCost = Math.round(dailyBudgetBase * 0.4);
    const attractionCost = Math.round(dailyBudgetBase * 0.45);
    const transportCost = Math.round(dailyBudgetBase * 0.15);

    days.push({
      day: dayIndex + 1,
      city,
      theme,
      estimatedDailyBudget: dailyBudgetBase,
      activities: [
        {
          time: "09:00-11:00",
          title: picked[0] || "Explore main city area",
          category: theme,
          estimatedCost: Math.round(attractionCost * 0.35),
          notes:
            "Start early for shorter lines and comfortable weather. Book tickets in advance if available.",
        },
        {
          time: "12:00-13:30",
          title: `Lunch featuring ${theme} at ${city}`,
          category: "culinary",
          estimatedCost: mealCost,
          notes:
            "Choose highly-rated local spots. Reserve on weekends if possible.",
        },
        {
          time: "14:30-17:00",
          title: picked[1] || "Continue main activities near lunch area",
          category: theme,
          estimatedCost: Math.round(attractionCost * 0.4),
          notes:
            "Use local trains for efficient area transitions. Stay hydrated.",
        },
        {
          time: "18:30-21:00",
          title: picked[2] || "Evening activity with local atmosphere",
          category: "relax",
          estimatedCost: Math.round(attractionCost * 0.25) + transportCost,
          notes:
            "Wind down for evening. Leave time for rest to maintain steady travel pace.",
        },
      ],
    });
  }

  return {
    aiGenerated: false,
    summary: {
      totalDays: durationDays,
      totalBudget: budget,
      currency,
      destinations,
      preferences,
      strategy:
        "Itinerary built on city-preference combinations with balanced daily budget allocation.",
    },
    days,
  };
};

const extractJsonObject = (raw: string): string | null => {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    return null;
  }

  return raw.slice(firstBrace, lastBrace + 1);
};

const validateAiResult = (
  parsed: unknown,
  fallback: ItineraryResult,
): ItineraryResult => {
  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const result = parsed as Partial<ItineraryResult>;
  if (!Array.isArray(result.days) || result.days.length === 0) {
    return fallback;
  }

  return {
    aiGenerated: true,
    summary: {
      ...fallback.summary,
      ...(result.summary || {}),
    },
    days: result.days.map((day, index) => ({
      day: typeof day.day === "number" ? day.day : index + 1,
      city:
        typeof day.city === "string"
          ? day.city
          : fallback.days[index]?.city || "Tokyo",
      theme:
        typeof day.theme === "string"
          ? day.theme
          : fallback.days[index]?.theme || "culinary",
      estimatedDailyBudget:
        typeof day.estimatedDailyBudget === "number"
          ? day.estimatedDailyBudget
          : fallback.days[index]?.estimatedDailyBudget || 0,
      activities: Array.isArray(day.activities)
        ? day.activities
            .filter((activity) => activity && typeof activity === "object")
            .map((activity) => ({
              time:
                typeof activity.time === "string"
                  ? activity.time
                  : "09:00-11:00",
              title:
                typeof activity.title === "string"
                  ? activity.title
                  : "Activity",
              category:
                typeof activity.category === "string"
                  ? activity.category
                  : "general",
              estimatedCost:
                typeof activity.estimatedCost === "number"
                  ? activity.estimatedCost
                  : 0,
              notes:
                typeof activity.notes === "string" ? activity.notes : "",
            }))
        : fallback.days[index]?.activities || [],
    })),
  };
};

const generateWithAi = async (
  input: ItineraryGenerationInput,
  fallback: ItineraryResult,
): Promise<ItineraryResult> => {
  const aiApiKey = process.env.AI_API_KEY;
  if (!aiApiKey) {
    return fallback;
  }

  const aiApiUrl =
    process.env.AI_API_URL ||
    "https://api.openai.com/v1/chat/completions";
  const aiModel = process.env.AI_MODEL || "gpt-4o-mini";

  const systemPrompt =
    "You are an expert Japan travel planner. Return ONLY valid JSON. Build realistic, connected itineraries, not random lists. Respect travel flow, opening hours, and user budget.";

  const userPrompt = JSON.stringify({
    instruction:
      "Generate day-by-day itinerary in English. Output schema: {summary: {...}, days: [...]}.  Each day has day, city, theme, estimatedDailyBudget, activities[] with time, title, category, estimatedCost, notes.",
    travelerInput: input,
    constraints: [
      "Use Day 1..Day N based on durationDays",
      "Distribute destinations logically from provided order",
      "Reflect preferences in activities",
      "Avoid random isolated attractions",
    ],
  });

  try {
    const response = await fetch(aiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      return fallback;
    }

    const jsonText = extractJsonObject(rawContent);
    if (!jsonText) {
      return fallback;
    }

    const parsed = JSON.parse(jsonText) as unknown;
    return validateAiResult(parsed, fallback);
  } catch (err) {
    console.error("AI itinerary generation failed:", err);
    return fallback;
  }
};

export const generateItinerary = async (
  input: ItineraryGenerationInput,
): Promise<ItineraryResult> => {
  const fallback = buildFallbackItinerary(input);
  return generateWithAi(input, fallback);
};

export const saveItinerary = async (
  input: SaveItineraryInput,
): Promise<Document> => {
  const itinerary = await Itinerary.create({
    userId: input.userId,
    title: input.title || "My Japan Itinerary",
    description: input.description ?? null,
    aiGenerated: input.aiGenerated,
    summary: input.summary,
    days: input.days,
    isPublished: input.isPublished || false,
  });

  return itinerary;
};

export const getItineraryById = async (
  itineraryId: string,
  userId: string,
): Promise<Document | null> => {
  const itinerary = await Itinerary.findOne({
    _id: itineraryId,
    userId,
  });

  return itinerary;
};

export const getUserItineraries = async (
  userId: string,
): Promise<Document[]> => {
  const itineraries = await Itinerary.find({ userId }).sort({
    createdAt: -1,
  });

  return itineraries;
};

export const updateItinerary = async (
  itineraryId: string,
  userId: string,
  updates: Partial<SaveItineraryInput>,
): Promise<Document | null> => {
  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: itineraryId, userId },
    updates,
    { new: true },
  );

  return itinerary;
};

export const deleteItinerary = async (
  itineraryId: string,
  userId: string,
): Promise<Document | null> => {
  const itinerary = await Itinerary.findOneAndDelete({
    _id: itineraryId,
    userId,
  });

  return itinerary;
};
