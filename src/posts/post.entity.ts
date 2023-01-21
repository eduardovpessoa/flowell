import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    @JoinColumn()
    user: User;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column({ default: true })
    isActive: boolean;
}
