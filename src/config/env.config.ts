import path from "node:path";
import dotenv from "dotenv";

export const envLocal = () => dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
export const envProd  = () => dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.prod') });
