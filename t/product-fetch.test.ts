
import { X_Product_ID_Invalid   } from '../lib/Validate/Product';
import { X_Product_ID_Not_Found } from '../lib/Model/Product';

import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';
import { invalid_uuid        } from './test-helper';

describe ("Product.fetch ()", () => {
    it ("should detect invalid UUID value",
		isolated_db_context (async (model) => {
			try {
				await model.product ().delete (invalid_uuid);
				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_ID_Invalid)
				;
				expect (err)
					.to.have.own.property ("product_id")
					.and.equal (invalid_uuid)
				;
			}
		})
	);

	it ("should detect non-existing product",
		isolated_db_context (async (model) => {
			try {
				await model.product ().fetch (valid_uuid);
				assert.fail ("shouldn't live but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_ID_Not_Found)
				;
				expect (err)
					.to.have.own.property ("product_id")
					.and.equal (valid_uuid)
				;
			}
		})
	);

	it ("should fetch existing row",
		isolated_db_context (async (model) => {
			const create = await model.product ().create ({ name: "Name", price: 2.5 });
			const result = await model.product ().fetch (create.id);

			assert.deepEqual (result, {
				id:          result.id,
				name:        "Name",
				description: null,
				price:       2.5,
			});
		})
	);
});
