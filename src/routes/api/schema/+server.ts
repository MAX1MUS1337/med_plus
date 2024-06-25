import { type RequestHandler } from '@sveltejs/kit'

import * as utils from '$lib/server/api/utils'

import type { ApiRouteDefinition } from '$lib/api'

const apiRoutes: ApiRouteDefinition[] = [
    {
        path: "/dashboard",
        routes: []
    },
    {
        path: "/employees",
        description: "Ветка для работы с сотрудниками",
        routes: [
            {
                path: "/",
                method: "GET",
                description: "Получение сотрудников",
            },
            {
                path: "/",
                method: "POST",
                description: "Добавление нового сотрудника",
                protected: true,
            },
            {
                path: "/",
                method: "PUT",
                description: "Изменение данных сотрудника",
                protected: true,
            },
            {
                path: "/",
                method: "DELETE",
                description: "Удаление сотрудника",
                protected: true,
            }
        ]
    },
    {
        path: "/account",
        routes: []
    },
    {
        path: "/offers",
        routes: []
    },
    {
        path: "/doctors",
        routes: []
    },
    {
        path: "/auth",
        method: "POST",
        description: "Глобальная авторизация пользователей",
        inputArgs: [
            {name: "login", type: "string"},
            {name: "password", type: "string"}
        ],

        outputArgs: [
            {name: "token", type: "string", description: "Токен доступа"}
        ]
    }
]

export const GET: RequestHandler = function() {
    return utils.requestHandler(
        async () => {
            return utils.sendResponse({
                code: 200,
                data: apiRoutes,
            })
        }
    )
}

export const fallback = utils.methodNotAllowed