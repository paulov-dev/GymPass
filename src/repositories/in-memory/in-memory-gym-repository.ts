import { randomUUID } from "crypto";
import { GymsRepository } from "../gyms-repository";
import { Gym, Prisma } from "@prisma/client";

export class InMemoryGymsRepository implements GymsRepository {    
    public items: Gym[] = []

    async findById(id: string) {
        const gym = this.items.find((item) => item.id == id)

        if (!gym) {
            return null
        }

        return gym
    }    

    async create(data: Prisma.GymCreateInput) {
        const gym =  {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            longitude: new Prisma.Decimal(data.longitude.toString()),
            latitude: new Prisma.Decimal(data.latitude.toString()),
            created_at: new Date()
        }
    
        this.items.push(gym)
    
        return gym
    }

}
