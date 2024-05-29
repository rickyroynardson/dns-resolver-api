import fs from "fs";
import dns from "dns";
import { createDomains } from "./domain.service";
import { CreateDomainType } from "./domain.type";
import { logger } from "../../utils/logger";

export const checkDomains = async () => {
  try {
    // read domains list from csv
    const file = fs.readFileSync("domains.csv", "utf-8");
    const domains = file
      .split("\n")
      .map((domain) => domain.trim().replace(/"/g, ""));

    logger.info(`[checkDomains] Fetching list of domains`);
    checkStatus(domains);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// check domains status (presence, spf, dkim, dmarc)
export const checkStatus = async (domains: string[]) => {
  const results = await Promise.all(
    domains.map(async (domain) => {
      try {
        const resolvedDomain = await dns.promises.resolveTxt(domain);
        return {
          name: domain,
          presence: true,
          spf: checkSPF(resolvedDomain),
          dkim: await checkDKIM(domain),
          dmarc: await checkDMARC(domain),
        };
      } catch (error) {
        return { name: domain, presence: false };
      }
    })
  );

  createDomains(results as CreateDomainType[]);
};

const checkSPF = (resolvedDomain: string[][]) => {
  const spfRecords = resolvedDomain
    .flat()
    .filter((record) => record.startsWith("v=spf1"));
  return spfRecords.length > 0 ? spfRecords[0] : null;
};

const checkDKIM = async (domain: string) => {
  try {
    // try google workspace dkim selector
    const resolved = await dns.promises.resolveTxt(
      `google._domainkey.${domain}`
    );
    const dkimRecords = resolved
      .flat()
      .filter((record) => record.startsWith("v=DKIM1"));
    return dkimRecords.length > 0 ? dkimRecords[0] : null;
  } catch (error: any) {
    if (error.code === "ENOTFOUND") {
      // try microsoft dkim selector
      try {
        const altResolved = await dns.promises.resolveTxt(
          `k1._domainkey.${domain}`
        );
        const dkimRecords = altResolved
          .flat()
          .filter((record) => record.startsWith("v=DKIM1"));
        return dkimRecords.length > 0 ? dkimRecords[0] : null;
      } catch (error) {
        // error (or can add other selector)
        return null;
      }
    }
    return null;
  }
};

const checkDMARC = async (domain: string) => {
  try {
    const resolved = await dns.promises.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecords = resolved
      .flat()
      .filter((record) => record.startsWith("v=DMARC1"));
    return dmarcRecords.length > 0 ? dmarcRecords[0] : null;
  } catch (error) {
    return null;
  }
};
