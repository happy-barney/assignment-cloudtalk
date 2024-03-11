
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                  } from '../Model';
import { Paged                  } from '../types';
import { Review_Response        } from '../types';
import { X_Product_ID_Not_Found } from '../Model/Product';

export const review_list : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		const list : Paged<Review_Response[]> = await model
			.review ()
			.list (
				{
					page: Number (request.query.page) || 0,
					size: Number (request.query.size) || 10,
				},
				request.params.product_id.toString (),
			);

		return response
			.status (StatusCodes.OK)
			.json ({
				page_info: list.page_info,
				revies:    list.result,
			})
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

		return response.boom.badRequest (
			"Bad request",
			err,
		);
	}
};

review_list.apiDoc = {
	summary:     'List all product reviews',
	operationId: 'review_list',
	parameters:  [
		{ $ref: '#/components/parameters/Page_Size' },
		{ $ref: '#/components/parameters/Page_Number' },
	],
	responses:  {
		[StatusCodes.OK]: {
			$ref: '#/components/responses/Review_List',
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
