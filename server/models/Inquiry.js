import mongoose from 'mongoose';

export const INQUIRY_TYPES = ['order', 'dealer', 'rfp', 'support'];
export const INTEREST_CATEGORIES = ['uav', 'controller', 'gcs', 'avionics', 'accessory'];
export const SECTORS = ['defence', 'agriculture'];
export const INQUIRY_STATUSES = ['pending_supervisor', 'in_review', 'replied', 'closed'];

const inquirySchema = new mongoose.Schema(
  {
    ref: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: INQUIRY_TYPES,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    company: {
      type: String,
      trim: true,
      default: '',
      maxlength: 140,
    },
    region: {
      type: String,
      trim: true,
      default: '',
      maxlength: 140,
    },
    interests: {
      type: [String],
      enum: INTEREST_CATEGORIES,
      default: [],
    },
    quantity: {
      type: Number,
      min: 1,
      max: 999,
      default: 1,
    },
    sector: {
      type: String,
      enum: SECTORS,
      default: 'defence',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
      maxlength: 60,
    },
    product: {
      type: String,
      trim: true,
      default: '',
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 600,
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: 'pending_supervisor',
    },
    supervisorNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    emailStatus: {
      type: String,
      enum: ['sent', 'failed', 'skipped'],
      default: 'skipped',
    },
    emailError: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    ip: {
      type: String,
      trim: true,
      default: '',
      maxlength: 64,
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

export default Inquiry;

