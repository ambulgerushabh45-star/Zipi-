import mongoose from 'mongoose';

export const ORDER_STATUSES = ['pending_supervisor', 'confirmed', 'shipped', 'cancelled'];

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 999,
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    ref: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
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
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'United States',
      maxlength: 100,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(arr) {
          return Array.isArray(arr) && arr.length >= 1 && arr.length <= 50;
        },
        message: 'Order must contain between 1 and 50 items.',
      },
    },
    claimedTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
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

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;

