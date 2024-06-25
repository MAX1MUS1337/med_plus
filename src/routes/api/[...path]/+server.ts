import type { RequestHandler } from "@sveltejs/kit"

import * as utils from "$lib/server/api/utils"

export const fallback: RequestHandler = async function() {
	return utils.sendResponse({code: 404, error: "Страница не найдена"})
}