
import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { assert              } from './test-helper';
import { isolated_db_context } from './test-helper';

const all_product_reviews = `SELECT
product_public_id (product_id) AS product_id,
average,
count
FROM product_review
WHERE product_public_id (product_id) = $1
`;

describe ("Product review workflows ()", () => {
	it ("product creation shouldn't create product review",
		isolated_db_context (async (model) => {
			const product = await arrange_product (model, { name: 'Product 1', price: 1.0 });

			assert.deepEqual (
				(await model.query (all_product_reviews, [ product.id ])).rows,
				[ ]
			);
		})
	);

	it ("first review should set new product review",
		isolated_db_context (async (model) => {
			const product = await arrange_product (model, { name: 'Product 1', price: 1.1 });
			await arrange_review (model, { product_id: product.id, rating: 3 });

			assert.deepEqual (
				(await model.query (all_product_reviews, [ product.id ])).rows,
				[{
					product_id: product.id,
					average:    3,
					count:      1,
				}],
				"product_review row should be created"
			);

			assert.deepEqual (
				await model.product ().fetch (product.id),
				{
					id:          product.id,
					name:        "Product 1",
					description: null,
					price:       1.1,
					rating:      3,
				},
				"rating should be propagated into product.fetch"
			);
		})
	);

	it ("subsequent reviews should adjust average review",
		isolated_db_context (async (model) => {
			const product = await arrange_product (model, { name: 'Product 1', price: 1.0 });
			const r1 = await arrange_review (model, { product_id: product.id, rating: 3 });
			const r2 = await arrange_review (model, { product_id: product.id, rating: 4 });
			const r3 = await arrange_review (model, { product_id: product.id, rating: 4 });
			const r4 = await arrange_review (model, { product_id: product.id, rating: 4 });

			assert.deepEqual (
				(await model.query (all_product_reviews, [ product.id ])).rows,
				[{
					product_id: product.id,
					average:    3.75,
					count:      4,
				}],
				"product_review row should be up-to-date"
			);

			assert.deepEqual (
				await model.product ().fetch (product.id),
				{
					id:          product.id,
					name:        "Product 1",
					description: null,
					price:       1.0,
					rating:      3.75,
				},
				"rating should be propagated into product.fetch"
			);

			await model.review ().delete (r1.id);
			await model.review ().delete (r2.id);
			await model.review ().delete (r3.id);
			await model.review ().delete (r4.id);

			assert.deepEqual (
				(await model.query (all_product_reviews, [ product.id ])).rows,
				[{
					product_id: product.id,
					average:    0,
					count:      0,
				}],
				"after deleting all product review should be in 'empty' state"
			);

			assert.deepEqual (
				await model.product ().fetch (product.id),
				{
					id:          product.id,
					name:        "Product 1",
					description: null,
					price:       1.0,
					rating:      0,
				},
				"deleted ratings should be propagated into product.fetch"
			);

			await arrange_review (model, { product_id: product.id, rating: 4 });
			assert.deepEqual (
				(await model.query (all_product_reviews, [ product.id ])).rows,
				[{
					product_id: product.id,
					average:    4,
					count:      1,
				}],
				"after deleting all product review should be in 'empty' state"
			);
		})
	);
});

