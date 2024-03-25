export type CommonEmailProps = {
  headerUrl: string;
  logoUrl: string;
  companyName: string;
  sender: string;
  eBlNo: string;
  note: string;
  viewEblLink: string;
}

export type InvitationEmailProps = {
  logoUrl: string;
  username: string;
  sender: string;
  verifyUrl: string;
}
