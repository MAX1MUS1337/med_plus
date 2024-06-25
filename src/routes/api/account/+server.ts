import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User, Employee } from '$lib/server/database/global/models'

import { loginRegex, nameRegex } from '$lib/server/env'

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

            const {model: data, errors} = utils.parseRequestModel(requestData.data, [
                {name: "login", type: "string", regex: loginRegex},
                {name: "firstName", type: "string", regex: nameRegex},
                {name: "lastName", type: "string", regex: nameRegex},
                {name: "patronymic", type: "string", regex: nameRegex},
            ])

            if (Object.keys(errors).length > 0) return utils.sendResponse({
                code: 400,
                error: errors,
            })

            if (user) {
                if (data.login && data.login != "") user.Login = data.login
                if (data.firstName && data.firstName != "") user.FirstName = data.firstName
                if (data.lastName && data.lastName != "") user.LastName = data.lastName
                if (data.patronymic && data.patronymic != "") user.Patronymic = data.patronymic

                await user.save()
            }

            if (employee) {
                if (data.login && data.login != "") employee.Login = data.login
                if (data.firstName && data.firstName != "") employee.FirstName = data.firstName
                if (data.lastName && data.lastName != "") employee.LastName = data.lastName
                if (data.patronymic && data.patronymic != "") employee.Patronymic = data.patronymic

                await employee.save()
            }

            return utils.sendResponse({
                code: 200,
                data: {
                    login: data.login,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    patronymic: data.patronymic,
                }
            })
        }
    )
}

export const fallback = utils.methodNotAllowed