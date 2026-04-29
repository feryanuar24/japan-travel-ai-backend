import type { Request, Response } from "express";
import {
  generateItinerary,
  saveItinerary,
  getItineraryById,
  getUserItineraries,
  updateItinerary,
  deleteItinerary,
  type ItineraryGenerationInput,
  type SaveItineraryInput,
} from "../services/itinerary.service.js";

type UserType = {
  _id?: string;
};

export const generateItineraryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const payload = req.body as ItineraryGenerationInput;
    const itinerary = await generateItinerary(payload);

    res.json({
      message: "Itinerary generated successfully",
      data: {
        itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to generate itinerary",
    });
  }
};

export const saveItineraryController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = req.body as Omit<SaveItineraryInput, "userId">;
    const saved = await saveItinerary({
      userId: user._id,
      ...payload,
    });

    res.status(201).json({
      message: "Itinerary saved successfully",
      data: {
        itinerary: saved,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to save itinerary",
    });
  }
};

export const getItineraryController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const itinerary = await getItineraryById(id, user._id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.json({
      message: "Itinerary retrieved successfully",
      data: {
        itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve itinerary",
    });
  }
};

export const listItinerariesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const itineraries = await getUserItineraries(user._id);

    res.json({
      message: "Itineraries retrieved successfully",
      data: {
        itineraries,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve itineraries",
    });
  }
};

export const updateItineraryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const updates = req.body as Partial<SaveItineraryInput>;
    const itinerary = await updateItinerary(id, user._id, updates);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.json({
      message: "Itinerary updated successfully",
      data: {
        itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update itinerary",
    });
  }
};

export const deleteItineraryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const itinerary = await deleteItinerary(id, user._id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.json({
      message: "Itinerary deleted successfully",
      data: {
        itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete itinerary",
    });
  }
};
