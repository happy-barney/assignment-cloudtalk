
import { Operation } from 'express-openapi';

import { product_create } from '../../../Operations';
import { product_list   } from '../../../Operations';

export default function () : Record <string, Operation> {
	return {
		POST: product_create,
		GET:  product_list,
	};
}
