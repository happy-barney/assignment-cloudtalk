
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                  } from '../Model';
import { X_Product_ID_Not_Found } from '../Model/Product';

export const product_fetch : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		return response
			.status (StatusCodes.OK)
			.send (
				await model.product ().fetch (request.params.product_id.toString ())
			)
		;
	} catch (err) {
		if (err instanceof X_Product_ID_Not_Found) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:   err.name,
					name: err.product_id,
				},
			);
		}

		return response.boom.badRequest (
			'Bad request',
			{ error: err },
		);
	}
};

product_fetch.apiDoc = {
	summary:     'Fetch product data',
	operationId: 'product_fetch',
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
	],
	responses:  {
		[StatusCodes.OK]: {
			$ref: '#/components/responses/Product',
		},
		[StatusCodes.NOT_ACCEPTABLE]: {
			$ref: '#/components/responses/Generic_Error',
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
