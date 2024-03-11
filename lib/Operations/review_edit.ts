
import { Operation   } from 'express-openapi';
import { StatusCodes } from 'http-status-codes';

import { Model                       } from '../Model';
import { Review_Response             } from '../types';
import { X_Review_First_Name_Invalid } from '../Validate/Review';
import { X_Review_ID_Not_Found       } from '../Model/Review';
import { X_Review_Last_Name_Invalid  } from '../Validate/Review';
import { X_Review_Rating_Invalid     } from '../Validate/Review';

export const review_edit : Operation = async (request, response) => {
	const model : Model = await response.model ();

	try {
		const edited : Review_Response = await model.review ().update (
			request.params.review_id.toString (),
			request.body
		);

		return response
			.status (StatusCodes.OK)
			.send (edited)
		;
	} catch (err) {
		if (err instanceof X_Review_ID_Not_Found) {
			return response.boom.notAcceptable (
				err.message,
				{
					id:        err.name,
					review_id: err.review_id,
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

review_edit.apiDoc = {
	summary:     "Modify review",
	operationId: "review_edit",
	parameters:  [
		{ $ref: '#/components/parameters/Product_ID' },
		{ $ref: '#/components/parameters/Review_ID' },
	],
    requestBody: {
        required: true,
        content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/Review_Update',
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
