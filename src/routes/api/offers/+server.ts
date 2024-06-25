import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'
import {type DefaultRequest } from '$lib/server/api/types'
import { loginRegex, nameRegex, passwordRegex, specificationRegex, textRegex } from '$lib/server/env'

import { Offer } from '$lib/server/database/global/models'

export const GET: RequestHandler = function({ url }) {
    return utils.requestHandler(
        async () => {
            const skip = url.searchParams.get("skip")
            const limit = url.searchParams.get("limit")

            const count = await Offer.count()

            const offers = await Offer.find({
                skip: skip ? Number(skip) : undefined,
                take: limit ? Number(limit) : undefined,
            })

            return utils.sendResponse({
                code: 200,
                data: {
                    offers: offers,
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
                {name: "Title", type: "string", requried: true},
                {name: "Price", type: "number"},
                {name: "Description", type: "string", regex: textRegex},
            ])

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            await Offer.new({
                title: model.Title,
                price: model.Price ?? 0,
                description: model.Description,
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
            
            let offer = await Offer.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!offer) return utils.sendResponse({code: 400, error: "Услуга не найдена"})

            const requestData = await request.json() as DefaultRequest


            const { model, errors } = utils.parseRequestModel(requestData.data ?? {}, [
                {name: "Title", type: "string"},
                {name: "Price", type: "number"},
                {name: "Description", type: "string", regex: textRegex},
            ])

            if (Object.keys(errors).length > 0) return utils.sendResponse({code: 400, error: errors})

            if (model.Title) offer.Title = model.Title

            offer.Price = model.Price
            offer.Description = model.Description

            await offer.save()

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
            
            let offer = await Offer.findOne({
                where: {
                    id: id ? Number(id) : undefined
                }
            })

            if (!offer) return utils.sendResponse({code: 400, error: "Услуга не найдена"})

            await offer.remove()

            return utils.sendResponse({
                code: 200,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed