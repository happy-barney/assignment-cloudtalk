
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                  } from '../Model';
import { X_Product_ID_Not_Found } from '../Model/Product';
import { X_Review_ID_Not_Found  } from '../Model/Review';

export const review_delete : Operation =
	async (request, response) => {
		const model : Model = await response.model ();

		try {
			await model.product ().raw_id (request.params.product_id.toString ()),
			await model.review ().delete (request.params.review_id.toString ());

			return response
				.status (StatusCodes.NO_CONTENT)
				.send ()
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
			if (err instanceof X_Review_ID_Not_Found) {
				return response.boom.notAcceptable (
					err.message,
					{
						id:        err.name,
						review_id: err.review_id,
					},
				);
			}
			return response.boom.badRequest (
				'Bad request',
				{ error: err },
			);
		}
	};

review_delete.apiDoc = {
	summary:     'Delete review',
	operationId: 'review_delete',
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
		{ $ref: '#/components/parameters/Review_ID' },
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
