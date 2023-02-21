import { DataTypes, Model } from "sequelize";
import db from "./";

interface Metadata extends Model {
    key: string;
    value: string;
}

const schema = db.define<Metadata>(
    "metadata",
    {
        key: { type: DataTypes.STRING, primaryKey: true },
        value: { type: DataTypes.STRING },
    },
    { tableName: "metadata", timestamps: false }
);

export default schema;
