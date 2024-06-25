import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User } from '$lib/server/database/local/models'

import { dev } from '$app/environment'

import { JWT_EXPIRES_IN } from '$env/static/private'

export const POST: RequestHandler = function({ request, cookies }) {
    return utils.requestHandler(
        async () => {
            const requestData = await request.json() as DefaultRequest

            const user = await User.findOne({
                where: {
                    Login: requestData.data?.login ?? "",
                    Password: requestData.data?.password ?? "",
                }
            })

            if (!user) {
                return utils.sendResponse({
                    code: 400,
                    error: "Неверный логин или пароль"
                })
            }

            const token = await utils.signToken({uid: user.id, userType: "admin"})

            cookies.set("tok", token, {
                path: '/',
                sameSite: 'strict',
                httpOnly: true,
                secure: !dev,
                maxAge: Number(JWT_EXPIRES_IN) * 60 * 60,
            })

            return utils.sendResponse({
                code: 200,
                data: token,
            })
        }
    )
}