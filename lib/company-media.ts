export type CompanyPhoto = { src: string; title: string; caption: string };
// Append approved photos here. Six are shown initially; larger galleries can expand.
export const workshopPhotos: CompanyPhoto[] = [
  {src:"/images/partnerships/bohol-factory.webp",title:"Assembly workshop",caption:"Equipment assembly and component preparation."},
  {src:"/images/partnerships/bohol-production.webp",title:"Production floor",caption:"A view across the machine production area."},
];
export const exhibitionPhotos: CompanyPhoto[] = [
  {src:"/images/partnerships/bohol-trade-show.webp",title:"BOHOL at the exhibition",caption:"Our team and visitors at a BOHOL product exhibition."},
];
// Illustrative payment names, with availability qualified on the page per country and terminal.
export const paymentPlatforms = ["Visa","Mastercard","Apple Pay","Google Pay","UnionPay","Alipay","WeChat Pay"].map((name,i)=>({name,image:`/images/payments/platform-${i}.svg`}));
