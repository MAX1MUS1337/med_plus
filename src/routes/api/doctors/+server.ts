import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import { EmployeeRole } from '$lib/server/env'

import { Employee } from '$lib/server/database/global/models'

export const GET: RequestHandler = function() {
    return utils.requestHandler(
        async () => {
            const doctors = await Employee.find({
                select: {
                    id: true,
                    FirstName: true,
                    LastName: true,
                    Patronymic: true,
                    Specification: true,
                },
                where: {
                    Role: {id: EmployeeRole.Doctor}
                }
            })

            return utils.sendResponse({
                code: 200,
                data: {
                    list: doctors,
                    count: doctors.length
                },
            })
        }
    )
}

export const fallback = utils.methodNotAllowed