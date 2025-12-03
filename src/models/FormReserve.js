import mongoose from "mongoose";
const { Schema } = mongoose;

const FormReserveSchema = new Schema(
  {
    full_name: String,
    email: String,
    phone: Number,
    required_service: {
      type: String,
      enum: [
        "Derecho civil",
        "Derecho familiar",
        "Derecho mercantil",
        "Derecho penal",
        "Derecho laboral",
        "Derecho inmobiliario",
      ],
      default: "",
    },
    preferred_date: String,
    preferred_hour: String,
    additional_message: String,
    reservation_accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FormReserve = mongoose.model("FormReserve", FormReserveSchema);
