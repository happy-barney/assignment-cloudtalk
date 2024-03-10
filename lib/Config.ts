
export type Config_Database = {
	host:     string;
	user:     string;
	password: string;
};

export type Config_Server = {
	hostname: string;
	port:     number;
};

export type Config = {
	database: Config_Database;
	server:   Config_Server;
};

export const config : Config = {
	database: {
		host:     "db",
		user:     "assignment",
		password: "db-pwd",
	},
	server: {
		hostname: "localhost",
		port: 3000,
	},
};

