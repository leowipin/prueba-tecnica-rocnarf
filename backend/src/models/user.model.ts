import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Task } from "./task.model";
import { Comment } from "./comment.model";
import { Notification } from "./notification.model";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    username!: string;
    
    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;

    // Relaciones
    @OneToMany(() => Task, (task) => task.assignedTo)
    tasksAssigned!: Task[];

    @OneToMany(() => Task, (task) => task.createdBy)
    tasksCreated!: Task[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications!: Notification[];
}