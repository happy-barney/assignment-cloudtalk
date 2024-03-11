
// Inject function returning database client into Response.

import { NextFunction } from 'express';
import { Request      } from 'express';
import { Response     } from 'express';

import { DBI    } from '../DBI';
import { Model  } from '../Model';
import { config } from '../Config';

type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

export default function init_model (): MiddlewareFn {
	return async (req, res, next) => {
		let model : Model | null;

		await DBI.initialize (config.database);

		res.model = async () : Promise<Model> => {
			return model ||= await Model.instance ();
		};

		res.on ("close", async () => {
			await model?.terminate();
		});

		next();
	};
}

declare module "http" {
	interface ServerResponse {
		model: () => Promise<Model>;
	}
}
