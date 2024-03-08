
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';

describe ("Product.list ()", () => {
	it ("should return empty list",
		isolated_db_context (async (model) => {
			const list = await model.product ().list ({ page: 0, size: 10 });

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
			const products = [
				await model.product ().create ({ name: "Name 1", price: 1.1 }),
				await model.product ().create ({ name: "Name 2", price: 1.2 }),
				await model.product ().create ({ name: "Name 3", price: 1.3 }),
				await model.product ().create ({ name: "Name 4", price: 1.4 }),
				await model.product ().create ({ name: "Name 5", price: 1.5 }),
			];

			const list = await model.product ().list ({ page: 0, size: 20 });

			expect (list)
				.to.deep.equal ({
					page_info: {
						size:  20,
						pages: 1,
					},
					result: products,
				})
			;
		})
	);

	it ("should list paged rows in table",
		isolated_db_context (async (model) => {
			const products = [
				await model.product ().create ({ name: "Name 1", price: 1.1 }),
				await model.product ().create ({ name: "Name 2", price: 1.2 }),
				await model.product ().create ({ name: "Name 3", price: 1.3 }),
				await model.product ().create ({ name: "Name 4", price: 1.4 }),
				await model.product ().create ({ name: "Name 5", price: 1.5 }),
			];

			const list = await model.product ().list ({ page: 1, size: 2 });

			expect (list)
				.to.deep.equal ({
					page_info: {
						size:     2,
						pages:    3,
						next:     2,
						previous: 0,
					},
					result: [
						products[2],
						products[3],
					],
				})
			;
		})
	);
});
