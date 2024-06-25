import { type RequestHandler } from '@sveltejs/kit'

import { Not } from "typeorm"

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'
import { loginRegex, nameRegex, passwordRegex } from '$lib/server/env'

import { User, Role } from '$lib/server/database/local/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const skip = url.searchParams.get("skip")
            const limit = url.searchParams.get("limit")

            const count = await User.count()

            const users = await User.find({
                relations: {
                    Role: true,
                },
                select: {
                    id: true,
                    Login: true,
                    FirstName: true,
                    LastName: true,
                    Role: {id: true, Title: true},
                },
                skip: skip ? Number(skip) : undefined,
                take: limit ? Number(limit) : undefined,
            })

            const roles = await Role.find()

            return utils.sendResponse({
                code: 200,
                data: {
                    users: users,
                    external: {
                        Role: roles,
                    },
                    count: count
                },
            })
        }
    )
}

export const POST: RequestHandler = function({ request }) {
    return utils.requestHandler(
        async () => {
            const requestData = await request.json() as DefaultRequest

            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Login", type: "string", requried: true, regex: loginRegex},
                {name: "FirstName", type: "string", regex: nameRegex},
                {name: "LastName", type: "string", regex: nameRegex},
                {name: "Role", type: "number", requried: true},
                {name: "Password", type: "string", requried: true, regex: passwordRegex},
            ])

            if (model.Login && await User.exists({where: {Login: model.Login}})) errors["Login"] = "Логин занят"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            const role = await Role.findOne({
                where: {
                    id: model.Role
                }
            })

            if (!role) return utils.sendResponse({code: 400, error: "Роль не найдена"})

            await User.new({
                login: model.Login,
                password: model.Password!,
                firstName: model.FirstName,
                lastName: model.LastName,
                role: role,
            })

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const PUT: RequestHandler = function({ request, url }) {
    return utils.requestHandler(
        async () => {
            const id = url.searchParams.get("id")
            
            let user = await User.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!user) return utils.sendResponse({code: 400, error: "Пользователь не найден"})

            const requestData = await request.json() as DefaultRequest

            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Login", type: "string", regex: loginRegex},
                {name: "FirstName", type: "string", regex: nameRegex},
                {name: "LastName", type: "string", regex: nameRegex},
                {name: "Role", type: "number"},
                {name: "Password", type: "string", regex: passwordRegex},
            ])

            if (model.Login && await User.exists({where: {Login: model.Login, id: Not(user.id ?? 0)}})) errors["Login"] = "Логин занят"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            if (model.Role) {
                const role = await Role.findOne({
                    where: {
                        id: model.Role
                    }
                })

                if (!role) return utils.sendResponse({code: 400, error: "Роль не найдена"})

                user.Role = role
            }

            if (model.Login) user.Login = model.Login
            if (model.Password) user.Password = model.Password

            user.FirstName = model.FirstName
            user.LastName = model.LastName

            await user.save()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const DELETE: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {            
            const id = url.searchParams.get("id")
            
            let user = await User.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!user) return utils.sendResponse({code: 400, error: "Пользователь не найден"})

            await user.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed