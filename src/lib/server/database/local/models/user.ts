import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"

import { Role } from "./role"

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'login', unique: true})
    Login: string | undefined

    @Column('text', { name: 'password'})
    Password: string | undefined

    @Column('text', { name: 'first_name', nullable: true})
    FirstName: string | undefined

    @Column('text', { name: 'last_name', nullable: true})
    LastName: string | undefined

    @ManyToOne(() => Role)
    @JoinColumn({name: 'role'})
    Role: Role | undefined

    static new(data: {login: string, password: string, firstName?: string, lastName?: string, role: Role}): Promise<User> {
        let user = new User()

        user.Login = data.login
        user.Password = data.password
        user.FirstName = data.firstName
        user.LastName = data.lastName
        user.Role = data.role

        return user.save()
    }
}