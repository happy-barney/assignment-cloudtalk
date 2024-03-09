
import { Validate_Product       } from '../lib/Validate/Product';
import { X_Product_Name_Invalid } from '../lib/Validate/Product';

import { assert } from './test-helper';
import { expect } from './test-helper';

describe ("Validate_Product.ensure_valid_product_name ()", () => {
    it ("should detect undefined value", () => {
		try {
			Validate_Product.ensure_valid_product_name (undefined);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Name_Invalid)
			;
		}
	});

    it ("should detect null value", () => {
		try {
			Validate_Product.ensure_valid_product_name (null);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Name_Invalid)
			;
		}
	});

    it ("should detect string too short", () => {
		try {
			Validate_Product.ensure_valid_product_name ("xx");
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Name_Invalid)
			;
			expect (err)
				.to.have.own.property ("product_name")
				.and.equal ("xx")
			;
		}
	});

    it ("should detect string without meaningful character", () => {
		try {
			Validate_Product.ensure_valid_product_name ("      ");
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Name_Invalid)
			;
			expect (err)
				.to.have.own.property ("product_name")
				.and.equal ("      ")
			;
		}
	});

    it ("should detect valid product name", () => {
		try {
			Validate_Product.ensure_valid_product_name ("product name");
			assert (1, "should recognize valid product name");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});
});
