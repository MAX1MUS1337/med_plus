import { DataSource } from "typeorm"

import * as models from "./models"

import { DB_ADDR, DB_DATABASE, DB_PASS, DB_USER } from "$env/static/private"

const _global = new DataSource({
    type: "postgres",
    database: DB_DATABASE,
    host: DB_ADDR.split(":")[0],
    port: Number(DB_ADDR.split(":")[1] ?? 5432),
    username: DB_USER,
    password: DB_PASS,
    synchronize: true,
    entities: [
        models.Employee,
        models.Role,
        models.Offer,
        models.User,
        models.Passport,
        models.ScheduleItem,
        models.Record,
        models.RecordState,
    ],
})

export const InitGlobal = function() {
    if (!_global.isInitialized) _global.initialize().then(async () => {
        // employee roles
        {
            let doctorRole = await models.Role.findOne({ where: {id: 1, Title: "Врач"}})
            if (!doctorRole) doctorRole = await models.Role.new({title: "Врач"})

            let registarRole = await models.Role.findOne({ where: {id: 2, Title: "Регистратор"}})
            if (!registarRole) registarRole = await models.Role.new({title: "Регистратор"})
        }
        
        // record states
        {
            let created = await models.RecordState.findOne({ where: {id: 1, Name: "Создана"}})
            if (!created) created = await models.RecordState.new({name: "Создана"})

            let onReception = await models.RecordState.findOne({ where: {id: 2, Name: "На приёме"}})
            if (!onReception) onReception = await models.RecordState.new({name: "На приёме"})

            let finished = await models.RecordState.findOne({ where: {id: 3, Name: "Завершена"}})
            if (!finished) finished = await models.RecordState.new({name: "Завершена"})
        }
    })
}