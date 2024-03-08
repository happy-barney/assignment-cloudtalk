
import { Model    } from '../lib/Model';
import { Submodel } from '../lib/Model/Submodel';

import { assert } from './test-helper';

describe ("pages_result ()", () => {
	const submodel : Submodel = new Submodel ({} as Model);

    it ("for first page which is last", () => {
		const result = submodel.paged_result (
			{ page: 0, size: 10 },
			5,
			[ "pass-through" ],
		);
		assert.deepEqual(result, {
			page_info: {
				size:     10,
				pages:    1,
			},
			result: [ "pass-through" ],
		});
	});

    it ("for first page which isn't last", () => {
		const result = submodel.paged_result (
			{ page: 0, size: 10 },
			55,
			[ "pass-through" ],
		);
		assert.deepEqual(result, {
			page_info: {
				size:     10,
				pages:    6,
				next:     1,
			},
			result: [ "pass-through" ],
		});
	});

    it ("for last page which isn't first", () => {
		const result = submodel.paged_result (
			{ page: 5, size: 10 },
			55,
			[ "pass-through" ],
		);
		assert.deepEqual(result, {
			page_info: {
				size:     10,
				pages:    6,
				previous: 4,
			},
			result: [ "pass-through" ],
		});
	});

    it ("for page which is neither first nor last", () => {
		const result = submodel.paged_result (
			{ page: 1, size: 10 },
			55,
			[ "pass-through" ],
		);
		assert.deepEqual(result, {
			page_info: {
				size:     10,
				pages:    6,
				previous: 0,
				next:     2,
			},
			result: [ "pass-through" ],
		});
	});
});
