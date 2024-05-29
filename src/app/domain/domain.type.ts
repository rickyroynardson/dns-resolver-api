export interface CreateDomainType {
  name: string;
  presence: boolean;
  spf: string | null;
  dkim: string | null;
  dmarc: string | null;
}
