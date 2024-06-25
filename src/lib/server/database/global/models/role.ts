import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'title', unique: true})
    Title: string | undefined

    static new(data: {title: string}): Promise<Role> {
        let role = new Role()

        role.Title = data.title

        return role.save()
    }
}