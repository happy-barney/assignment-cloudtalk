
import { arrange_product     } from './test-helper';
import { arrange_review      } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';

describe ("Review.list ()", () => {
	it ("should return empty list",
		isolated_db_context (async (model) => {
			const p1   = await arrange_product (model);
			const list = await model.review ().list ({ page: 0, size: 10 }, p1.id);

			expect (list)
				.to.deep.equal ({
					page_info: {
						size: 10,
						pages: 0,
					},
					result: [],
				})
			;
		})
	);

	it ("should list rows in table",
		isolated_db_context (async (model) => {
			const p1 = await arrange_product (model);
			const p2 = await arrange_product (model);
			const r1 = await arrange_review (model, { rating: 1, product_id: p1.id });
			const r2 = await arrange_review (model, { rating: 2, product_id: p1.id });
			const r3 = await arrange_review (model, { rating: 3, product_id: p1.id });
			const r4 = await arrange_review (model, { rating: 4, product_id: p1.id });
			const r5 = await arrange_review (model, { rating: 5, product_id: p1.id });
			await arrange_review (model, { rating: 5, product_id: p2.id });

			const list = await model.review ().list ({ page: 0, size: 20 }, p1.id);

			expect (list)
				.to.deep.equal ({
					page_info: {
						size:  20,
						pages: 1,
					},
					result: [ r5, r4, r3, r2, r1, ],
				})
			;
		})
	);

	false && it ("should list paged rows in table",
		isolated_db_context (async (model) => {
			const p1 = await arrange_product (model);
			const p2 = await arrange_product (model);
			const reviews = [
				await arrange_review (model, { rating: 1, product_id: p1.id }),
				await arrange_review (model, { rating: 2, product_id: p1.id }),
				await arrange_review (model, { rating: 3, product_id: p1.id }),
				await arrange_review (model, { rating: 4, product_id: p1.id }),
				await arrange_review (model, { rating: 5, product_id: p1.id }),
				await arrange_review (model, { rating: 5, product_id: p2.id }),
			];

			const list = await model.review ().list (
				{ page: 1, size: 2 },
				p1.id
			);

			expect (list)
				.to.deep.equal ({
					page_info: {
						size:     2,
						pages:    3,
						next:     2,
						previous: 0,
					},
					result: [
						reviews[2],
						reviews[1],
					],
				})
			;
		})
	);
});
