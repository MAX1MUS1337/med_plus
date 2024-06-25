import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import { User } from '$lib/server/database/global/models'

export const GET: RequestHandler = function({ locals }) {
    return utils.requestHandler(
        async () => {
            if (!locals.user) return utils.sendResponse({code: 401, error: "Невалидная сессия"})
            
            if (!(locals.user instanceof User)) return utils.sendResponse({code: 403, error: "Невалидная сессия"})

            return utils.sendResponse({
                code: 200,
                data: {
                    id: locals.user.id,
                    login: locals.user.Login,
                    name: locals.user.FirstName,
                    surname: locals.user.LastName,
                    patronymic: locals.user.Patronymic,
                    email: locals.user.Email,
                    phone: locals.user.Phone,
                },
            })
        }
    )
}

export const fallback = utils.methodNotAllowed