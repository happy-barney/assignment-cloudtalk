
import { Validate_Product     } from '../lib/Validate/Product';
import { X_Product_ID_Invalid } from '../lib/Validate/Product';

import { assert       } from './test-helper';
import { expect       } from './test-helper';
import { invalid_uuid } from './test-helper';
import { valid_uuid   } from './test-helper';

describe ("Validate_Product.ensure_valid_public_id ()", () => {
    it ("should detect undefined value", () => {
		try {
			Validate_Product.ensure_valid_public_id (undefined);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_ID_Invalid)
			;
		}
	});

    it ("should detect null value", () => {
		try {
			Validate_Product.ensure_valid_public_id (null);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_ID_Invalid)
			;
		}
	});

    it ("should detect non-UUID value", () => {
		try {
			Validate_Product.ensure_valid_public_id ("foo");
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_ID_Invalid)
			;
			expect (err)
				.to.have.own.property ("product_id")
				.and.equal ("foo")
			;
		}
	});

    it ("should detect invalid UUID value", () => {
		try {
			Validate_Product.ensure_valid_public_id (invalid_uuid);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_ID_Invalid)
			;
			expect (err)
				.to.have.own.property ("product_id")
				.and.equal (invalid_uuid)
			;
		}
	});

    it ("should detect valid UUID value", () => {
		try {
			Validate_Product.ensure_valid_public_id (valid_uuid);
			assert (1, "should recognize valid UUID");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});
});
