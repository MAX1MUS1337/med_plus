import type { ServerLoad } from "@sveltejs/kit"

import { User } from "@/lib/server/database/global/models"
import { User as Admin } from "@/lib/server/database/local/models"

import { defaultRoutes } from "@/lib/server/env"

const GetUser = function(locals: App.Locals): Record<string, any> {
    let result: Record<string, any> = {}

    if (locals.user) {
        result.id = locals.user.id
        result.login = locals.user.Login
        result.firstName = locals.user.FirstName
        result.lastName = locals.user?.LastName 
        result.patronymic = locals.user instanceof Admin ? "" : locals.user.Patronymic
        result.role = (locals.user instanceof User) 
        ? {id: -1, title: "Пациент", type: "user"} 
        : {id: locals.user.Role?.id, title: locals.user.Role?.Title, type: locals.user instanceof Admin ? "admin" : "employee"}
    }

    return result
}

export const load: ServerLoad = async function({url, locals}) {
    const user = GetUser(locals)
	return {
		user: user,
        links: defaultRoutes.filter(v => {
            switch (user.role.type) {
                case "admin":
                    if (v.admin != undefined && v.admin == false) return false
                    break
                case "employee":
                    if (v.employee != undefined && v.employee == false) return false
                    break
                case "user":
                    if (v.user != undefined && v.user == false) return false
                    break
            }

            if (!v.roles || (v.roles && v.roles.length == 0)) return true

            if (!user.role || !user.role.id) return false

            return user.role.type == "admin" || v.roles.includes(user.role.id)
        }),
        title: defaultRoutes.find(v => `/default/${v.href}`.replaceAll("//", "/") == url.pathname)?.title,
	}
}