import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User, Employee } from '$lib/server/database/global/models'

import { passwordRegex } from '$lib/server/env'

export const POST: RequestHandler = function({ request, locals }) {
    return utils.requestHandler(
        async () => {
            let user = await User.findOne({where: {id: locals.user?.id}})
            let employee = await Employee.findOne({where: {id: locals.user?.id}})

            if (!user && !employee) return utils.sendResponse({
                code: 400,
                error: "Пользователь не найден",
            })

            const requestData = await request.json() as DefaultRequest

            let {model: data, errors} = utils.parseRequestModel(requestData.data, [
                {name: "old", type: "string", requried: true, regex: passwordRegex},
                {name: "new", type: "string", requried: true, regex: passwordRegex},
            ])

            if ((user && data.old != user.Password) || (employee && data.old != employee.Password)) errors["old"] = "Неверный пароль"
            if ((user && data.new == user.Password) ||(employee && data.new == employee.Password)) errors["new"] = "Новый пароль совпадает со старым"

            if (Object.keys(errors).length > 0) return utils.sendResponse({
                code: 400,
                error: errors,
            })

            if (user) {
                user.Password = data.new
                await user.save()
            }

            if (employee) {
                employee.Password = data.new
                employee.save()
            }

            return utils.sendResponse({
                code: 200,
                data: "Пароль успешно изменён."
            })
        }
    )
}

export const fallback = utils.methodNotAllowed