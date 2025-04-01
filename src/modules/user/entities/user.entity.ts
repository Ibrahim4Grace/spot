import { Column, Entity, OneToOne, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Borrower } from '../../borrower/entities/borrower.entity';
import { UserType } from '../interface/UserInterface';
import { Role } from '../../role/entities/role.entity';
import { Guarantee } from '@modules/guarantee/entities/guarantee.entity';
import { Investment } from '@modules/investment/entities/investment.entity';
import { CapitalRequest } from '@modules/capital-request/entities/capital-request.entity';
// import { NotificationSettings } from '../../../modules/notification-settings/entities/notification-setting.entity';
// import { Notification } from '../../../modules/notifications/entities/notifications.entity';

@Entity({ name: 'users' })
export class User extends AbstractBaseEntity {
  @Column({ nullable: true })
  pronouns?: string;

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

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  is_active: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  permissions?: object;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  role: UserType; // New field to specify role

  @Column({ nullable: true })
  verification_level: number; // 0 (Pending), 1, 2, 3 (Verified) for guarantors

  @OneToOne(() => Borrower, (borrower) => borrower.user, { nullable: true })
  @JoinColumn({ name: 'borrower_id' })
  borrower: Borrower;

  @OneToMany(() => Guarantee, (guarantee) => guarantee.guarantor, { nullable: true }) // For guarantors
  guaranteed_loans: Guarantee[];

  @OneToMany(() => Investment, (investment) => investment.investor, { nullable: true }) // For investors
  investments: Investment[];

  @OneToMany(() => CapitalRequest, (capitalRequest) => capitalRequest.approved_by, { nullable: true })
  approved_requests: CapitalRequest[]; // Added to track approvals

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];

  // @OneToOne(() => NotificationSettings, (notification_settings) => notification_settings.user)
  // notification_settings: NotificationSettings[];
}
