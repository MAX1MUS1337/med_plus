import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import { Employee } from '$lib/server/database/global/models'

export const GET: RequestHandler = function() {
    return utils.requestHandler(
        async () => {
            const specifications = await Employee.find({
                select: {
                    Specification: true,
                },
            })

            return utils.sendResponse({
                code: 200,
                data: specifications.map(v => v.Specification),
            })
        }
    )
}

export const fallback = utils.methodNotAllowed