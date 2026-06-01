import { Schema, model, models, Model } from "mongoose";

const todoListSchema = new Schema({
    title: {
        type: String,
        required: [true, "The title is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "done"],
        default: "pending",
        required: [true, "The status is required"],
    },
    time: {
        type: Number,
        default: 0,
        min: 0,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    endedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Todolist: Model<any> = models.Todolist || model("Todolist", todoListSchema);

export default Todolist;
