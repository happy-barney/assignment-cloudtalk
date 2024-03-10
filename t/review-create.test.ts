
import { X_Product_ID_Not_Found      } from '../lib/Model/Product';
import { X_Product_ID_Invalid        } from '../lib/Validate/Product';
import { X_Review_First_Name_Invalid } from '../lib/Validate/Review';
import { X_Review_Last_Name_Invalid  } from '../lib/Validate/Review';
import { X_Review_Rating_Invalid     } from '../lib/Validate/Review';

import { arrange_product     } from './test-helper';
import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { invalid_uuid        } from './test-helper';
import { isolated_db_context } from './test-helper';
import { valid_uuid          } from './test-helper';

describe ("Review.create ()", () => {
	it ("should detect invalid product id",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: invalid_uuid,
					first_name: "First name",
					last_name:  "Last name",
					comment:    "Great product",
					rating:     5,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_ID_Invalid)
				;
				expect (err)
					.to.have.own.property ("product_id")
				;
			}
		})
	);

	it ("should detect non-existing product id",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: valid_uuid,
					first_name: "First name",
					last_name:  "Last name",
					comment:    "Great product",
					rating:     5,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_ID_Not_Found)
				;
				expect (err)
					.to.have.own.property ("product_id")
				;
			}
		})
	);

	it ("should detect invalid first name",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: (await arrange_product (model)).id,
					first_name: "---",
					last_name:  "Last name",
					comment:    "Great product",
					rating:     5,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_First_Name_Invalid)
				;
				expect (err)
					.to.have.own.property ("first_name")
					.and.equal ("---")
				;
			}
		})
	);

	it ("should detect invalid last name",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: (await arrange_product (model)).id,
					first_name: "First name",
					last_name:  "---",
					comment:    "Great product",
					rating:     5,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_Last_Name_Invalid)
				;
				expect (err)
					.to.have.own.property ("last_name")
					.and.equal ("---")
				;
			}
		})
	);

	it ("should detect invalid rating - too low",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: (await arrange_product (model)).id,
					first_name: "First name",
					last_name:  "Last name",
					comment:    "Great product",
					rating:     -10,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_Rating_Invalid)
				;
				expect (err)
					.to.have.own.property ("rating")
					.and.equal (-10)
				;
			}
		})
	);

	it ("should detect invalid rating - too high",
		isolated_db_context (async (model) => {
			try {
				await model.review ().create ({
					product_id: (await arrange_product (model)).id,
					first_name: "First name",
					last_name:  "Last name",
					comment:    "Great product",
					rating:     10,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Review_Rating_Invalid)
				;
				expect (err)
					.to.have.own.property ("rating")
					.and.equal (10)
				;
			}
		})
	);

	it ("should create new review",
		isolated_db_context (async (model) => {
			const product_id : string = (await arrange_product (model)).id;
			const result = await model.review ().create ({
				product_id: product_id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Great product",
				rating:     5,
			});

			assert.deepEqual (result, {
				id: result.id,
				product_id: product_id,
				first_name: "First name",
				last_name:  "Last name",
				comment:    "Great product",
				rating:     5,
			});
		})
	);
});

