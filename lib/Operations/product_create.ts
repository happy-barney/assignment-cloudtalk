
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                         } from '../Model';
import { Product_Response              } from '../types';
import { X_Product_Name_Already_Exists } from '../Model/Product';
import { X_Product_Name_Invalid        } from '../Validate/Product';
import { X_Product_Price_Invalid       } from '../Validate/Product';

export const product_create : Operation = async (request, response) => {
	const model : Model = await response.model ();
	const product = request.body;

	try {
		const created : Product_Response = await model.product ().create ({
			name:        product.name,
			description: product.description,
			price:       product.price,
		});

		return response
			.status (StatusCodes.OK)
			.send   (created)
		;
	} catch (err) {
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

product_create.apiDoc = {
	summary:     'Create new product',
	operationId: 'product_create',
    requestBody: {
        required: true,
        content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/Product_Create',
				},
			},
		},
	},
	responses:  {
		[StatusCodes.OK]: {
			$ref: '#/components/responses/Product',
			// description: 'successful request, product was created',
		},
		[StatusCodes.NOT_ACCEPTABLE]: {
			$ref: '#/components/responses/Generic_Error',
			// description: "when product with current data cannot be created",
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
