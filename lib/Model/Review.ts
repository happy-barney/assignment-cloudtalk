
import { Model            } from '../Model';
import { Page_Spec        } from '../types';
import { Paged            } from '../types';
import { Review_Create    } from '../types';
import { Review_Response  } from '../types';
import { Review_Update    } from '../types';
import { Submodel         } from '../Model/Submodel';
import { Validate_Review  } from '../Validate/Review';

type Review_Unique_Column = 'public_id';

const public_columns  = [
	'public_id AS id',
	'product_public_id (product_id) AS product_id',
	'first_name',
	'last_name',
	'comment',
	'rating'
].join (', ')
;

const table_name      = 'review';
const query           = {
	insert: `INSERT INTO
${ table_name } (product_id, first_name, last_name, comment, rating)
VALUES          ($1,         $2,         $3,        $4,     $5)
RETURNING   ${ public_columns }
`,
	count:  `SELECT count(*) AS count FROM ${ table_name } WHERE product_id = $1`,
	delete: `DELETE FROM ${ table_name } WHERE public_id = $1`,
	update: `UPDATE
${ table_name } SET
    first_name       = CASE WHEN $1::boolean THEN $2 ELSE first_name END,
    last_name        = CASE WHEN $3::boolean THEN $4 ELSE last_name  END,
    comment          = CASE WHEN $5::boolean THEN $6 ELSE comment    END,
    rating           = CASE WHEN $7::boolean THEN $8 ELSE rating     END
WHERE
    public_id   = $9
RETURNING ${ public_columns }
`,
	fetch:  `SELECT ${ public_columns } FROM ${ table_name } WHERE public_id = $1`,
	list:   `SELECT ${ public_columns } FROM ${ table_name } WHERE product_id = $1 ORDER BY rating DESC, id`,
};

export class Review extends Submodel {
	constructor (model: Model) {
		super (model);
	}

	async _ensure_valid_product_id (product_id: string) {
		await this.model.product ().ensure_existing_public_id (product_id);
	}

	async create (review: Review_Create) : Promise<Review_Response> {
		Validate_Review.ensure_valid_review_first_name (review.first_name);
		Validate_Review.ensure_valid_review_last_name  (review.last_name);
		Validate_Review.ensure_valid_review_comment    (review.comment);
		Validate_Review.ensure_valid_review_rating     (review.rating);

		const result = await this.query (query.insert, [
			await this.model.product ().raw_id (review.product_id),
			review.first_name,
			review.last_name,
			review.comment,
			review.rating,
		]);

		return result.rows[0];
	}

	async count (raw_id:number) : Promise<number> {
		const result = await this.query (query.count, [ raw_id ]);

		return parseInt (result.rows[0].count);
	}

	async delete (public_id: string) : Promise<void> {
		Validate_Review.ensure_valid_public_id (public_id);

		await this.query (query.delete, [ public_id ]);
	}

	async ensure_existing_public_id (public_id: string) : Promise<void> {
		if (! await this.exists ("public_id", public_id))
			throw new X_Review_ID_Not_Found (public_id);
	}

	async exists (column: Review_Unique_Column, value: string) : Promise<boolean> {
		const result = await this.query (
			`SELECT 1 AS count FROM ${ table_name } WHERE ${ column } = $1`,
			[ value ]
		);

		return result.rows.length > 0;
	}

	async fetch (public_id: string) : Promise<Review_Response> {
		Validate_Review.ensure_valid_public_id (public_id);
		await this.ensure_existing_public_id (public_id);

		const result = await this.query (query.fetch, [ public_id ]);

		return result.rows[0];
	}

	async list (page_spec: Page_Spec, product_id: string) : Promise<Paged<Review_Response[]>> {
		const query_list = query.list + ' ' + this.page_to_limit (page_spec);
		const raw_id     = await this.model.product ().raw_id (product_id);

		return this.paged_result (
			page_spec,
			await this.count(raw_id),
			(await this.query (query_list, [ raw_id ])).rows,
		);
	}

	async update (public_id: string, review: Review_Update) : Promise<Review_Response> {
		Validate_Review.ensure_valid_public_id (public_id);
		await this.ensure_existing_public_id (public_id);

		if (review.first_name !== undefined)
			Validate_Review.ensure_valid_review_first_name (review.first_name);

		if (review.last_name !== undefined)
			Validate_Review.ensure_valid_review_last_name (review.last_name);

		if (review.comment !== undefined)
			Validate_Review.ensure_valid_review_comment (review.comment);

		if (review.rating !== undefined)
			Validate_Review.ensure_valid_review_rating (review.rating);

		const result = await this.query (query.update, [
			review.first_name !== undefined,
			review.first_name,
			review.last_name !== undefined,
			review.last_name,
			review.comment !== undefined,
			review.comment,
			review.rating !== undefined,
			review.rating,
			public_id,
		]);

		return result.rows[0];
	}
}

export class X_Review_ID_Not_Found extends Error {
	readonly name = "X_Review_ID_Not_Found";
	readonly review_id: string;

	constructor (readonly _review_id: string) {
		super(`Review ID '${ _review_id }' isn't available`);
		this.review_id = _review_id;
		Object.setPrototypeOf (this, new.target.prototype);
	}
}
