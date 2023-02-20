import { DataTypes, Model } from "sequelize";
import db from "./";

interface MapTile extends Model {
    x: number;
    y: number;
    z: number;
    tile: Buffer;
    timestamp: Date;
}

const schema = db.define<MapTile>(
    "MapTile",
    {
        x: { type: DataTypes.INTEGER, allowNull: false },
        y: { type: DataTypes.INTEGER, allowNull: false },
        z: { type: DataTypes.INTEGER, allowNull: false },
        tile: { type: DataTypes.BLOB, allowNull: false },
        timestamp: { type: DataTypes.DATE, defaultValue: new Date() },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["x", "y", "z"],
            },
        ],
        tableName: "maptile",
    }
);
db.sync();

export default schema;
