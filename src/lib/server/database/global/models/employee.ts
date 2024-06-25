import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from "typeorm"

import { Role } from "./role"
import { Passport } from "./passport"

@Entity('employees')
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'login', unique: true})
    Login: string | undefined

    @Column('text', { name: 'password'})
    Password: string | undefined

    @Column('text', { name: 'first_name'})
    FirstName: string | undefined

    @Column('text', { name: 'last_name'})
    LastName: string | undefined

    @Column('text', { name: 'patronymic', nullable: true})
    Patronymic: string | undefined

    @Column('text', { name: 'specification', nullable: true})
    Specification: string | undefined

    @Column('text', { name: 'about', nullable: true})
    About: string | undefined

    @Column('text', { name: 'phone', unique: true})
    Phone: string | undefined

    @Column('text', { name: 'email', unique: true})
    Email: string | undefined

    @ManyToOne(() => Role)
    @JoinColumn({name: 'role'})
    Role: Role | undefined

    @OneToOne(() => Passport)
    @JoinColumn({name: "passport"})
    Passport: Passport | undefined

    static new(data: {login: string, password: string, firstName: string, lastName: string, patronymic?: string, about?: string, specification?: string, phone:string, email: string, role: Role, passport?: Passport}): Promise<Employee> {
        let employee = new Employee()

        employee.Login = data.login
        employee.Password = data.password
        employee.FirstName = data.firstName
        employee.LastName = data.lastName
        employee.Patronymic = data.patronymic
        employee.About = data.about
        employee.Specification = data.specification
        employee.Email = data.email
        employee.Phone = data.phone
        employee.Role = data.role
        employee.Passport = data.passport

        return employee.save()
    }
}