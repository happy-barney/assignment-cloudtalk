
import { X_Product_ID_Invalid   } from '../lib/Validate/Product';
import { X_Product_ID_Not_Found } from '../lib/Model/Product';

import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';
import { invalid_uuid        } from './test-helper';

describe ("Product.update ()", () => {
    it ("should detect invalid UUID value",
		isolated_db_context (async (model) => {
			try {
				await model.product ().update (invalid_uuid, {});
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

	it ("should report error when given ID doesn't exist",
		isolated_db_context (async (model) => {
			try {
				await model.product ().update (valid_uuid, {});
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

	it ("should do full update",
		isolated_db_context (async (model) => {
			const create  = await model.product ().create ({ name: "Name 1", price: 1.0 });
			const updated = await model.product ().update (create.id, {
				name:        "New name 1",
				description: "New description",
				price:       2.5,
			});

			assert.deepEqual (updated, {
				id:          create.id,
				name:        "New name 1",
				description: "New description",
				price:       2.5,
				rating:      0,
			});
		})
	);

	it ("should do partial update",
		isolated_db_context (async (model) => {
			const create  = await model.product ().create ({ name: "Name 1", price: 1.0 });
			const updated = await model.product ().update (create.id, {
				price:       2.5,
			});

			assert.deepEqual (updated, {
				id:          create.id,
				name:        "Name 1",
				description: null,
				price:       2.5,
				rating:      0,
			});
		})
	);

	it ("should do empty update",
		isolated_db_context (async (model) => {
			const create  = await model.product ().create ({ name: "Name 1", price: 1.0 });
			const updated = await model.product ().update (create.id, {
			});

			assert.deepEqual (updated, {
				id:          create.id,
				name:        "Name 1",
				description: null,
				price:       1.0,
				rating:      0,
			});
		})
	);

	it ("should set to null",
		isolated_db_context (async (model) => {
			const create  = await model.product ().create ({ name: "Name 1", description: "Foo", price: 1.0 });
			const updated = await model.product ().update (create.id, {
				description: null,
			});

			assert.deepEqual (updated, {
				id:          create.id,
				name:        "Name 1",
				description: null,
				price:       1.0,
				rating:      0,
			});
		})
	);
});
