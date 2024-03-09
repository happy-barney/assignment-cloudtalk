
import { Tainted  } from '../types';
import { Validate } from '../Validate';

export class Validate_Review {
	static ensure_valid_public_id (value: Tainted) {
		Validate._ensure_valid_public_id (X_Review_ID_Invalid, value);
	}

	static ensure_valid_review_first_name (value: Tainted) {
		Validate._ensure_valid_name (X_Review_First_Name_Invalid, value);
	}

	static ensure_valid_review_last_name (value: Tainted) {
		Validate._ensure_valid_name (X_Review_Last_Name_Invalid, value);
	}

	static ensure_valid_review_comment (value: Tainted) {
		Validate._ensure_valid_string (X_Review_Comment_Invalid, value);
	}

	static ensure_valid_review_rating (value: Tainted) {
		const review = Number.parseFloat (value);

		let valid = true;
		valid &&= Number.isInteger (review)
		valid &&= review >= 0;
		valid &&= review <= 5;

		if (! valid)
			throw new X_Review_Rating_Invalid (value);
	}
}

export class X_Review_ID_Invalid extends Error {
	readonly name = "X_Review_ID_Invalid";
	readonly review_id: string;

	constructor (readonly _review_id: string) {
		super(`Invalid review ID: ${ _review_id }`);
		this.review_id = _review_id;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Review_First_Name_Invalid extends Error {
	readonly name = "X_Review_First_Name_Invalid";
	readonly first_name: string;
	readonly min_length: number;

	constructor (readonly _first_name: string, readonly _min_length: number) {
		super(`Invalid review_first name: '${ _first_name }`);
		this.first_name = _first_name;
		this.min_length   = _min_length;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Review_Last_Name_Invalid extends Error {
	readonly name = "X_Review_Last_Name_Invalid";
	readonly last_name: string;
	readonly min_length: number;

	constructor (readonly _last_name: string, readonly _min_length: number) {
		super(`Invalid review_last name: '${ _last_name }`);
		this.last_name = _last_name;
		this.min_length   = _min_length;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Review_Comment_Invalid extends Error {
	readonly name = "X_Review_Comment_Invalid";
	readonly review_comment: string;

	constructor (readonly _review_comment: string) {
		super(`Invalid review_last name: '${ _review_comment }`);
		this.review_comment = _review_comment;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Review_Rating_Invalid extends Error {
	readonly price = "X_Review_Rating_Invalid";
	readonly rating: string;

	constructor (readonly _rating: string) {
		super(`Invalid rating: '${ _rating }'. Allowed values are: 0, 1, 2, 3, 4, 5`);
		this.rating = _rating;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

