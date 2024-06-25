enum UserRole {
    Admin = 1,
    Manager = 2
}

enum EmployeeRole {
    Doctor = 1,
    Registar = 2
}

export { UserRole, EmployeeRole }

export const loginRegex = /^([a-zA-Z0-9_\-]*)$/
export const nameRegex = /^([\u0400-\u04FF]*)$/
export const passwordRegex = /^([a-zA-Z0-9!\*\#\$\.@%_]*)$/
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const specificationRegex = /^([a-zA-Z0-9\u0400-\u04FF_,\-]*)$/
export const textRegex = /^([a-zA-Z0-9\u0400-\u04FF\_\,\:\;\.\!\?\'\"\-\s]*)$/

export const dashboardRoutes = [
    {title: "Главная страница", href: "/home", icon: "fa-solid fa-house"},
    {title: "Профиль", href: "/account", icon: "fa-solid fa-user", color: "#5A4FCF"},
    {title: "Пользователи", href: "/users", icon: "fa-solid fa-users", color: "#B39F7A", roles: [UserRole.Admin]},
    {title: "Сотрудники", href: "/employees", icon: "fa-solid fa-user-doctor", color: "#A2231D"},
    {title: "Услуги", href: "/offers", icon: "fa-solid fa-tags", color: "#013A33"},
    {title: "Для разработчиков", href: "/dev", icon: "fa-solid fa-code", color: "#0047AB", roles: [UserRole.Admin]},
]

export const defaultRoutes = [
    {title: "Главная страница", href: "/home", icon: "fa-solid fa-house"},
    {title: "Профиль", href: "/account", icon: "fa-solid fa-user", admin: false, user: true, color: "#5A4FCF"},
    {title: "Расписание врачей", href: "/schedule", icon: "fa-solid fa-calendar-day", roles: [EmployeeRole.Registar], user: false, color: "#0047AB"},
    {title: "Пациенты", href: "/patients", icon: "fa-solid fa-users", color: "#B39F7A", roles: [EmployeeRole.Registar], user: false},
    {title: "Паспортные данные", href: "/passports", icon: "fa-solid fa-passport", roles: [EmployeeRole.Registar], user: false, color: "#A2231D"},
    {title: "Записи", href: "/records", icon: "fa-solid fa-clipboard", roles: [EmployeeRole.Registar], user: false, color: "#013A33"},
    {title: "Моё расписание", href: "/my_schedule", icon: "fa-solid fa-calendar-day", roles: [EmployeeRole.Doctor], admin: false, user: false, color: "#0047AB"},
    {title: "Мои записи", href: "/my_records", icon: "fa-solid fa-clipboard", admin: false, employee: false, user: true, color: "#013A33"},
]