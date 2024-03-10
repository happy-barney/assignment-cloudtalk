
import { X_Review_ID_Invalid         } from '../lib/Validate/Review';
import { X_Review_ID_Not_Found       } from '../lib/Model/Review';

import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';
import { invalid_uuid        } from './test-helper';

describe ("Review.update ()", () => {
	it ("should detect invalid UUID value",
		isolated_db_context (async (model) => {
			try {
				await model.review ().update (invalid_uuid, {});
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

	it ("should report error when given ID doesn't exist",
		isolated_db_context (async (model) => {
			try {
				await model.review ().update (valid_uuid, {});
				assert.fail ("shouldn't live but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_ID_Not_Found)
				;
				expect (err)
					.to.have.own.property ("review_id")
					.and.equal (valid_uuid)
				;
			}
		})
	);

	it ("should do full update",
		isolated_db_context (async (model) => {
			const product = await arrange_product (model);
			const review  = await arrange_review  (model, { product_id: product.id, rating: 1 });
			const updated = await model.review ().update (review.id, {
				first_name: 'New First Name',
				last_name:  'New Last Name',
				comment:    'New Comment',
				rating:     5,
			});

			assert.deepEqual (updated, {
				id:         review.id,
				product_id: product.id,
				first_name: "New First Name",
				last_name:  "New Last Name",
				comment:    "New Comment",
				rating:     5,
			});
		})
	);

	it ("should do partial update",
		isolated_db_context (async (model) => {
			const product_1 = await arrange_product (model);
			const review    = await arrange_review  (model, {
				product_id: product_1.id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Total garbage",
				rating:     0,
			});
			const updated   = await model.review ().update (review.id, {
				rating: 4,
			});

			assert.deepEqual (updated, {
				id:         review.id,
				product_id: product_1.id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Total garbage",
				rating:     4,
			});
		})
	);

	it ("should do empty update",
		isolated_db_context (async (model) => {
			const product_1 = await arrange_product (model);
			const review    = await arrange_review  (model, {
				product_id: product_1.id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Total garbage",
				rating:     0,
			});
			const updated   = await model.review ().update (review.id, {
			});

			assert.deepEqual (updated, {
				id:         review.id,
				product_id: product_1.id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Total garbage",
				rating:     0,
			});
		})
	);
});
