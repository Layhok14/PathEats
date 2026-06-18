import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname,'../../')
const CODE_SOURCE = path.resolve(__dirname,'../')

export const paths = {
    root: PROJECT_ROOT,
    src: CODE_SOURCE,
    db: path.join(CODE_SOURCE,'db'),
    config: path.join(CODE_SOURCE,'config'),
    service: path.join(CODE_SOURCE,'services'),
    util: path.join(CODE_SOURCE,'utils'),
    route: path.join(CODE_SOURCE,'routes'),
    repository: path.join(CODE_SOURCE,'repositories'),
    controller: path.join(CODE_SOURCE,'controllers'),
    middleware: path.join(CODE_SOURCE,'middlewares'),
    model: path.join(CODE_SOURCE,'models'),
    env: path.join(PROJECT_ROOT,'.env')
}

export default paths;
