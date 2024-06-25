import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from "typeorm"

@Entity('passports')
@Unique(["Series", "Number"])
export class Passport extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'series'})
    Series: string | undefined

    @Column('text', { name: 'number'})
    Number: string | undefined

    @Column('text', { name: 'issuer'})
    Issuer: string | undefined

    @Column('date', { name: 'date', nullable: true})
    Date: Date | undefined

    static new(data: {series: string, number: string, issuer: string, date: Date}): Promise<Passport> {
        let passport = new Passport()

        passport.Series = data.series
        passport.Number = data.number
        passport.Issuer = data.issuer
        passport.Date = data.date

        return passport.save()
    }
}