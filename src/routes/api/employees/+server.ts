import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'
import { loginRegex, nameRegex, passwordRegex, specificationRegex, textRegex, emailRegex } from '$lib/server/env'

import { Employee, Role } from '$lib/server/database/global/models'
import { Not } from 'typeorm'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const skip = url.searchParams.get("skip")
            const limit = url.searchParams.get("limit")

            const count = await Employee.count()

            const employees = await Employee.find({
                relations: {
                    Role: true,
                },
                select: {
                    id: true,
                    Login: true,
                    FirstName: true,
                    LastName: true,
                    Patronymic: true,
                    About: true,
                    Specification: true,
                    Email: true,
                    Phone: true,
                    Role: {id: true, Title: true},
                },
                skip: skip ? Number(skip) : undefined,
                take: limit ? Number(limit) : undefined,
            })

            const roles = await Role.find()

            return utils.sendResponse({
                code: 200,
                data: {
                    employees: employees,
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
                {name: "FirstName", type: "string", requried: true, regex: nameRegex},
                {name: "LastName", type: "string", requried: true, regex: nameRegex},
                {name: "Patronymic", type: "string", regex: nameRegex},
                {name: "Specification", type: "string", regex: specificationRegex},
                {name: "About", type: "string", regex: textRegex},
                {name: "Email", type: "string", requried: true, regex: emailRegex, regexFailedText: "Невалидное значение"},
                {name: "Phone", type: "string", requried: true},
                {name: "Role", type: "number", requried: true},
                {name: "Password", type: "string", requried: true, regex: passwordRegex},
            ])

            if (model.Login && await Employee.exists({where: {Login: model.Login}})) errors["Login"] = "Логин занят"

            if (model.Email && await Employee.exists({where: {Email: model.Email}})) errors["Email"] = "Почта уже используется"
            if (model.Phone && await Employee.exists({where: {Phone: model.Phone}})) errors["Phone"] = "Номер телефона уже используется"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            const role = await Role.findOne({
                where: {
                    id: model.Role
                }
            })

            if (!role) return utils.sendResponse({code: 400, error: "Роль не найдена"})

            await Employee.new({
                login: model.Login,
                password: model.Password,
                firstName: model.FirstName,
                lastName: model.LastName,
                patronymic: model.Patronymic,
                about: model.About,
                specification: model.Specification,
                email: model.Email,
                phone: model.Phone,
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
            
            let employee = await Employee.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!employee) return utils.sendResponse({code: 400, error: "Сотрудник не найден"})

            const requestData = await request.json() as DefaultRequest
            

            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Login", type: "string", regex: loginRegex},
                {name: "FirstName", type: "string", regex: nameRegex},
                {name: "LastName", type: "string", regex: nameRegex},
                {name: "Patronymic", type: "string", regex: nameRegex},
                {name: "Specification", type: "string", regex: specificationRegex},
                {name: "About", type: "string", regex: textRegex},
                {name: "Email", type: "string", regex: emailRegex, regexFailedText: "Невалидное значение"},
                {name: "Phone", type: "string"},
                {name: "Role", type: "number"},
                {name: "Password", type: "string", regex: passwordRegex},
            ])

            if (model.Login && await Employee.exists({where: {Login: model.Login, id: Not(employee.id ?? 0)}})) errors["Login"] = "Логин занят"

            if (model.Email && await Employee.exists({where: {Email: model.Email, id: Not(employee.id ?? 0)}})) errors["Email"] = "Почта уже используется"
            if (model.Phone && await Employee.exists({where: {Phone: model.Phone, id: Not(employee.id ?? 0)}})) errors["Phone"] = "Номер телефона уже используется"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            if (model.Role) {
                const role = await Role.findOne({
                    where: {
                        id: model.Role
                    }
                })

                if (!role) return utils.sendResponse({code: 400, error: "Роль не найдена"})

                employee.Role = role
            }

            if (model.Login) employee.Login = model.Login
            if (model.FirstName) employee.FirstName = model.FirstName
            if (model.LastName) employee.LastName = model.LastName
            if (model.Email) employee.Email = model.Email
            if (model.Phone) employee.Phone = model.Phone
            if (model.Password) employee.Password = model.Password

            employee.About = model.About
            employee.Specification = model.Specification
            employee.Patronymic = model.Patronymic

            await employee.save()

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
            
            let employee = await Employee.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!employee) return utils.sendResponse({code: 400, error: "Сотрудник не найден"})

            await employee.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed