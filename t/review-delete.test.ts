
import { X_Review_ID_Invalid } from '../lib/Validate/Review';

import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';
import { invalid_uuid        } from './test-helper';

describe ("Review.delete ()", () => {
    it ("should detect invalid UUID value",
		isolated_db_context (async (model) => {
			try {
				await model.review ().delete (invalid_uuid);
				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_ID_Invalid)
				;
				expect (err)
					.to.have.own.property ("review_id")
					.and.equal (invalid_uuid)
				;
			}
		})
	);

	it ("should successfully delete non-existing review",
		isolated_db_context (async (model) => {
			try {
				await model.review ().delete (valid_uuid);
				assert (true);
			} catch (err) {
				console.log (err);
				assert.fail ();
			}
		})
	);

	it ("should delete existing row",
		isolated_db_context (async (model) => {
			const p1 = await arrange_product (model);
			const review_id : string = (await arrange_review (model, { product_id: p1.id })).id;
			await arrange_review (model, { product_id: p1.id });
			await arrange_review (model, { product_id: p1.id });
			await arrange_review (model, { product_id: p1.id });
			await arrange_review (model, { product_id: p1.id });

			try {
				await model.review ().delete (review_id);
				assert (true);
			} catch (err) {
				console.log (err);
				assert.fail ();
			}

			const p1_raw_id = await model.product ().raw_id (p1.id);
			expect (await model.review ().count (p1_raw_id))
				.equal (4)
			;
		})
	);
});
