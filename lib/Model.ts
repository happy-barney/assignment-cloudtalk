
import { DBI         } from './DBI';
import { DBI_Client  } from './DBI';
import { Page_Result } from './types';
import { Page_Spec   } from './types';
import { Paged       } from './types';

export class Model extends DBI {
	constructor(client: DBI_Client) {
		super (client);
	}

	static async instance () : Promise<Model> {
		return new Model (await DBI.connect ());
	}

	page_to_limit (page_spec: Page_Spec) : string {
		const offset = page_spec.page * page_spec.size;

		return `LIMIT ${ page_spec.size } OFFSET ${ offset }`;
	}

	paged_result<T> (page_spec: Page_Spec, count: number, result: T) : Paged<T> {
		const page_info : Page_Result = {
			size:  page_spec.size,
			pages: Math.ceil (count / page_spec.size),
		};

		if (page_spec.page > 0)
			page_info.previous = page_spec.page - 1;

		if (page_spec.page < page_info.pages - 1)
			page_info.next = page_spec.page + 1;

		return { page_info, result };
	}
}
