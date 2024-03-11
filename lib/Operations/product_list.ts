
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model            } from '../Model';
import { Paged            } from '../types';
import { Product_Response } from '../types';

export const product_list : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		const list : Paged<Product_Response[]> = await model
			.product ()
			.list ({
				page: Number (request.query.page) || 0,
				size: Number (request.query.size) || 10,
			});

		return response
			.status (StatusCodes.OK)
			.json ({
				page_info: list.page_info,
				products:  list.result,
			})
		;
	} catch (err) {
		return response.boom.badRequest (
			"Bad request",
			err,
		);
	}
};

product_list.apiDoc = {
	summary:     'List all products',
	operationId: 'product_list',
	parameters:  [
		{ $ref: '#/components/parameters/Page_Size' },
		{ $ref: '#/components/parameters/Page_Number' },
	],
	responses:  {
		[StatusCodes.OK]: {
			$ref: '#/components/responses/Product_List',
		},
		[StatusCodes.BAD_REQUEST]: {
			$ref: '#/components/responses/Bad_Request',
		},
	},
};
