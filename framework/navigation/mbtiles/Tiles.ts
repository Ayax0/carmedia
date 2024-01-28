import { DataTypes, Model } from "sequelize";
import db from "./";

interface Tiles extends Model {
    zoom_level: number;
    tile_column: number;
    tile_row: number;
    tile_data: Buffer;
}

const schema = db.define<Tiles>(
    "tiles",
    {
        zoom_level: { type: DataTypes.INTEGER },
        tile_column: { type: DataTypes.INTEGER },
        tile_row: { type: DataTypes.INTEGER },
        tile_data: { type: DataTypes.BLOB },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ["zoom_level", "tile_column", "tile_row"],
            },
        ],
        tableName: "tiles",
    }
);

export default schema;
