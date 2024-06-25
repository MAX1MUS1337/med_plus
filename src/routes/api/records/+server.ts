import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'

import { Employee, Offer, Record, RecordState, ScheduleItem, User } from '$lib/server/database/global/models'

import { EmployeeRole } from '$lib/server/env'

import { MoreThanOrEqual, LessThanOrEqual, MoreThan, LessThan, And, FindOperator } from 'typeorm'
import { createHash, randomInt } from 'crypto'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const doctor = Number(url.searchParams.get("doctor") ?? "0")
            let date = new Date(url.searchParams.get("start") ?? "")

            let selectedDoctor = await Employee.findOne({where: {id: doctor, Role: {id: EmployeeRole.Doctor}}})

            if (date.toString() == "Invalid Date") date = new Date()

            const records = await Record.find({
                relations: {
                    Employee: true,
                    Offer: true,
                    User: true,
                },
                select: {
                    id: true,
                    Date: true,
                    Employee: {
                        id: true,
                        FirstName: true,
                        LastName: true,
                        Patronymic: true,
                        Specification: true
                    },
                    Offer: {
                        id: true,
                        Title: true,
                    },
                    User: {
                        id: true,
                        Login: true,
                        BirthDate: true,
                        FirstName: true,
                        LastName: true,
                        Patronymic: true,
                    }
                },
                where: {
                    Employee: selectedDoctor ?? undefined,
                    Date: date,
                }
            })

            return utils.sendResponse({
                code: 200,
                data: records,
            })
        }
    )
}

export const POST: RequestHandler = function({ request }) {
    return utils.requestHandler(
        async () => {
            const requestData = await request.json() as DefaultRequest

            let { model, errors } = utils.parseRequestModel(requestData.data, [
                {name: "Doctor", type: "number", requried: true},
                {name: "Offer", type: "number", requried: true},
                {name: "Date", type: "date", requried: true},
                {name: "Time", type: "string", requried: true},
                {name: "Patient", type: "number"},
                {name: "Name", type: "string"},
                {name: "Lastname", type: "string"},
                {name: "Patronymic", type: "string"},
                {name: "Phone", type: "string"},
                {name: "Email", type: "string"},
            ])

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            let selectedDoctor = await Employee.findOne({where: {id: model["Doctor"], Role: {id: EmployeeRole.Doctor}}})
            if (selectedDoctor == null) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let selectedOffer = await Offer.findOne({where: {id: model["Doctor"]}})
            if (selectedOffer == null) return utils.sendResponse({code: 400, error: "Услуга не найдена"})

            let user: User | null = null

            if (model["Patient"]) {
                user = await User.findOne({
                    select: {
                        id: true,
                        FirstName: true,
                        LastName: true,
                        Patronymic: true,
                        Phone: true,
                        Email: true,
                    },
                    where: {
                        id: model["Patient"]
                    }
                })
            } else {
                let { model: requiredModel, errors } = utils.parseRequestModel(model, [
                    {name: "Name", type: "string"},
                    {name: "Lastname", type: "string", requried: true},
                    {name: "Patronymic", type: "string"},
                    {name: "Phone", type: "string", requried: true},
                    {name: "Email", type: "string", requried: true},
                ])

                if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

                user = await User.new({
                    login: `patient_${await User.count()}`,
                    password: createHash("sha512").update(randomInt(1, 10001).toString()).digest("hex").substring(0, 20),
                    firstName: requiredModel["Firstname"],
                    lastName: requiredModel["Lastname"],
                    patronymic: requiredModel["Patronymic"],
                    phone: requiredModel["Phone"],
                    email: requiredModel["Email"],
                    birthDate: new Date(1970, 0, 1, 0, 0, 0, 0),
                    address: "",
                })
            }

            if (user == null) return utils.sendResponse({code: 400, error: "Пользователь не найден"})

            const state = await RecordState.findOne({ where: { id: 1 } })

            if (state == null) return utils.sendResponse({code: 500, error: "Изначальное состояние не найдено в базе данных"})

            const existingRecords = await Record.count({
                where: {
                    Date: model["Date"],
                    Time: model["Time"],
                    Employee: selectedDoctor,
                }
            })

            if (existingRecords != 0) return utils.sendResponse({code: 400, error: "Запись занята"})

            await Record.new({
                date: model["Date"],
                time: model["Time"],
                user: user,
                employee: selectedDoctor,
                offer: selectedOffer,
                state: state,
            })

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed