
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                         } from '../Model';
import { Product_Response              } from '../types';
import { X_Product_ID_Not_Found        } from '../Model/Product';
import { X_Product_Name_Already_Exists } from '../Model/Product';
import { X_Product_Name_Invalid        } from '../Validate/Product';
import { X_Product_Price_Invalid       } from '../Validate/Product';

export const product_edit : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		const edited : Product_Response = await model.product ().update (
			request.params.product_id.toString (),
			request.body
		);

		return response
			.status (StatusCodes.OK)
			.send (edited)
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

		if (err instanceof X_Product_Name_Already_Exists) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:   err.name,
					name: err.product_name,
				},
			);
		}

		if (err instanceof X_Product_Name_Invalid) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:   err.name,
					name: err.product_name,
				},
			);
		}

		if (err instanceof X_Product_Price_Invalid) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:    err.name,
					price: err.product_price,
				},
			);
		}

		return response.boom.badRequest (
			"Bad request",
			{ error: err },
		);
	}
};

product_edit.apiDoc = {
	summary:     "Modify product",
	operationId: "product_edit",
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
	],
    requestBody: {
        required: true,
        content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/Product_Update',
				},
			},
		},
	},
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
