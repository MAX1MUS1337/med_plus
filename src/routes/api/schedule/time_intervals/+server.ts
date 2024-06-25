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
            const date = new Date(url.searchParams.get("date") ?? "")

            if (doctor == 0) return utils.sendResponse({code: 400, error: "Врач не найден"})

            let selectedDoctor = await Employee.findOne({where: {id: doctor, Role: {id: EmployeeRole.Doctor}}})
            if (selectedDoctor == null) return utils.sendResponse({code: 400, error: "Врач не найден"})

            const schedule = await ScheduleItem.find({
                select: {
                    Start: true,
                    End: true,
                    Timespan: true,
                    Capacity: true,
                },
                where: {
                    Employee: selectedDoctor,
                    Date: date,
                },
            })

            let timeIntervals: string[] = []

            schedule.forEach(item => {
                var start = new Date(`1970-01-01 ${item.Start}`)
                var end = new Date(`1970-01-01 ${item.End}`)
                for (; start <= end; start.setMinutes(start.getMinutes() + (item.Timespan ?? 30))) timeIntervals.push(start.toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"}))
            })

            return utils.sendResponse({
                code: 200,
                data: timeIntervals,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed