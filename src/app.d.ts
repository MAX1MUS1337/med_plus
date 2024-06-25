// See https://kit.svelte.dev/docs/types#app

import type { User as localUser } from "./lib/server/database/local/models"
import type { User, Employee } from "./lib/server/database/global/models"

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: User | localUser | Employee | null,
			token: string | null,
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
