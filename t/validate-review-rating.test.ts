
import { Validate_Review         } from '../lib/Validate/Review';
import { X_Review_Rating_Invalid } from '../lib/Validate/Review';

import { assert } from './test-helper';
import { expect } from './test-helper';

describe ("Validate_Review.ensure_valid_review_rating ()", () => {
    it ("should detect undefined value", () => {
		try {
			Validate_Review.ensure_valid_review_rating (undefined);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Review_Rating_Invalid)
			;
		}
	});

    it ("should detect null value", () => {
		try {
			Validate_Review.ensure_valid_review_rating (null);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Review_Rating_Invalid)
			;
		}
	});

    it ("should detect string value (not a number)", () => {
		try {
			Validate_Review.ensure_valid_review_rating ("xx");
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Review_Rating_Invalid)
			;
			expect (err)
				.to.have.own.property ("rating")
				.and.equal ("xx")
			;
		}
	});

    it ("should detect float number", () => {
		try {
			Validate_Review.ensure_valid_review_rating (1.1);
			assert.fail ("Expected to die but it lives");
		} catch (err) {
			expect (err)
				.to.be.an.instanceof (X_Review_Rating_Invalid)
			;
			expect (err)
				.to.have.own.property ("rating")
				.and.equal (1.1)
			;
		}
	});

    it ("should detect valid numeric review", () => {
		try {
			Validate_Review.ensure_valid_review_rating (5);
			assert (1, "should recognize numeric review");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});

    it ("should detect valid stringy review", () => {
		try {
			Validate_Review.ensure_valid_review_rating ("0");
			assert (1, "should recognize stringy review");
		} catch (err) {
			assert.fail (`should live but died with: ${ err }`);
		}
	});
});
