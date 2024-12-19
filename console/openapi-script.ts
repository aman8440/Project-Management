import shell from 'shelljs';
const api = `npx openapi-typescript-codegen --input ./console/openapi.json --output ./src/swagger/api`;

shell.exec(api);