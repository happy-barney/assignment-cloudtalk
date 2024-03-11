
import { Validate_Product        } from '../lib/Validate/Product';
import { X_Product_Price_Invalid } from '../lib/Validate/Product';

import { assert } from './test-helper';
import { expect } from './test-helper';

describe ("Validate_Product.ensure_valid_product_price ()", () => {
    it ("should detect undefined value", () => {
		try {
			Validate_Product.ensure_valid_product_price (undefined);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Price_Invalid)
			;
		}
	});

    it ("should detect null value", () => {
		try {
			Validate_Product.ensure_valid_product_price (null);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Price_Invalid)
			;
		}
	});

    it ("should detect string value (not a number)", () => {
		try {
			Validate_Product.ensure_valid_product_price ("xx");
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Product_Price_Invalid)
			;
			expect (err)
				.to.have.own.property ("product_price")
				.and.equal ("xx")
			;
		}
	});

    it ("should detect non-positive price", () => {
		try {
			Validate_Product.ensure_valid_product_price (-10);
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
	});

    it ("should detect valid numeric product price", () => {
		try {
			Validate_Product.ensure_valid_product_price (10);
			assert (1, "should recognize numeric product price");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});

    it ("should detect valid stringy umeric product price", () => {
		try {
			Validate_Product.ensure_valid_product_price ("10");
			assert (1, "should recognize stringy product price");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});
});
