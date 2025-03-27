import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Guarantee } from '../../guarantee/entities/guarantee.entity';

@Entity('claims')
export class Claim extends AbstractBaseEntity {
  @Column('float')
  amount: number; // Aggregated from "Total Claims" or individual claim amounts

  @Column()
  days_past_due: number;

  @ManyToOne(() => Guarantee, (guarantee) => guarantee.claims)
  guarantee: Guarantee;
}
