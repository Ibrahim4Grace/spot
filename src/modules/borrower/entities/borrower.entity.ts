import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { Guarantee } from '../../guarantee/entities/guarantee.entity';
import { User } from '../../user/entities/user.entity';
import { CapitalRequest } from '../../capital-request/entities/capital-request.entity';

@Entity('borrowers')
export class Borrower extends AbstractBaseEntity {
  @Column()
  company_name: string;

  @Column({ nullable: true })
  number_of_employees: number;

  @Column({ nullable: true })
  ceo: string;

  @Column({ nullable: true })
  gender_of_ceo: string;

  @Column({ nullable: true })
  birth_year: number;

  @OneToOne(() => User, (user) => user.borrower)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Guarantee, (guarantee) => guarantee.borrower)
  guarantees: Guarantee[];

  @OneToMany(() => CapitalRequest, (request) => request.borrower)
  capital_requests: CapitalRequest[];
}
