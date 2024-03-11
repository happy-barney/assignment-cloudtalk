
import { arrange_product     } from './test-helper';
import { expect              } from './test-helper';
import { isolated_db_context } from './test-helper';

describe ("Product.count ()", () => {
	it ("should count empty table",
		isolated_db_context (async (model) => {
			const result = await model.product ().count ();

			expect (result)
				.equal (0)
			;
		})
	);

	it ("should count rows in table",
		isolated_db_context (async (model) => {
			await arrange_product (model, { name: "Name 1" });
			await arrange_product (model, { name: "Name 2" });
			await arrange_product (model, { name: "Name 3" });
			await arrange_product (model, { name: "Name 4" });
			await arrange_product (model, { name: "Name 5" });

			const result = await model.product ().count ();

			expect (result)
				.equal (5)
			;
		})
	);
});
