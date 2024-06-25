import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import { Offer } from '$lib/server/database/global/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const type = url.searchParams.get("type")

            const offers = await Offer.find({
                select: {
                    Title: true,
                    Description: true,
                    Price: true,
                },
            })

            const output = offers.map(v => {
                return {
                    Title: v.Title,
                    Description: v.Description ?? "",
                    Price: v.Price ?? 0,
                }
            })

            switch (type) {
                case "json":
                    return utils.sendFile({name: "Offers", data: JSON.stringify(output), type: "json"})
                case "csv":
                    return utils.sendFile({name: "Offers", data: utils.encodeCSV(output), type: "csv"})
                default:
                    return utils.sendResponse({code: 400, error: `Unknown type "${type}"`})
            }
        }
    )
}

export const fallback = utils.methodNotAllowed