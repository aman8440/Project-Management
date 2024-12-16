import shell from 'shelljs';
import { constVariables } from '../src/constants'
const api = `npx openapi-typescript-codegen --input ${constVariables.swagger_url} --output ./src/swagger/api`;

shell.exec(api);