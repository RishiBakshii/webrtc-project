"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.appMode = exports.loadedEnvFile = void 0;
const dotenv_1 = require("dotenv");
const node_path_1 = __importDefault(require("node:path"));
const zod_1 = require("zod");
const nodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase();
/** Which dotenv file was loaded (for startup logs). */
exports.loadedEnvFile = nodeEnv === 'production' ? '.env.production' : '.env.development';
/** Human-readable mode for logs (`development` | `production`). */
exports.appMode = nodeEnv === 'production' ? 'production' : 'development';
(0, dotenv_1.config)({ path: node_path_1.default.resolve(process.cwd(), exports.loadedEnvFile) });
const envSchema = zod_1.z.object({
    MONGO_URI: zod_1.z.string().min(1, 'MONGO_URI is required (non-empty string)'),
});
exports.env = envSchema.parse(process.env);
