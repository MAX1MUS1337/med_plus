import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'
import { loginRegex, nameRegex, passwordRegex, specificationRegex, textRegex, emailRegex } from '$lib/server/env'

import { User } from '$lib/server/database/global/models'
import { Not } from 'typeorm'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const skip = url.searchParams.get("skip")
            const limit = url.searchParams.get("limit")

            const count = await User.count()

            const patients = await User.find({
                select: {
                    id: true,
                    Login: true,
                    FirstName: true,
                    LastName: true,
                    Patronymic: true,
                    Email: true,
                    Phone: true,
                    BirthDate: true,
                    Address: true,
                },
                skip: skip ? Number(skip) : undefined,
                take: limit ? Number(limit) : undefined,
            })

            return utils.sendResponse({
                code: 200,
                data: {
                    patients: patients,
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

            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Login", type: "string", requried: true, regex: loginRegex},
                {name: "FirstName", type: "string", requried: true, regex: nameRegex},
                {name: "LastName", type: "string", requried: true, regex: nameRegex},
                {name: "Patronymic", type: "string", regex: nameRegex},
                {name: "Address", type: "string", regex: textRegex},
                {name: "Email", type: "string", requried: true, regex: emailRegex, regexFailedText: "Невалидное значение"},
                {name: "Phone", type: "string", requried: true},
                {name: "BirthDate", type: "date", requried: true},
                {name: "Password", type: "string", requried: true, regex: passwordRegex},
            ])

            if (model.Login && await User.exists({where: {Login: model.Login}})) errors["Login"] = "Логин занят"

            if (model.Email && await User.exists({where: {Email: model.Email}})) errors["Email"] = "Почта уже используется"
            if (model.Phone && await User.exists({where: {Phone: model.Phone}})) errors["Phone"] = "Номер телефона уже используется"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            await User.new({
                login: model.Login,
                password: model.Password,
                firstName: model.FirstName,
                lastName: model.LastName,
                patronymic: model.Patronymic,
                address: model.Address,
                birthDate: model.BirthDate,
                email: model.Email,
                phone: model.Phone,
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
            
            let user = await User.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!user) return utils.sendResponse({code: 400, error: "Пациент не найден"})

            const requestData = await request.json() as DefaultRequest
            

            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Login", type: "string", regex: loginRegex},
                {name: "FirstName", type: "string", regex: nameRegex},
                {name: "LastName", type: "string", regex: nameRegex},
                {name: "Patronymic", type: "string", regex: nameRegex},
                {name: "Address", type: "string", regex: textRegex},
                {name: "Email", type: "string", regex: emailRegex, regexFailedText: "Невалидное значение"},
                {name: "Phone", type: "string"},
                {name: "BirthDate", type: "date"},
                {name: "Password", type: "string", regex: passwordRegex},
            ])

            if (model.Login && await User.exists({where: {Login: model.Login, id: Not(user.id ?? 0)}})) errors["Login"] = "Логин занят"

            if (model.Email && await User.exists({where: {Email: model.Email, id: Not(user.id ?? 0)}})) errors["Email"] = "Почта уже используется"
            if (model.Phone && await User.exists({where: {Phone: model.Phone, id: Not(user.id ?? 0)}})) errors["Phone"] = "Номер телефона уже используется"

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            if (model.Login) user.Login = model.Login
            if (model.FirstName) user.FirstName = model.FirstName
            if (model.LastName) user.LastName = model.LastName
            if (model.Email) user.Email = model.Email
            if (model.Phone) user.Phone = model.Phone
            if (model.Password) user.Password = model.Password
            if (model.Address) user.Address = model.Address
            if (model.BirthDate) user.BirthDate = model.BirthDate

            user.Patronymic = model.Patronymic

            await user.save()

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
            
            let user = await User.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!user) return utils.sendResponse({code: 400, error: "Пациент не найден"})

            await user.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed