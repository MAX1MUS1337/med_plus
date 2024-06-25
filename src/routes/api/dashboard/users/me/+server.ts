import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User } from '$lib/server/database/local/models'

import { loginRegex, nameRegex } from '$lib/server/env'

export const POST: RequestHandler = function({ request, locals }) {
    return utils.requestHandler(
        async () => {
            let user = await User.findOne({where: {id: locals.user?.id}})

            if (!user) return utils.sendResponse({
                code: 400,
                error: "Пользователь не найден",
            })

            const requestData = await request.json() as DefaultRequest
            let errors: Record<string, any> = {}

            const login = (requestData.data?.login ?? "" as string)
            const firstName = (requestData.data?.firstName ?? "" as string)
            const lastName = (requestData.data?.lastName ?? "" as string)

            if (!login.match(loginRegex)) errors["login"] = "Логин содержит недопустимые символы"
            if (!firstName.match(nameRegex)) errors["firstName"] = "Содержит недопустимые символы"
            if (!lastName.match(nameRegex)) errors["lastName"] = "Содержит недопустимые символы"

            if (Object.keys(errors).length > 0) return utils.sendResponse({
                code: 400,
                error: errors,
            })
            
            if (login != "") user.Login = login
            if (firstName != "") user.FirstName = firstName
            if (lastName != "") user.LastName = lastName

            await user.save()

            return utils.sendResponse({
                code: 200,
                data: {
                    login: login,
                    firstName: firstName,
                    lastName: lastName,
                }
            })
        }
    )
}

export const fallback = utils.methodNotAllowed