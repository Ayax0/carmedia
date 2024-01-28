import { DataTypes, Model } from "sequelize";
import db from "./";

interface Metadata extends Model {
    name: string;
    value: string;
}

const schema = db.define<Metadata>(
    "metadata",
    {
        name: { type: DataTypes.STRING, primaryKey: true },
        value: { type: DataTypes.STRING },
    },
    { tableName: "metadata", timestamps: false }
);

export default schema;
