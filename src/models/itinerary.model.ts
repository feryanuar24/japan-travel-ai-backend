import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    time: String,
    title: String,
    category: String,
    estimatedCost: Number,
    notes: String,
  },
  { _id: false },
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: Number,
    city: String,
    theme: String,
    estimatedDailyBudget: Number,
    activities: [activitySchema],
  },
  { _id: false },
);

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "My Japan Itinerary",
    },
    description: String,
    aiGenerated: Boolean,
    summary: {
      totalDays: Number,
      totalBudget: Number,
      currency: String,
      destinations: [String],
      preferences: [String],
      strategy: String,
    },
    days: [itineraryDaySchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Itinerary", itinerarySchema);
