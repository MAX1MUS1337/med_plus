import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import { User } from '$lib/server/database/global/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const type = url.searchParams.get("type")

            const patients = await User.find({
                select: {
                    FirstName: true,
                    LastName: true,
                    Patronymic: true,
                    Email: true,
                    Phone: true,
                    Address: true,
                    BirthDate: true,
                },
            })

            const output = patients.map(v => {
                return {
                    FirstName: v.LastName,
                    LastName: v.FirstName,
                    Patronymic: v.Patronymic ?? "",
                    Email: v.Email,
                    Phone: v.Phone,
                    Address: v.Address,
                    BirthDate: v.BirthDate,
                }
            })

            switch (type) {
                case "json":
                    return utils.sendFile({name: "Patients", data: JSON.stringify(output), type: "json"})
                case "csv":
                    return utils.sendFile({name: "Patients", data: utils.encodeCSV(output), type: "csv"})
                default:
                    return utils.sendResponse({code: 400, error: `Unknown type "${type}"`})
            }
        }
    )
}

export const fallback = utils.methodNotAllowed