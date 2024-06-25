export type DefaultRequest = {data: Record<string, any>}

export type RequestModelProps = {
    name: string
    type: "string" | "number" | "boolean" | "date"
    requried?: boolean
    regex?: RegExp
    regexFailedText?: string
}