import { Schema, model } from "mongoose";

interface MapTile {
    x: number;
    y: number;
    z: number;
    tile: Buffer;
    timestamp: Date;
}

const schema = new Schema<MapTile>({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    tile: { type: Buffer, required: true },
    timestamp: { type: Date, default: () => Date.now() },
});

schema.index({ x: 1, y: 1, z: 1 }, { unique: true });

export default model<MapTile>("tile", schema);
