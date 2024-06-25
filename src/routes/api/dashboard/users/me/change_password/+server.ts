import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User } from '$lib/server/database/local/models'

import { passwordRegex } from '$lib/server/env'

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

            const oldPassword = (requestData.data?.old ?? "" as string)
            const newPassword = (requestData.data?.new ?? "" as string)

            if (oldPassword != user.Password) errors["old"] = "Неверный пароль"
            if (newPassword == user.Password) errors["new"] = "Новый пароль совпадает со старым"

            if (oldPassword == "") errors["old"] = "Пароль пустой"
            if (newPassword == "") errors["new"] = "Пароль пустой"

            if (!oldPassword.match(passwordRegex)) errors["old"] = "Пароль содержит недопустимые символы"
            if (!newPassword.match(passwordRegex)) errors["new"] = "Пароль содержит недопустимые символы"

            if (Object.keys(errors).length > 0) return utils.sendResponse({
                code: 400,
                error: errors,
            })

            user.Password = newPassword

            await user.save()

            return utils.sendResponse({
                code: 200,
                data: "Пароль успешно изменён."
            })
        }
    )
}

export const fallback = utils.methodNotAllowed