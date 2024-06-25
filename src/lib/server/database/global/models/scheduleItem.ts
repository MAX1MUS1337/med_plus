import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Check } from "typeorm"

import { Employee } from "./employee"

@Entity('schedule_items')
@Check(`"timespan" > 5`)
@Check(`"capacity" >= 1`)
export class ScheduleItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('date', { name: 'date'})
    Date: Date | undefined

    @Column('time', { name: 'start'})
    Start: string | undefined

    @Column('time', { name: 'end'})
    End: string | undefined

    @Column('smallint', { name: 'timespan'})
    Timespan: number | undefined

    @Column('smallint', { name: 'capacity'})
    Capacity: number | undefined

    @ManyToOne(() => Employee)
    @JoinColumn({name: "employee"})
    Employee: Employee | undefined

    static new(data: {date: Date, start: string, end: string, timespan?: number, capacity?: number, employee: Employee}): Promise<ScheduleItem> {
        let scheduleItem = new ScheduleItem()

        scheduleItem.Date = data.date
        scheduleItem.Start = data.start
        scheduleItem.End = data.end
        scheduleItem.Timespan = data.timespan
        scheduleItem.Capacity = data.capacity ?? 1
        scheduleItem.Employee = data.employee

        return scheduleItem.save()
    }
}