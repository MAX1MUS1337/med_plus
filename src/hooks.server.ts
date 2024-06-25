import "reflect-metadata"

import { type Handle } from "@sveltejs/kit"

import { InitLocal } from "./lib/server/database/local"
import { InitGlobal } from "./lib/server/database/global"
import Cipher from "./lib/server/cipher"

import { SEC_KEY_PATH } from "$env/static/private"

import { routes, type RouteHandle, type Route } from "./routes"

InitLocal()
InitGlobal()

Cipher.GetInstance({keyPath: SEC_KEY_PATH})

const collectHandlers = function(url: URL, routes: Route, path: string = ""): RouteHandle[] {
    let handlers: RouteHandle[] = []

    if (routes.handle) handlers.push(routes.handle)

    if (!routes.routes) return handlers

    for (const route of routes.routes) {
        const routePath = `${path}/${route.path}`.replaceAll("//", "/")

        if (url.pathname.startsWith(routePath)) {
            handlers.push(...collectHandlers(url, route, routePath))
            break
        }
    }

    return handlers
}

export const handle: Handle = async ({ resolve, event }) => {
    const { url } = event

    if (routes.routes) {
        const handlers = collectHandlers(url, routes)

        for (const handler of handlers) {
            const result = await handler({event: event, resolve: resolve})
            if (result) return result
        }
    }

    const response = await resolve(event)

    return response
}