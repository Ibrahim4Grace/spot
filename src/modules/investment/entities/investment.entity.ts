import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Guarantee } from '../../guarantee/entities/guarantee.entity';

@Entity('investments')
export class Investment extends AbstractBaseEntity {
  @Column('float')
  amount: number;

  @Column({ type: 'date' })
  investment_date: Date;

  @ManyToOne(() => User, (user) => user.investments)
  investor: User;

  @ManyToOne(() => Guarantee, (guarantee) => guarantee.investments)
  guarantee: Guarantee;
}
