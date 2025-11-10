import mongoose from "mongoose";

const SavedForLaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
},
{ timestamps: true}
);

const SavedForLater = mongoose.models.SavedForLater || mongoose.model("SavedForLater", SavedForLaterSchema);
export default SavedForLater;
