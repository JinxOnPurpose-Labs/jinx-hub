import { defineConfig } from 'cf/config';
import worker from './worker.json';
export default defineConfig({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,worker});
