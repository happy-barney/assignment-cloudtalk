
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                         } from '../Model';
import { Review_Response               } from '../types';
import { X_Product_ID_Not_Found        } from '../Model/Product';
import { X_Review_First_Name_Invalid   } from '../Validate/Review';
import { X_Review_Last_Name_Invalid    } from '../Validate/Review';
import { X_Review_Rating_Invalid       } from '../Validate/Review';

export const review_create : Operation = async (request, response) => {
	const model : Model = await response.model ();
	const review = request.body;

	try {
		const created : Review_Response = await model.review ().create ({
			product_id: request.params.product_id.toString (),
			first_name: review.first_name,
			last_name:  review.last_name,
			comment:    review.comment,
			rating:     review.rating,
		});

		return response
			.status (StatusCodes.OK)
			.send   (created)
		;
	} catch (err) {
		if (err instanceof X_Product_ID_Not_Found) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:         err.name,
					product_id: err.product_id,
				},
			);
		}

		if (err instanceof X_Review_First_Name_Invalid) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:         err.name,
					first_name: err.first_name,
				},
			);
		}

		if (err instanceof X_Review_Last_Name_Invalid) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:        err.name,
					last_name: err.last_name,
				},
			);
		}

		if (err instanceof X_Review_Rating_Invalid) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:     err.name,
					rating: err.rating,
				},
			);
		}

		return response.boom.badRequest (
			"Bad request",
			{ error: err },
		);
	}
};

review_create.apiDoc = {
	summary:     'Create new review',
	operationId: 'review_create',
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
	],
    requestBody: {
        required: true,
        content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/Review_Create',
				},
			},
		},
	},
	responses:  {
		[StatusCodes.OK]: {
			$ref: '#/components/responses/Review',
		},
		[StatusCodes.NOT_ACCEPTABLE]: {
			$ref: '#/components/responses/Generic_Error',
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
