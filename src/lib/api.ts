export type ApiRouteArg = {
    name: string
    type: "string" | "number" | "boolean" | "Date" | "object"
    objectDefinition?: ApiRouteArg[]
    description?: string
}

export type ApiRouteDefinition = {
    path: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "TRACE"
    description?: string
    inputArgs?: ApiRouteArg[]
    outputArgs?: ApiRouteArg[]
    routes?: ApiRouteDefinition[]
    protected?: boolean
}