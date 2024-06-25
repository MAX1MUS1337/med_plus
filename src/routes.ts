import { type RequestEvent, type ResolveOptions, type MaybePromise, redirect, error } from "@sveltejs/kit"

import * as utils from "./lib/server/api/utils"

import { User } from "./lib/server/database/local/models"
import { Employee } from "./lib/server/database/global/models"
import { User as Patient } from "./lib/server/database/global/models"

import { dashboardRoutes, defaultRoutes, EmployeeRole, UserRole } from "./lib/server/env"

type RouteHandle = (input: {
    event: RequestEvent,
    resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>
}) => MaybePromise<Response | void>

type Route = {
    path: string
    handle?: RouteHandle
    routes?: Route[]
}

export type { RouteHandle, Route }

export const routes: Route = {
    path: "/",
    handle: async ({ event }) => {
        const { url } = event

        if (url.pathname == "/") throw redirect(302, "/default")
    },
    routes: [
        {
            path: "/default",
            handle: async ({ event }) => {
                const { locals, cookies, url } = event
            
                locals.token = cookies.get('tok') ?? null

                if (locals.token) {
                    const userData = (await utils.verifyToken<{uid: number, userType: string}>(locals.token))
                    let user: User | Employee | Patient | null
                    
                    // searching user
                    {
                        switch (userData.userType) {
                            case "admin":
                                user = await User.findOne({
                                    relations: {
                                        Role: true,
                                    },
                                    select: {id: true, Login: true, FirstName: true, LastName: true, Role: {id: true, Title: true}},
                                    where: {id: userData.uid}
                                })
        
                                break
                            case "employee":
                                user = await Employee.findOne({
                                    relations: {
                                        Role: true
                                    },
                                    select: {id: true, Login: true, FirstName: true, LastName: true, Patronymic: true, Phone: true, Email: true, Role: {id: true, Title: true}},
                                    where: {id: userData.uid}
                                })
        
                                break
                            case "user":
                                user = await Patient.findOne({
                                    select: {id: true, Login: true, FirstName: true, LastName: true, Patronymic: true, BirthDate: true, Phone: true, Email: true, Address: true},
                                    where: {id: userData.uid}
                                })
        
                                break
                            default:
                                user = null
                        }
                    }

                    locals.user = user
                }

                if (url.pathname == "/default/new_appointment") return

                if (!locals.user && url.pathname != "/default/auth") {
                    cookies.delete("tok", {path: "/"})
                    throw redirect(302, "/default/auth")
                }

                if (url.pathname == "/default") {
                    throw redirect(302, "/default/home")
                }

                const route = defaultRoutes.find(v => `/default/${v.href}`.replaceAll("//", "/") == url.pathname)

                if (!route) return

                if (locals.user instanceof Patient && route.user != undefined && route.user == false) throw error(403, "Отказано в доступе")
                if (locals.user instanceof Employee && route.employee != undefined && route.employee == false) throw error(403, "Отказано в доступе")
                if (locals.user instanceof User && route.admin != undefined && route.admin == false) throw error(403, "Отказано в доступе")

                // roles
                {
                    if (route.roles && locals.user instanceof Patient) throw error(403, "Отказано в доступе")

                    if (route.roles && locals.user instanceof Employee) if (!locals.user.Role || !route.roles.includes(locals.user.Role.id ?? 0)) throw error(403, "Отказано в доступе")
                }
            },
            routes: [
                {
                    path: "/auth",
                    handle: async ({ event }) => {
                        const { locals } = event

                        if (locals.user) throw redirect(302, "/default/home")
                    }
                },
            ]
        },
        {
            path: "/api",
            handle: async ({ event }) => {
                const { request, locals, cookies } = event
            
                const authorizationHeader = request.headers.get("Authorization")
                locals.token = authorizationHeader?.startsWith("Bearer ") ? authorizationHeader?.substring(7) : (cookies.get('tok') ?? null)

                if (!locals.token) return

                const userData = (await utils.verifyToken<{uid: number, userType: string}>(locals.token))
                let user: User | Employee | Patient | null

                // searching user
                {
                    switch (userData.userType) {
                        case "admin":
                            user = await User.findOne({
                                relations: {
                                    Role: true,
                                },
                                select: {id: true, Login: true, FirstName: true, LastName: true, Role: {id: true, Title: true}},
                                where: {id: userData.uid}
                            })
    
                            break
                        case "employee":
                            user = await Employee.findOne({
                                relations: {
                                    Role: true
                                },
                                select: {id: true, Login: true, FirstName: true, LastName: true, Patronymic: true, Phone: true, Email: true, Role: {id: true, Title: true}},
                                where: {id: userData.uid}
                            })
    
                            break
                        case "user":
                            user = await Patient.findOne({
                                select: {id: true, Login: true, FirstName: true, LastName: true, Patronymic: true, BirthDate: true, Phone: true, Email: true, Address: true},
                                where: {id: userData.uid}
                            })
    
                            break
                        default:
                            user = null
                    }
                }
                    
                if (user) locals.user = user
            },
            routes: [
                {
                    path: "/dashboard",
                    routes: [
                        {
                            path: "/users",
                            handle: async ({ event }) => {
                                const { url, locals } = event

                                if (url.pathname.includes("/auth")) return

                                if (!locals.token) return utils.sendResponse({code: 401, error: "Токен не передан."})
                                if (!locals.user) return utils.sendResponse({code: 401, error: "Невалидная сессия."})

                                if (url.pathname.includes("/me")) return

                                if (!utils.hasRole(locals, UserRole.Admin)) return utils.sendResponse({code: 403, error: "Отказано в доступе."})
                            },
                        },
                        {
                            path: "/tokens",
                            handle: async ({ event }) => {
                                const { locals } = event

                                if (!locals.token) return utils.sendResponse({code: 401, error: "Токен не передан."})
                                if (!locals.user) return utils.sendResponse({code: 401, error: "Невалидная сессия."})

                                if (!utils.hasRole(locals, UserRole.Admin)) return utils.sendResponse({code: 403, error: "Отказано в доступе."})
                            },
                        },
                    ],
                },
                {
                    path: "/employees",
                    handle:  async ({ event }) => {
                        const { locals } = event

                        if (!locals.token) return utils.sendResponse({code: 401, error: "Токен не передан."})
                        if (!locals.user || !(locals.user instanceof User)) return utils.sendResponse({code: 401, error: "Невалидная сессия."})
                    }
                },
                {
                    path: "/offers",
                    handle:  async ({ event }) => {
                        const { locals, request, url } = event

                        if (request.method != "GET") {
                            if (!locals.token) return utils.sendResponse({code: 401, error: "Токен не передан."})
                            if (!locals.user || !(locals.user instanceof User)) return utils.sendResponse({code: 401, error: "Невалидная сессия."})
                        }
                    }
                },
                {
                    path: "/account",
                    handle:  async ({ event }) => {
                        const { locals } = event

                        if (!locals.token) return utils.sendResponse({code: 401, error: "Токен не передан."})
                        if (!locals.user || locals.user instanceof User) return utils.sendResponse({code: 401, error: "Невалидная сессия."})
                    }
                },
                {
                    path: "/patients",
                    handle:  async ({ event }) => {
                        const { locals, url } = event

                        if (!locals.token || !locals.user) return utils.sendResponse({code: 401, error: "Токен не передан."})
                        
                        if (url.pathname.endsWith("/me")) {
                            if (!(locals.user instanceof Patient)) return utils.sendResponse({code: 403, error: "Невалидная сессия."})
                            
                            return
                        }
                        
                        if (locals.user instanceof Patient) return utils.sendResponse({code: 401, error: "Невалидная сессия."})
                    }
                },
                {
                    path: "/schedule",
                    handle:  async ({ event }) => {
                        const { locals, url } = event

                        if (url.pathname.endsWith("/time_intervals")) return

                        if (!locals.token || !locals.user) return utils.sendResponse({code: 401, error: "Токен не передан."})
                        
                        if (url.pathname.endsWith("/me")) {
                            if (!(locals.user instanceof Patient)) return utils.sendResponse({code: 403, error: "Невалидная сессия."})
                            
                            return
                        }
                        
                        if (locals.user instanceof Patient) return utils.sendResponse({code: 401, error: "Невалидная сессия."})

                        if (locals.user instanceof Employee && locals.user.Role?.id == EmployeeRole.Doctor) return utils.sendResponse({code: 401, error: "Невалидная сессия."})
                    }
                }
            ],
        },
        {
            path: "/dashboard",
            handle: async ({ event }) => {
                const { locals, cookies, url } = event
            
                locals.token = cookies.get('tok') ?? null

                if (locals.token) {
                    const userData = (await utils.verifyToken<{uid: number, userType: string}>(locals.token))

                    if (userData.userType != "admin") {
                        cookies.delete("tok", {path: "/"})
                        throw redirect(302, "/")
                    }

                    const user = await User.findOne({
                        relations: {
                            Role: true,
                        },
                        select: {id: true, Login: true, FirstName: true, LastName: true, Role: {id: true, Title: true}},
                        where: {id: userData.uid}
                    })

                    if (!user) {
                        cookies.delete("tok", {path: "/"})
                        throw redirect(302, "/dashboard/auth")
                    }

                    locals.user = user
                }

                if (!locals.user && url.pathname != "/dashboard/auth") {
                    cookies.delete("tok", {path: "/"})
                    throw redirect(302, "/dashboard/auth")
                }

                const route = dashboardRoutes.find(v => `/dashboard/${v.href}`.replaceAll("//", "/") == url.pathname)

                if (!route) return

                const adminUser = locals.user as User

                if (route.roles) if (!adminUser.Role || !route.roles.includes(adminUser.Role.id ?? 0)) throw error(403, "Отказано в доступе")
            },
            routes: [
                {
                    path: "/auth",
                    handle: async ({ event }) => {
                        const { locals } = event

                        if (locals.user) throw redirect(302, "/dashboard/home")
                    }
                },
            ]
        },
    ],
}