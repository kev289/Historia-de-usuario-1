import { Schema, model, models, Model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
    },
    age: {
        type: String,
        required: [true, "The age is required"],
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const User: Model<any> = models.User || model("User", userSchema);

export { User };
