import { model, Schema } from "mongoose";

const companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Please provide your company Name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  token: {
    type: String,
  },
});

const Company = model("Company", companySchema);

export default Company;
