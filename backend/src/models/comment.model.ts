import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { Task } from "./task.model";

@Entity({ name: "comments" })
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    content!: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne(() => User, (user) => user.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Task, (task) => task.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "taskId" })
    task!: Task;
}