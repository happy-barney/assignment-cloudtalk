
import { Validate } from '../Validate';
import { Tainted  } from '../types';

export class Validate_Product {
	static ensure_valid_public_id (value: Tainted) {
		Validate._ensure_valid_public_id (X_Product_ID_Invalid, value);
	}

	static ensure_valid_product_name (value: Tainted) {
		Validate._ensure_valid_name (X_Product_Name_Invalid, value, 3);
	}

	static ensure_valid_product_price (value: Tainted) {
		const price = Number.parseFloat (value);

		let valid = true;
		valid &&= ! Number.isNaN (price);
		valid &&= price > 0.0;

		if (! valid)
			throw new X_Product_Price_Invalid (value);
	}

}

export class X_Product_ID_Invalid extends Error {
	readonly name = "X_Product_ID_Invalid";
	readonly product_id: string;

	constructor (readonly _product_id: string) {
		super(`Invalid product ID: ${ _product_id }`);
		this.product_id = _product_id;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Product_Name_Invalid extends Error {
	readonly name = "X_Product_Name_Invalid";
	readonly product_name: string;
	readonly min_length: number;

	constructor (readonly _product_name: string, readonly _min_length: number) {
		super(`Invalid product name: '${ _product_name }`);
		this.product_name = _product_name;
		this.min_length   = _min_length;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Product_Price_Invalid extends Error {
	readonly price = "X_Product_Price_Invalid";
	readonly product_price: string;

	constructor (readonly _product_price: string) {
		super(`Invalid product price: '${ _product_price }`);
		this.product_price = _product_price;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

