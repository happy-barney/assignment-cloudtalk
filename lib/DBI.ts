
import {
	Pool,
	PoolClient as DBI_Client,
	QueryResultRow as DBI_Row
} from "pg";

import type { Config_Database } from "./Config";

export {
	QueryResultRow as DBI_Row,
	PoolClient as DBI_Client
} from "pg";

let singleton_pool: Pool;

export abstract class DBI {
	_client: DBI_Client;

	constructor(client: DBI_Client) {
		this._client = client;
	}

	static initialize (config: Config_Database) : void {
		singleton_pool ||= new Pool ({ ...config });
	}

	static async connect () : Promise<DBI_Client> {
		return await singleton_pool.connect ();
	}

	async begin_work () : Promise<void> {
		await this._client.query ("BEGIN");
	}

	async commit () : Promise<void> {
		await this._client.query ("COMMIT");
	}

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	async query (query: string, binds?: any[] | undefined) : Promise<DBI_Row> {
	/* eslint-enable  @typescript-eslint/no-explicit-any */
		return await this._client.query (query, binds);
	}

	async rollback () : Promise<void> {
		await this._client.query ("ROLLBACK");
	}

	async terminate () : Promise<void> {
		this._client.release (true);
	}

	async transaction<T> (callback: (dbh: DBI) => Promise<T>) : Promise<T> {
		let result: T;

		try {
			await this.begin_work ();

			result = await callback (this);

			await this.commit ();
		} catch (err) {
			await this.rollback ();

			throw err;
		}

		return result;
	}
}

