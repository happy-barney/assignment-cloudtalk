
import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';

describe ("Review.count ()", () => {
	it ("should count empty table",
		isolated_db_context (async (model) => {
			const result = await model.review ().count (0);

			expect (result)
				.equal (0)
			;
		})
	);

	it ("should count rows in table for one product",
		isolated_db_context (async (model) => {
			const p1 = await arrange_product (model);
			const p2 = await arrange_product (model);
			await arrange_review (model, { first_name: "Name 1", rating: 1, product_id: p1.id });
			await arrange_review (model, { first_name: "Name 2", rating: 2, product_id: p1.id });
			await arrange_review (model, { first_name: "Name 3", rating: 3, product_id: p1.id });
			await arrange_review (model, { first_name: "Name 4", rating: 4, product_id: p2.id });
			await arrange_review (model, { first_name: "Name 5", rating: 5, product_id: p2.id });

			const p1_raw_id = await model.product ().raw_id (p1.id);
			const result = await model.review ().count (p1_raw_id);

			expect (result)
				.equal (3)
			;
		})
	);
});
