import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'
import { textRegex } from '$lib/server/env'

import { Token } from '$lib/server/database/local/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const skip = url.searchParams.get("skip")
            const limit = url.searchParams.get("limit")

            const count = await Token.count()

            const tokens = await Token.find({
                skip: skip ? Number(skip) : undefined,
                take: limit ? Number(limit) : undefined,
            })

            return utils.sendResponse({
                code: 200,
                data: {
                    tokens: tokens,
                    external: {},
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

            let errors: Record<string, any> = {}

            const data = {
                expires: requestData.data?.Exp ? Number(requestData.data.Exp) : undefined,
                note: requestData.data?.Note ? String(requestData.data.Note) : undefined,
            }

            if (data.expires && (Number.isNaN(data.expires) || data.expires < 0)) errors["Exp"] = "Невалидное зачение"

            if (data.note && !data.note.match(textRegex)) errors["Note"] = "Содержит недопустимые символы"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            if (data.expires) {
                const expires = new Date()
                data.expires = expires.setDate(expires.getDate() + data.expires)
            }

            const token = await Token.new({
                token: await utils.signToken({id: 1, api: true}, data.expires),
                note: data.note ?? "",
                exp: data.expires ?? 0,
            })

            return utils.sendResponse({
                code: 200,
                data: token
            })
        }
    )
}

export const DELETE: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {            
            const id = url.searchParams.get("id")
            
            let token = await Token.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!token) return utils.sendResponse({code: 400, error: "Токен не найден"})

            await token.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed