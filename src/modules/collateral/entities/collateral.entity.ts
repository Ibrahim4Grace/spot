import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Guarantee } from '../../guarantee/entities/guarantee.entity';

@Entity('collaterals')
export class Collateral extends AbstractBaseEntity {
  @Column()
  collateral_type: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  registration: string;

  @Column({ nullable: true })
  collateral_detail: string;

  @Column('float', { nullable: true })
  fsv: number;

  @Column('float', { nullable: true })
  cash_collateral: number;

  @Column({ nullable: true })
  other_asset: string;

  @ManyToOne(() => Guarantee, (guarantee) => guarantee.collaterals)
  guarantee: Guarantee;
}
