import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Borrower } from '../../borrower/entities/borrower.entity';
// import { NotificationSettings } from '../../../modules/notification-settings/entities/notification-setting.entity';
// import { Notification } from '../../../modules/notifications/entities/notifications.entity';

export enum UserType {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  BORROWER = 'borrower',
}

@Entity({ name: 'users' })
export class User extends AbstractBaseEntity {
  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true })
  attempts_left: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.BORROWER })
  user_type: UserType;

  @OneToOne(() => Borrower, (borrower) => borrower.user)
  borrower: Borrower;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  // @OneToOne(() => NotificationSettings, (notification_settings) => notification_settings.user)
  // notification_settings: NotificationSettings[];
}
