import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComparisonReport extends Document {
  bookingID: Types.ObjectId;
  beforeConditionID: Types.ObjectId;
  afterConditionID: Types.ObjectId;
  aiSummary: string[];
  changesDetected: boolean;
  confidence: number;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const comparisonReportSchema: Schema = new Schema(
  {
    bookingID: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    beforeConditionID: {
      type: Schema.Types.ObjectId,
      ref: 'ConditionImage',
      required: false,
    },
    afterConditionID: {
      type: Schema.Types.ObjectId,
      ref: 'ConditionImage',
      required: false,
    },
    aiSummary: {
      type: [String],
      default: [],
    },
    changesDetected: {
      type: Boolean,
      default: false,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ComparisonReport = mongoose.model<IComparisonReport>('ComparisonReport', comparisonReportSchema);

export default ComparisonReport;
