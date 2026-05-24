import { type InferSchemaType, model, models, Schema } from "mongoose";

const crisisReportSchema = new Schema(
  {
    originalMessage: {
      type: String,
      required: true,
      trim: true,
    },
    detectedLanguage: {
      type: String,
      trim: true,
    },
    translatedMessage: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    urgencyLevel: {
      type: String,
      trim: true,
    },
    affectedCommunity: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: "Active",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type CrisisReportDocument = InferSchemaType<typeof crisisReportSchema>;

const CrisisReport =
  models.CrisisReport || model("CrisisReport", crisisReportSchema);

export default CrisisReport;
