import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { User } from '$lib/server/database/local/models'

import { User as Patient, Employee } from '$lib/server/database/global/models'

import { dev } from '$app/environment'

import { JWT_EXPIRES_IN } from '$env/static/private'

export const POST: RequestHandler = function({ request, cookies }) {
    return utils.requestHandler(
        async () => {
            const requestData = await request.json() as DefaultRequest

            const admin = await User.findOne({
                where: {
                    Login: requestData.data?.login ?? "",
                    Password: requestData.data?.password ?? "",
                }
            })

            const employee = await Employee.findOne({
                where: {
                    Login: requestData.data?.login ?? "",
                    Password: requestData.data?.password ?? "",
                }
            })

            const patient = await Patient.findOne({
                where: {
                    Login: requestData.data?.login ?? "",
                    Password: requestData.data?.password ?? "",
                }
            })

            if (!admin && !employee && !patient) {
                return utils.sendResponse({
                    code: 400,
                    error: "Неверный логин или пароль"
                })
            }

            let token: string = ""

            if (admin) token = await utils.signToken({uid: admin.id, userType: "admin"})
            if (employee) token = await utils.signToken({uid: employee.id, userType: "employee"})
            if (patient) token = await utils.signToken({uid: patient.id, userType: "user"})

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