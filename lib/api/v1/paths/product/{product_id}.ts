
import { Operation } from 'express-openapi';

import { product_delete } from '../../../../Operations';

export default function () : Record <string, Operation> {
	return {
		DELETE: product_delete,
	};
}
