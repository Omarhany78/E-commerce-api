const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide product name"],
      trim: true,
      maxLength: [100, "Name can not be more than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "You must provide product price"],
    },

    description: {
      type: String,
      required: [true, "You must provide product description"],
      maxLength: [1000, "Dexcription can not be more than 1000 characters"],
      default: 0,
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },

    category: {
      type: String,
      enum: ["office", "kitchen", "bedroom"],
      required: [true, "You must provide product category"],
    },

    company: {
      type: String,
      required: [true, "You must provide product comapny"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: `{VALUE} is not supported`,
      },
    },

    colors: {
      type: [String],
      default: ["Unknown"],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: true,
      default: 15,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  justOne: false,
  localField: "_id",
  foreignField: "product",
});

module.exports = mongoose.model("Product", ProductSchema);
