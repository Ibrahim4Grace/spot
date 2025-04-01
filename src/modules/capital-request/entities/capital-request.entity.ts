import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Borrower } from '../../borrower/entities/borrower.entity';
import { User } from '../../user/entities/user.entity';

@Entity('capital_requests')
export class CapitalRequest extends AbstractBaseEntity {
  @Column('float')
  amount: number;

  @Column()
  purpose: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Column({ type: 'date', nullable: true })
  approval_date: Date;

  @ManyToOne(() => Borrower, (borrower) => borrower.capital_requests)
  borrower: Borrower;

  @ManyToOne(() => User, (user) => user.approved_requests, { nullable: true })
  approved_by: User; // Officer or investor who approved
}
