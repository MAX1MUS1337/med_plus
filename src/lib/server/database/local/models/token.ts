import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity('tokens')
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'token', unique: true})
    Token: string | undefined

    @Column('text', { name: 'note'})
    Note: string | undefined

    @Column('integer', { name: 'exp' })
    Exp: number | undefined

    static new(data: {token: string, note: string, exp: number}): Promise<Token> {
        let token = new Token()

        token.Token = data.token
        token.Note = data.note
        token.Exp = data.exp

        return token.save()
    }
}