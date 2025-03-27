export class CreateGuaranteeDto {
  ref: string;
  pfiRef: string;
  dateOfApprovalByPfi?: Date;
  guaranteeType: string;
  loanProductName: string;
  pfiApprovedLoanAmount: number;
  currentBalance: number;
  tenorOfLoanMonths: number;
  remainingTenorMonths: number;
  // ... Add other required fields
}
