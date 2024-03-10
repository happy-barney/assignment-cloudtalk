
import bodyParser from 'body-parser';
import boom       from 'express-boom';
import express    from 'express';
import path       from 'path';
import swaggerUi  from 'swagger-ui-express';

import { ExpressOpenAPIArgs } from 'express-openapi';
import { initialize         } from 'express-openapi';

import v1_api_doc from './api/v1/api-doc';
import { config } from './Config';

export const app = express();
export default app;

app.use (boom ());
app.use (bodyParser.json ());
app.use (
	"/api-ui",
	swaggerUi.serve,
	swaggerUi.setup (
		undefined,
		{
			swaggerOptions: { url: "/api-docs" },
		}
	)
);

const initialization = {
	app:         app,
	apiDoc:      { ...v1_api_doc },
	promiseMode: true,
	paths:       path.resolve(__dirname, "api/v1/paths"),
	routesGlob:  "**/*.{ts,js}",
} as ExpressOpenAPIArgs;

initialize (initialization);

// if we get run directly, start up the app.
if (require.main === module) {
	app.set ("port", config.server.port);
	app.listen (config.server.port);
}
