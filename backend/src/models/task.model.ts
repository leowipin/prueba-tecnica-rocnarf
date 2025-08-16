import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
import { User } from "./user.model";
import { Comment } from "./comment.model";
import { Notification } from "./notification.model";

export enum TaskStatus {
    PENDIENTE = "pendiente",
    EN_PROGRESO = "en progreso",
    COMPLETADA = "completada",
}

@Entity({ name: "tasks" })
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Index()
    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.PENDIENTE
    })
    status!: TaskStatus;

    @Index()
    @Column({ type: "timestamp", nullable: true })
    dueDate?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    attachmentPath?: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt!: Date;

    // Relaciones
    @ManyToOne(() => User, (user) => user.tasksAssigned, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "assignedToId" })
    assignedTo!: User;

    @ManyToOne(() => User, (user) => user.tasksCreated, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "createdById" })
    createdBy!: User;

    @OneToMany(() => Comment, (comment) => comment.task)
    comments!: Comment[];

    @OneToMany(() => Notification, (notification) => notification.task)
    notifications!: Notification[];
}