import { Sequelize } from "sequelize";

const db = new Sequelize({ dialect: "sqlite", storage: "./map.mbtiles", logging: false, sync: { logging: true } });

export default db;

export async function isConnected() {
    try {
        await db.authenticate();
        return true;
    } catch (error) {
        return false;
    }
}
