
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                  } from '../Model';
import { X_Product_ID_Not_Found } from '../Model/Product';

export const product_delete : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		await model.product ().delete (request.params.product_id.toString ());

		return response
			.status (StatusCodes.NO_CONTENT)
			.send ()
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

product_delete.apiDoc = {
	summary:     'Delete product',
	operationId: 'product_delete',
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
	],
	responses:  {
		[StatusCodes.NO_CONTENT]: {
			description: 'success, you will not see it anymore',
		},
		[StatusCodes.NOT_ACCEPTABLE]: {
			$ref: '#/components/responses/Generic_Error',
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
