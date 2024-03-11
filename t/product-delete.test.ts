
import { X_Product_ID_Invalid } from '../lib/Validate/Product';

import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';
import { invalid_uuid        } from './test-helper';

describe ("Product.delete ()", () => {
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

	it ("should successfully delete non-existing product",
		isolated_db_context (async (model) => {
			try {
				await model.product ().delete (valid_uuid);
				assert (true);
			} catch (err) {
				console.log (err);
				assert.fail ();
			}
		})
	);

	it ("should delete existing row",
		isolated_db_context (async (model) => {
			const result = await arrange_product (model);
			await arrange_product (model);
			await arrange_product (model);
			await arrange_product (model);
			await arrange_product (model);

			try {
				await model.product ().delete (result.id);
				assert (true);
			} catch (err) {
				console.log (err);
				assert.fail ();
			}

			expect (await model.product ().count ())
				.equal (4)
			;
		})
	);

	it ("should delete existing row with reviews",
		isolated_db_context (async (model) => {
			const product = await arrange_product (model);
			await arrange_review (model, { product_id: product.id });

			await model.product ().delete (product.id);
			assert.deepEqual (
				(await model.query ('SELECT * FROM product')).rows,
				[],
				"there shouldn't be any product left"
			);

			assert.deepEqual (
				(await model.query ('SELECT * FROM product_review')).rows,
				[],
				"there shouldn't be any product_review left"
			);

			assert.deepEqual (
				(await model.query ('SELECT * FROM review')).rows,
				[],
				"there shouldn't be any review left"
			);
		})
	);
});
