
import { Operation } from 'express-openapi';

import { review_create } from '../../../../../Operations';
import { review_list   } from '../../../../../Operations';

export default function () : Record <string, Operation> {
	return {
		GET:  review_list,
		POST: review_create,
	};
}
