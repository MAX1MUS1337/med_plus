import type { ServerLoad } from "@sveltejs/kit"

import { dashboardRoutes } from "$lib/server/env"

import { User } from "$lib/server/database/local/models"

export const load: ServerLoad = async function({url, locals}) {
    const user = locals.user instanceof User ? locals.user : null

	return {
		user: {id: user?.id, login: user?.Login, firstName: user?.FirstName, lastName: user?.LastName, role: {id: user?.Role?.id, title: user?.Role?.Title}},
        links: dashboardRoutes.filter(v => {
            if (!v.roles || (v.roles && v.roles.length == 0)) return true

            if (!user?.Role || !user.Role.id) return false

            return v.roles.includes(user.Role.id)
        }),
        title: dashboardRoutes.find(v => `/dashboard/${v.href}`.replaceAll("//", "/") == url.pathname)?.title,
	}
}