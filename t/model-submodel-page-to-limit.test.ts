
import { Model    } from '../lib/Model';
import { Submodel } from '../lib/Model/Submodel';

import { assert } from './test-helper';

describe ("page_to_limit ()", () => {
	const submodel : Submodel = new Submodel ({} as Model);

    it ("should build SQL snippet for single page", () => {
		const result = submodel.page_to_limit ({ page: 0, size: 10 });
		assert.equal(result, "LIMIT 10 OFFSET 0");
	});

    it ("should build SQL snippet when nth page is requested", () => {
		const result = submodel.page_to_limit ({ page: 11, size: 15 });
		assert.equal(result, "LIMIT 15 OFFSET 165");
	});
});
