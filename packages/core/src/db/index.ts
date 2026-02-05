import { Database } from "bun:sqlite";
import { DB_PATH, ensureDataDir } from "../config.ts";
import { initSchema } from "./schema.ts";

let _db: Database | null = null;

export function getDb(): Database {
	if (!_db) {
		ensureDataDir();
		_db = new Database(DB_PATH);
		initSchema(_db);
	}
	return _db;
}
