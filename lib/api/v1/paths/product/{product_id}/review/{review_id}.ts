
import { Operation } from 'express-openapi';

import { review_delete } from '../../../../../../Operations';
import { review_edit   } from '../../../../../../Operations';

export default function () : Record <string, Operation> {
	return {
		DELETE: review_delete,
		PUT:    review_edit,
	};
}
