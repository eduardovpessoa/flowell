import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ type: "char", length: 60 })
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: true })
    isActive: boolean;
}