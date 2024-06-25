import { DataSource } from "typeorm"

import * as models from "./models"

const local = new DataSource({
    type: "sqlite",
    database: "db/local",
    synchronize: true,
    entities: [
        models.User,
        models.Role,
        models.Token,
    ],
})

export const InitLocal = function() {
    if (!local.isInitialized) local.initialize().then(async () => {
        let adminRole = await models.Role.findOne({ where: {id: 1, Title: "Администратор"}})
        if (!adminRole) adminRole = await models.Role.new({title: "Администратор"})

        let managerRole = await models.Role.findOne({ where: {id: 2, Title: "Менеджер"}})
        if (!managerRole) managerRole = await models.Role.new({title: "Менеджер"})

        if (!(await models.User.exists({where: {Login: "root", Role: adminRole}}))) models.User.new({login: "root", password: "toor", role: adminRole})
    })
}