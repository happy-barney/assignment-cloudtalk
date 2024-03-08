
import { X_Product_Name_Already_Exists } from '../lib/Model/Product';
import { X_Product_Name_Invalid        } from '../lib/Validate/Product';
import { X_Product_Price_Invalid       } from '../lib/Validate/Product';

import { assert              } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';

describe ("Product.create ()", () => {
	it ("should detect invalid price",
		isolated_db_context (async (model) => {
			try {
				await model.product ().create ({
					name:        "New product with description",
					description: "Some description",
					price:       -10,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_Price_Invalid)
				;
				expect (err)
					.to.have.own.property ("product_price")
					.and.equal (-10)
				;
			}
		})
	);

	it ("should detect invalid name",
		isolated_db_context (async (model) => {
			try {
				await model.product ().create ({
					name:        "",
					description: "Some description",
					price:       10,
				});

				assert.fail ("Expected to die but it lives");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_Name_Invalid)
				;
				expect (err)
					.to.have.own.property ("product_name")
					.and.equal ("")
				;
			}
		})
	);

	it ("should create new product with description",
		isolated_db_context (async (model) => {
			const result = await model.product ().create ({
				name:        "New product with description",
				description: "Some description",
				price:       1.0,
			});


			assert.deepEqual (result, {
				id:          result.id,
				name:        "New product with description",
				description: "Some description",
				price:       1.0,
			});
		})
	);

	it ("should create new product without description",
		isolated_db_context (async (model) => {
			const result = await model.product ().create ({
				name:        "New product without description",
				price:       1.0,
			});

			assert.deepEqual (result, {
				id:          result.id,
				name:        "New product without description",
				description: null,
				price:       1.0,
			});
		})
	);

	it ("should report an error when provided name isn't unique",
		isolated_db_context (async (model) => {
			await model.product ().create ({
				name:        "New product with description",
				description: "Some description",
				price:       1.0,
			});

			try {
				await model.product ().create ({
					name:  "New product with description",
					price: 1.0,
				});

				assert.fail ("Creation of product with duplicated name should fail but it didn't");
			} catch (err) {
				expect (err)
					.to.be.an.instanceof (X_Product_Name_Already_Exists)
				;
				expect (err)
					.to.have.own.property ("product_name")
					.and.equal ("New product with description")
				;
			}
		})
	);
});
