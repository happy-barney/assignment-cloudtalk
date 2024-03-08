
import { Model            } from '../Model';
import { Page_Spec        } from '../types';
import { Paged            } from '../types';
import { Product_Create   } from '../types';
import { Product_Response } from '../types';
import { Product_Update   } from '../types';
import { Submodel         } from '../Model/Submodel';
import { Validate_Product } from '../Validate/Product';

type Product_Unique_Column = 'name' | 'public_id';

const public_columns  = 'public_id AS id, name, description, price';
const table_name      = 'product';

const query = {
	insert: `INSERT INTO
${ table_name } (name, description, price)
VALUES          ($1,   $2,          $3)
RETURNING ${ public_columns }
`,
	count:  `SELECT count(*) AS count FROM ${ table_name }`,
	delete: `DELETE FROM ${ table_name } WHERE public_id = $1`,
	update: `UPDATE
${ table_name } SET
	name        = CASE WHEN $1::boolean THEN $2 ELSE name END,
	description = CASE WHEN $3::boolean THEN $4 ELSE description END,
	price       = CASE WHEN $5::boolean THEN $6 ELSE price END
WHERE
	public_id   = $7
RETURNING ${ public_columns }
`,
	fetch:  `SELECT ${ public_columns } FROM ${ table_name } WHERE public_id = $1`,
	raw_id: `SELECT id FROM ${ table_name } WHERE public_id = $1`,
	list:   `SELECT ${ public_columns } FROM ${ table_name } ORDER BY name`,
};

export class Product extends Submodel {
	constructor (model: Model) {
		super (model);
	}

	async create (product: Product_Create) : Promise<Product_Response> {
		Validate_Product.ensure_valid_product_name  (product.name);
		Validate_Product.ensure_valid_product_price (product.price);

		await this.ensure_name_is_unique (product.name);

		const result = await this.query (query.insert, [
			product.name,
			product.description,
			product.price,
		]);

		return result.rows[0];
	}

	async count () : Promise<number> {
		const result = await this.query (query.count);

		return parseInt (result.rows[0].count);
	}

	async delete (public_id: string) : Promise<void> {
		Validate_Product.ensure_valid_public_id (public_id);

		await this.query (query.delete, [ public_id ]);
	}

	async ensure_name_is_unique (name: string) : Promise<void> {
		if (await this.exists ("name", name))
			throw new X_Product_Name_Already_Exists (name);
	}

	async ensure_existing_public_id (public_id: string) : Promise<void> {
		if (! await this.exists ("public_id", public_id))
			throw new X_Product_ID_Not_Found (public_id);
	}

	async exists (column: Product_Unique_Column, value: string) : Promise<boolean> {
		const result = await this.query (
			`SELECT 1 AS count FROM product WHERE ${ column } = $1`,
			[ value ]
		);

		return result.rows.length > 0;
	}

	async fetch (public_id: string) : Promise<Product_Response> {
		Validate_Product.ensure_valid_public_id (public_id);

		await this.ensure_existing_public_id (public_id);

		const result = await this.query (query.fetch, [ public_id ]);

		return result.rows[0];
	}

	async list (page_spec: Page_Spec) : Promise<Paged<Product_Response[]>> {
		const query_list = query.list + ' ' + this.page_to_limit (page_spec);

		return this.paged_result (
			page_spec,
			await this.count(),
			(await this.query (query_list)).rows,
		);
	}

	async raw_id (public_id: string) : Promise<number> {
		Validate_Product.ensure_valid_public_id (public_id);

		await this.ensure_existing_public_id (public_id);

		const result = await this.query (query.raw_id, [ public_id ]);

		return parseInt (result.rows[0].id);
	}

	async update (public_id: string, product: Product_Update) : Promise<Product_Response> {
		Validate_Product.ensure_valid_public_id (public_id);

		/* eslint-disable  no-prototype-builtins */
		if (product.hasOwnProperty ('name'))
			Validate_Product.ensure_valid_product_name (product.name as string);
		if (product.hasOwnProperty ('price'))
			Validate_Product.ensure_valid_product_price (product.price as number);

		await this.ensure_existing_public_id (public_id);

		const result = await this.query (query.update, [
			product.hasOwnProperty ('name') ? 1 : 0,
			product.name,
			product.hasOwnProperty ('description') ? 1 : 0,
			product.description,
			product.hasOwnProperty ('price') ? 1 : 0,
			product.price,
			public_id,
		]);
		/* eslint-enable  no-prototype-builtins */

		return result.rows[0];
	}
}

export class X_Product_Name_Already_Exists extends Error {
	readonly name = "X_Product_Name_Already_Exists";
	readonly product_name: string;

	constructor (readonly _product_name: string) {
		super(`Product name '${ _product_name }' already exists in the database`);
		this.product_name = _product_name;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}

export class X_Product_ID_Not_Found extends Error {
	readonly name = "X_Product_ID_Not_Found";
	readonly product_id: string;

	constructor (readonly _product_id: string) {
		super(`Product ID '${ _product_id }' not found`);
		this.product_id = _product_id;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}
