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

    return res.json({
      status: true,
      message: "Itinerary generated successfully",
      data: {
        itinerary: itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to generate itinerary",
      data: errMessage,
    });
  }
};

export const saveItineraryController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized", data: null });
    }

    const payload = req.body as Omit<SaveItineraryInput, "userId">;
    const saved = await saveItinerary({
      userId: user._id,
      ...payload,
    });

    return res.status(201).json({
      status: true,
      message: "Itinerary saved successfully",
      data: {
        itinerary: saved,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to save itinerary",
      data: errMessage,
    });
  }
};

export const getItineraryController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    if (!user?._id) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const itinerary = await getItineraryById(id, user._id);

    if (!itinerary) {
      return res.status(404).json({
        status: false,
        message: "Itinerary not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "Itinerary retrieved successfully",
      data: {
        itinerary: itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve itinerary",
      data: errMessage,
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
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const itineraries = await getUserItineraries(user._id);

    return res.json({
      status: true,
      message: "Itineraries retrieved successfully",
      data: {
        itineraries: itineraries,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve itineraries",
      data: errMessage,
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
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const updates = req.body as Partial<SaveItineraryInput>;
    const itinerary = await updateItinerary(id, user._id, updates);

    if (!itinerary) {
      return res.status(404).json({
        status: false,
        message: "Itinerary not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "Itinerary updated successfully",
      data: {
        itinerary: itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to update itinerary",
      data: errMessage,
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
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid id");
    }

    const itinerary = await deleteItinerary(id, user._id);

    if (!itinerary) {
      return res.status(404).json({
        status: false,
        message: "Itinerary not found",
        data: null,
      });
    }

    return res.json({
      status: true,
      message: "Itinerary deleted successfully",
      data: {
        itinerary: itinerary,
      },
    });
  } catch (err) {
    console.error(err);
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      status: false,
      message: "Failed to delete itinerary",
      data: errMessage,
    });
  }
};
