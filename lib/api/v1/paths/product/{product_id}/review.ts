
import { Operation } from 'express-openapi';

import { review_create } from '../../../../../Operations';

export default function () : Record <string, Operation> {
	return {
		POST: review_create,
	};
}
