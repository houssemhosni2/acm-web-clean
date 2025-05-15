export const userLinks: { LinkName: string; linkValue: number }[] = [
  {
    LinkName: 'Loan portfolio owner',
    linkValue: -4,
  },
  {
    LinkName: 'Manager of loan portfolio owner',
    linkValue: -3,
  },
  {
    LinkName: 'Previous owner',
    linkValue: -2,
  },
  {
    LinkName: 'Manager of previous owner',
    linkValue: -1,
  },
];

export const userLinksGw: { LinkName: string; linkValue: number }[] = [

  {
    LinkName: 'Previous owner',
    linkValue: -2,
  },
  {
    LinkName: 'Manager of previous owner',
    linkValue: -1,
  },
];

export const screenigComponents = [
  { nameScreenigComponent: 'Credit bureau Customer', codeScreenigComponent: 'CREDIT_C' },
  { nameScreenigComponent: 'Credit bureau Guarant', codeScreenigComponent: 'CREDIT_G' },
  { nameScreenigComponent: 'Aml Customer', codeScreenigComponent: 'AML_C' },
  { nameScreenigComponent: 'Aml Guarant', codeScreenigComponent: 'AML_G' },
  { nameScreenigComponent: 'KYC Customer', codeScreenigComponent: 'KYC_C' },
  { nameScreenigComponent: 'KYC Guarant', codeScreenigComponent: 'KYC_G' },
  { nameScreenigComponent: 'Score Customer', codeScreenigComponent: 'SCORE_C' },
  { nameScreenigComponent: 'Score Guarant', codeScreenigComponent: 'SCORE_G' },
];

export const configScreenComp = {
  displayKey: 'nameScreenigComponent',
  search: true,
  placeholder: ' ',
  height: '30rem',
};

export const configCollectionParticipants = {
  displayKey: 'description', // if objects array passed which key to be displayed defaults to description
  search: true,
  placeholder: ' ',
  height: '25rem',
};

export const configDocProd = {
  displayKey: 'docCodde',
  search: true,
  placeholder: ' ',
  height: '30rem',
};

export const stepTap: { tapName: string; tapValue: number }[] = [
  {
    tapName: 'New',
    tapValue: 1,
  },
  {
    tapName: 'Draft',
    tapValue: 2,
  },
  {
    tapName: 'Pending Approval',
    tapValue: 3,
  },
  {
    tapName: 'Approved',
    tapValue: 4,
  },
];

export const configJournalEntryType = {
  search: true,
  displayKey: 'code',
  searchOnKey: 'code',
  placeholder: ' '
};

export const configDocTopupProd = {
  displayKey: 'docCodde',
  search: true,
  placeholder: ' ',
  height: '30rem',
};

export const configParticipants = {
  displayKey: 'nameParticipant',
  search: false,
  placeholder: ' ',
  height: '30rem',
};

export const afterCollection: { collName: string; collValue: string }[] = [
  {
    collName: 'Pervious action complete date',
    collValue: '1',
  },
  {
    collName: 'Due Date',
    collValue: '2',
  },
];
