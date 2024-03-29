
import { DBI              } from '../lib/DBI';
import { Model            } from '../lib/Model';
import { Product_Update   } from '../lib/types';
import { Product_Response } from '../lib/types';
import { Review_Update    } from '../lib/types';
import { Review_Response  } from '../lib/types';
import { config           } from '../lib/Config';

export { assert } from 'chai';
export { expect } from 'chai';

export const valid_uuid   = "00000000-0000-4000-8000-000000000000";
export const invalid_uuid = "00000000-0000-0000-0000-000000000000";

export function isolated_db_context (
	callback: (model: Model) => Promise<void>
)
: () => Promise<void>
{
	return async () => {
		await DBI.initialize (config.database);
		const model = await Model.instance ();

		await model.begin_work ();

		try {
			await callback (model);
		} finally {
			await model.rollback ();
			await model.terminate ();
		}
	};
}

let product_randomizer = 1 + Math.random ();
export async function arrange_product (model: Model, product?: Product_Update) : Promise<Product_Response> {
	const result = await model.product ().create ({
		name:        product?.name || `product ${ Number (product_randomizer ++).toString (36) }`,
		description: product?.description,
		price:       product?.price || 1,
	});

	return result;
}

export async function arrange_review (model: Model, review?: Review_Update) : Promise<Review_Response> {
	const result = await model.review ().create ({
		product_id: review?.product_id || (await arrange_product (model)).id,
		first_name: review?.first_name || "First name",
		last_name:  review?.last_name  || "Last name",
		comment:    review?.comment    || "Comment",
		rating:     review?.rating     || 0,
	});

	return result;
}
