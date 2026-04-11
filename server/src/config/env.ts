import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { z } from 'zod'

const nodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase()
/** Which dotenv file was loaded (for startup logs). */
export const loadedEnvFile = nodeEnv === 'production' ? '.env.production' : '.env.development'
/** Human-readable mode for logs (`development` | `production`). */
export const appMode = nodeEnv === 'production' ? 'production' : 'development'

loadEnv({ path: path.resolve(process.cwd(), loadedEnvFile) })

const envSchema = z.object({
  MONGO_URI: z.string().min(1, 'MONGO_URI is required (non-empty string)'),
})

export type Env = z.infer<typeof envSchema>

export const env: Env = envSchema.parse(process.env)
