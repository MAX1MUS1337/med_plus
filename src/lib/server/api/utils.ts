import { json, type RequestHandler } from "@sveltejs/kit"

import { SignJWT, jwtVerify } from "jose"

import { JWT_SECRET_KEY, JWT_EXPIRES_IN } from "$env/static/private"

import { UserRole } from "../env"
import { User } from "../database/local/models"

import type { RequestModelProps } from "./types"

const mimeTypes = {
    "json": "application/json",
    "csv": "text/csv",
}

export const sendResponse = async function(obj: {code: number, data?: any, error?: any, headers?: Record<string, any>}) {
    const response: Record<string, any> = {}

    response.code = obj.code

    if (obj.data) response.data = obj.data
    if (obj.error) response.error = obj.error

    return json(response, {status: obj.code, headers: obj.headers})
}

export const encodeCSV = function(data: Record<string, any>[]) {
    const array = [Object.keys(data[0])].concat(data.map(v => Object.values(v).join(",") ))

    return array.join("\n")
}

export const sendFile = async function(obj: {name: string, data: string, type: "json" | "csv"}) {
    return new Response(obj.data, {
        status: 200,
        headers: {
            "Content-Type" : mimeTypes[obj.type],
            "Content-Disposition": "attachment; filename=" + obj.name + "." + obj.type
        }
    })
}

export const requestHandler = async function(func: () => any) {
    try {
        return func()
    } catch (err: any) {
        return sendResponse({
            code: 500,
            error: "123"
        })
    }
}

export const methodNotAllowed: RequestHandler = async function({ request }) {
    return sendResponse({
        code: 405,
        error: `Method "${request.method}" is not allowed!`
    })
}

export const signToken = async (payload: any, exp?: number) => {
	try {
		return new SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256'})
			.setExpirationTime(exp ?? `${JWT_EXPIRES_IN}h`)
			.setIssuedAt()
			.sign(new TextEncoder().encode(JWT_SECRET_KEY))
	} catch (error) {
		throw error
	}
}

export const verifyToken = async <T>(token: string): Promise<T> => {
	try {
		return (await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY))).payload as T;
	} catch (error) {
		throw new Error('Невалидный или истекший токен')
	}
}

export const hasRole = (locals: App.Locals, role: UserRole) => {
    if (!(locals.user instanceof User)) return false

    return locals.user?.Role?.id == role
}

export const parseRequestModel = function(model: Record<string, any>, props: RequestModelProps[]): {model: Record<string, any>, errors: Record<string, string>} {
    let result: {model: Record<string, any>, errors: Record<string, string>} = {model: {}, errors: {}}

    props.forEach(prop => {
        let val = null
        let rawVal = model[prop.name]

        switch (prop.type) {
            case "string":
                val = rawVal ? String(rawVal) : null
                break
            case "number":
                val = rawVal ? Number(rawVal) : null
                break
            case "boolean":
                if (rawVal) {
                    val = rawVal == true || rawVal == "true" || rawVal == "t" || rawVal == 1 || rawVal == "1"
                } else {
                    val = null
                }
                break
            case "date":
                val = rawVal ? new Date(Date.parse(rawVal)) : null
                break
        }

        if (prop.requried) {
            switch (prop.type) {
                case "string":
                    if (val == null || val == "") {
                        result.errors[prop.name] = "Обязательное поле"
                        return
                    }
                    break
                case "number":
                    if (val == null || val == 0) {
                        result.errors[prop.name] = "Обязательное поле"
                        return
                    }
                    break
                case "boolean":
                    if (val == null || val == false) {
                        result.errors[prop.name] = "Обязательное поле"
                        return
                    }
                    break
                case "date":
                    if (val instanceof Date && isNaN(val.getTime())) {
                        result.errors[prop.name] = "Обязательное поле"
                        return
                    }  
                    break      
            }
        }

        if (prop.type == "string" && prop.regex && val && val != "") {
            if (!((val as string).match(prop.regex))) {
                result.errors[prop.name] = prop.regexFailedText ?? "Содержит недопустимые символы"
                return
            }
        }

        result.model[prop.name] = val
    })

    return result
}