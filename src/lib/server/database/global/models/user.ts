import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm"

import { Passport } from "./passport"

@Entity('users')
export class User extends BaseEntity {
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

    @Column('text', { name: 'phone', unique: true})
    Phone: string | undefined

    @Column('text', { name: 'email', unique: true})
    Email: string | undefined

    @Column('text', { name: 'address'})
    Address: string | undefined

    @Column('date', { name: 'birth_date', nullable: true})
    BirthDate: Date | undefined

    @OneToOne(() => Passport)
    @JoinColumn({name: "passport"})
    Passport: Passport | undefined

    @Column('text', { name: 'data', nullable: true})
    Data: string | undefined

    static new(data: {login: string, password: string, firstName: string, lastName: string, patronymic?: string, phone: string, email: string, birthDate: Date, address: string, passport?: Passport}): Promise<User> {
        let user = new User()

        user.Login = data.login
        user.Password = data.password
        user.FirstName = data.firstName
        user.LastName = data.lastName
        user.Patronymic = data.patronymic
        user.BirthDate = data.birthDate
        user.Address = data.address
        user.Phone = data.phone
        user.Email = data.email
        user.Passport = data.passport

        return user.save()
    }
}