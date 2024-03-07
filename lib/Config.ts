
export type Config_Database = {
	host:     string;
	user:     string;
	password: string;
};

export type Config = {
	database: Config_Database;
};

export const config : Config = {
	database: {
		host:     "db",
		user:     "assignment",
		password: "db-pwd",
	},
};

