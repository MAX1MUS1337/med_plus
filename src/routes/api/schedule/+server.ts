import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { Employee, ScheduleItem } from '$lib/server/database/global/models'

import { EmployeeRole } from '$lib/server/env'

import { MoreThanOrEqual, LessThanOrEqual, MoreThan, LessThan, And, FindOperator } from 'typeorm'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const doctor = Number(url.searchParams.get("doctor") ?? "0")
            const start = new Date(url.searchParams.get("start") ?? "")
            const end = new Date(url.searchParams.get("end") ?? "")

            if (doctor == 0) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let selectedDoctor = await Employee.findOne({where: {id: doctor, Role: {id: EmployeeRole.Doctor}}})
            if (selectedDoctor == null) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let findOperators: FindOperator<Date>[] = []

            if (start.toString() != "Invalid Date") findOperators.push(MoreThanOrEqual(start))
            if (end.toString() != "Invalid Date") findOperators.push(LessThanOrEqual(end))

            const schedule = await ScheduleItem.find({
                select: {
                    id: true,
                    Date: true,
                    Start: true,
                    End: true,
                    Timespan: true,
                    Capacity: true,
                    Employee: {
                        id: true,
                        FirstName: true,
                        LastName: true,
                        Patronymic: true
                    },
                },
                where: {
                    Employee: selectedDoctor,
                    Date: And(...findOperators),
                },
            })

            return utils.sendResponse({
                code: 200,
                data: {
                    items: schedule,
                },
            })
        }
    )
}

export const POST: RequestHandler = function({ request }) {
    return utils.requestHandler(
        async () => {
            const requestData = await request.json() as DefaultRequest

            const items: Record<string, any>[] = requestData.data.items

            for (var i in items) {
                const item = items[i]

                let { model, errors } = utils.parseRequestModel(item, [
                    {name: "Doctor", type: "number", requried: true},
                    {name: "Date", type: "date", requried: true},
                    {name: "Start", type: "string", requried: true},
                    {name: "End", type: "string", requried: true},
                    {name: "Timespan", type: "number"},
                    {name: "Capacity", type: "number"},
                ])
    
                if (Object.keys(errors).length > 0) {
                    errors["index"] = i
                    return utils.sendResponse({code: 400, error: errors})
                }

                const intersection = await ScheduleItem.count({
                    where: [
                        {Employee: model["Doctor"], Start: MoreThan(model["Start"]), End: LessThan(model["Start"])},
                        {Employee: model["Doctor"], Start: MoreThan(model["End"]), End: LessThan(model["End"])}
                    ]
                })
                if (intersection > 0) {
                    errors["index"] = i
                    errors["description"] = "Даты пересекаются"
                    return utils.sendResponse({code: 400, error: errors})
                }

                await ScheduleItem.new({
                    date: model["Date"],
                    start: model["Start"],
                    end: model["End"],
                    employee: model["Doctor"],
                    timespan: model["Timespan"] ?? undefined,
                    capacity: model["Capacity"] ?? undefined
                })
            }

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const PUT: RequestHandler = function({ request, url }) {
    return utils.requestHandler(
        async () => {
            const doctor = Number(url.searchParams.get("doctor") ?? "0")
            const start = new Date(url.searchParams.get("start") ?? "")
            const end = new Date(url.searchParams.get("end") ?? "")

            if (doctor == 0) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let selectedDoctor = await Employee.findOne({where: {id: doctor, Role: {id: EmployeeRole.Doctor}}})
            if (selectedDoctor == null) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let findOperators: FindOperator<Date>[] = []

            if (start.toString() != "Invalid Date") findOperators.push(MoreThanOrEqual(start))
            if (end.toString() != "Invalid Date") findOperators.push(LessThanOrEqual(end))

            const requestData = await request.json() as DefaultRequest
            const items: Record<string, any>[] = requestData.data.items

            for (var i in items) {
                const item = items[i]

                let { model, errors } = utils.parseRequestModel(item, [
                    {name: "id", type: "number", requried: true},
                    {name: "Start", type: "string", requried: true},
                    {name: "End", type: "string", requried: true},
                    {name: "Timespan", type: "number"},
                    {name: "Capacity", type: "number"},
                ])
    
                if (Object.keys(errors).length > 0) {
                    errors["index"] = i
                    return utils.sendResponse({code: 400, error: errors})
                }

                let selectedItems = await ScheduleItem.find({
                    select: {
                        id: true,
                        Date: true,
                        Start: true,
                        End: true,
                        Timespan: true,
                        Capacity: true,
                        Employee: {
                            id: true
                        },
                    },
                    where: {
                        Employee: selectedDoctor,
                        Date: And(...findOperators),
                    }
                })

                if (selectedItems.length == 0) return utils.sendResponse({code: 400, error: "Расписание не найдено"})

                const intersection = await ScheduleItem.count({
                    where: [
                        {Employee: selectedDoctor, Start: MoreThan(model["Start"]), End: LessThan(model["Start"])},
                        {Employee: selectedDoctor, Start: MoreThan(model["End"]), End: LessThan(model["End"])}
                    ]
                })
                if (intersection > 0) {
                    errors["index"] = i
                    errors["description"] = "Даты пересекаются"
                    return utils.sendResponse({code: 400, error: errors})
                }

                for (var i in selectedItems) {
                    var selectedItem = selectedItems[i]

                    selectedItem.Start = model["Start"]
                    selectedItem.End = model["End"]
                    if (model["Timespan"]) selectedItem.Timespan = model["Timespan"]
                    if (model["Capacity"]) selectedItem.Capacity = model["Capacity"]

                    await selectedItem.save()
                }
            }

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
            
            let item = await ScheduleItem.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!item) return utils.sendResponse({code: 400, error: "Расписание не найдено"})

            await item.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed