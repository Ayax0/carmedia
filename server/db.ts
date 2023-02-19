import mongoose from "mongoose";

const db_string = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/carmedia?authSource=${process.env.DB_USERNAME}`;

mongoose.set("strictQuery", false);
mongoose
    .connect(db_string)
    .then(() => console.log("database connected"))
    .catch(() => console.log("database error"));

export default defineEventHandler(() => "ok");
