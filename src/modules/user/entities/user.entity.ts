import * as bcrypt from 'bcryptjs';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Borrower } from '../../borrower/entities/borrower.entity';
import { UserType } from '../../enums/enum';
// import { NotificationSettings } from '../../../modules/notification-settings/entities/notification-setting.entity';
// import { Notification } from '../../../modules/notifications/entities/notifications.entity';

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
  attempts_left: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.BORROWER })
  user_type: UserType;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  is_active: boolean;

  @OneToOne(() => Borrower, (borrower) => borrower.user)
  borrower: Borrower;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
  private previousPassword: string; // To track password changes

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Only hash if password has changed
    if (this.password !== this.previousPassword && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @AfterLoad()
  storePreviousPassword() {
    this.previousPassword = this.password; // Store the current password after loading
  }

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  // @OneToOne(() => NotificationSettings, (notification_settings) => notification_settings.user)
  // notification_settings: NotificationSettings[];
}
