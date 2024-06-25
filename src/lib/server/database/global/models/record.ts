import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn } from "typeorm"

import { Employee } from "./employee"
import { Offer } from "./offer"
import { User } from "./user"

@Entity('record_states')
export class RecordState extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'name', unique: true})
    Name: string | undefined

    static new(data: {name: string}): Promise<RecordState> {
        let state = new RecordState()

        state.Name = data.name

        return state.save()
    }
}

@Entity('records')
export class Record extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('date', { name: 'date'})
    Date: Date | undefined

    @Column('time', { name: 'time'})
    Time: Date | undefined

    @ManyToOne(() => Employee)
    @JoinColumn({name: "employee"})
    Employee: Employee | undefined

    @ManyToOne(() => Offer)
    @JoinColumn({name: "offer"})
    Offer: Offer | undefined

    @OneToOne(() => User)
    @JoinColumn({name: "user"})
    User: User | undefined

    @ManyToOne(() => RecordState)
    @JoinColumn({name: "state"})
    State: RecordState | undefined

    static new(data: {date: Date, time: Date, employee: Employee, offer: Offer, user: User, state: RecordState}): Promise<Record> {
        let record = new Record()

        record.Date = data.date
        record.Time = data.time
        record.Employee = data.employee
        record.Offer = data.offer
        record.User = data.user
        record.State = data.state

        return record.save()
    }
}