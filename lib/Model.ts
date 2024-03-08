
import { DBI         } from './DBI';
import { DBI_Client  } from './DBI';
import { Product     } from './Model/Product';

export class Model extends DBI {
	_product: Product | null = null;

	constructor(client: DBI_Client) {
		super (client);
	}

	static async instance () : Promise<Model> {
		return new Model (await DBI.connect ());
	}

	product () : Product {
		return this._product ||= new Product (this);
	}
}
