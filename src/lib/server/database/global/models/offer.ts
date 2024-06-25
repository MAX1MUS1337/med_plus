import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity('offers')
export class Offer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column('text', { name: 'title'})
    Title: string | undefined

    @Column('text', { name: 'description', nullable: true})
    Description: string | undefined

    @Column('double precision', { name: 'price'})
    Price: number | undefined

    static new(data: {title: string, price: number, description?: string}): Promise<Offer> {
        let offer = new Offer()

        offer.Title = data.title
        offer.Price = data.price
        offer.Description = data.description

        return offer.save()
    }
}