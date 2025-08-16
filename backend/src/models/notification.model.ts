import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.model";
import { Task } from "./task.model";

@Entity({ name: "notifications" })
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    message!: string;

    @Column({ type: "boolean", default: false })
    isRead!: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    // Relaciones
    @ManyToOne(() => User, (user) => user.notifications, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Task, (task) => task.notifications, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "taskId" })
    task!: Task;
}