import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import { Employee } from '$lib/server/database/global/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const type = url.searchParams.get("type")

            const employees = await Employee.find({
                relations: {
                    Role: true,
                },
                select: {
                    FirstName: true,
                    LastName: true,
                    Patronymic: true,
                    About: true,
                    Specification: true,
                    Email: true,
                    Phone: true,
                    Role: {Title: true},
                },
            })

            const output = employees.map(v => {
                return {
                    LastName: v.LastName,
                    FisrtName: v.FirstName,
                    Patronymic: v.Patronymic ?? "",
                    Phone: v.Phone,
                    Email: v.Email,
                    Role: v.Role?.Title ?? "",
                    Specification: v.Specification ?? ""
                }
            })

            switch (type) {
                case "json":
                    return utils.sendFile({name: "Employees", data: JSON.stringify(output), type: "json"})
                case "csv":
                    return utils.sendFile({name: "Employees", data: utils.encodeCSV(output), type: "csv"})
                default:
                    return utils.sendResponse({code: 400, error: `Unknown type "${type}"`})
            }
        }
    )
}

export const fallback = utils.methodNotAllowed