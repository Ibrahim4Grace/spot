import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Collateral } from '../../collateral/entities/collateral.entity';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Claim } from '../../claim/entities/claim.entity';
import { Borrower } from '../../borrower/entities/borrower.entity';

@Entity('guarantees')
export class Guarantee extends AbstractBaseEntity {
  @Column({ unique: true })
  ref: string;

  @Column()
  pfi_ref: string;

  @Column({ type: 'date', nullable: true })
  date_of_approval_by_pfi: Date;

  @Column()
  guarantee_type: string; // "Guarantee Type" (e.g., PG, IG, BG)

  @Column()
  loan_product_name: string;

  @Column('float')
  pfi_approved_loan_amount: number;

  @Column('float')
  current_balance: number; // "Current balance (loan)"

  @Column()
  tenor_of_loan_months: number;

  @Column()
  remaining_tenor_months: number;

  @Column({ nullable: true })
  moratorium_months: number;

  @Column()
  frequency_of_repayment: string; // (e.g., Monthly, Quarterly)

  @Column({ nullable: true })
  repayment_type: string; // (e.g., Capital & Interest, Interest Only)

  @Column()
  loan_history: string; //  (e.g., New loan, Restructured)

  @Column()
  stage: number; //  (e.g., 1, 2, 3)

  @Column({ type: 'date' })
  disbursement_date: Date;

  @Column({ type: 'date' })
  maturity_date: Date;

  @Column('float')
  disbursed_amount: number;

  @Column()
  days_past_due: number;

  @Column('float')
  past_due_amount: number;

  @Column()
  purpose: string;

  @Column()
  business_description: string;

  @Column()
  sector: string;

  @Column()
  sub_sector: string;

  @Column('float')
  interest_rate_effective: number;

  @Column({ nullable: true })
  e_and_s_categorization: string; // "E&S Categorization"

  @Column({ nullable: true })
  account_officer_at_pfi: string;

  @Column({ type: 'boolean' })
  first_time: boolean;

  @Column('bigint')
  annual_turnover: number;

  @Column()
  segment: string; // (e.g., Micro, Small)

  @Column()
  region: string;

  // Fund-related fields
  @Column({ nullable: true })
  fund_ref: string;

  @Column({ type: 'date', nullable: true })
  date_received_at_fund: Date;

  @Column({ type: 'boolean', nullable: true })
  complete_info_received: boolean;

  @Column('float', { nullable: true })
  fund_approved_loan_amount: number;

  @Column('float', { nullable: true })
  fund_approved_amount_brackets: number;

  @Column('float', { nullable: true })
  fund_approved_guaranteed_exposure: number;

  @Column('float', { nullable: true })
  fund_current_guaranteed_exposure: number;

  @Column({ nullable: true })
  approval_level_at_fund: string;

  @Column({ type: 'date', nullable: true })
  date_of_operations_sign_off: Date;

  @Column({ type: 'date', nullable: true })
  ro_review_date: Date;

  @Column({ type: 'date', nullable: true })
  date_of_risk_sign_off: Date;

  @Column()
  decision: string; // (e.g., Approved, On-hold)

  @Column({ nullable: true })
  reason_for_rejection: string;

  @Column()
  status: string; //(e.g., Active)

  @Column({ nullable: true })
  log_number: string;

  @Column({ type: 'date', nullable: true })
  log_issued_date: Date;

  @Column({ type: 'date', nullable: true })
  log_validity: Date;

  @Column({ nullable: true })
  premium: string;

  @Column({ nullable: true })
  internal_rating: string;

  @Column({ nullable: true })
  pfi_rating_during_last_review: string;

  @Column({ nullable: true })
  pfis_pd: string;

  @Column({ nullable: true })
  rank: number;

  @Column({ type: 'date', nullable: true })
  date_signed_off_formatted_q: Date; // "Date Signed Off formatted (Q)"

  @Column({ type: 'date', nullable: true })
  date_signed_off_formatted_m: Date; // "Date Signed Off formatted (M)"

  @OneToMany(() => Collateral, (collateral) => collateral.guarantee)
  collaterals: Collateral[];

  @OneToMany(() => Claim, (claim) => claim.guarantee)
  claims: Claim[];

  @ManyToOne(() => Borrower, (borrower) => borrower.guarantees)
  borrower: Borrower;
}
