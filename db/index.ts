import { Sequelize, DataTypes } from "sequelize";

const db = new Sequelize(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/carmedia`, {
    logging: false,
});

export default db;
export async function isConnected() {
    try {
        await db.authenticate();
        return true;
    } catch (error) {
        return false;
    }
}
