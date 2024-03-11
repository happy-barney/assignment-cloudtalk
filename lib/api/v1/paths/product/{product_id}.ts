
import { Operation } from 'express-openapi';

import { product_delete } from '../../../../Operations';
import { product_edit   } from '../../../../Operations';
import { product_fetch  } from '../../../../Operations';

export default function () : Record <string, Operation> {
	return {
		DELETE: product_delete,
		GET:    product_fetch,
		PUT:    product_edit,
	};
}
