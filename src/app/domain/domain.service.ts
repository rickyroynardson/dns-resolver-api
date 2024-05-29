import prisma from "../../db";
import { CreateDomainType } from "./domain.type";

/**
 * The function `getDomains` retrieves all domains from a database using Prisma in TypeScript.
 * @returns The `getDomains` function is returning a list of domains fetched from the database using
 * Prisma's `findMany` method.
 */
export const getDomains = async () => {
  const domains = await prisma.domain.findMany();

  return domains;
};

/**
 * The function `createDomains` in TypeScript asynchronously creates or updates domains based on input
 * data using Prisma.
 * @param {CreateDomainType[]} data - The `data` parameter in the `createDomains` function is an array
 * of objects of type `CreateDomainType`. This array contains information about domains that need to be
 * created or updated.
 * @returns The `createDomains` function returns an array of domains that have been updated or created
 * based on the input data provided.
 */
export const createDomains = async (data: CreateDomainType[]) => {
  const existingDomains = await prisma.domain.findMany();
  const existingDomainNames = new Set(
    existingDomains.map((domain) => domain.name)
  );

  const domainsToUpdate = data.filter((item) =>
    existingDomainNames.has(item.name)
  );
  const domainsToCreate = data.filter(
    (item) => !existingDomainNames.has(item.name)
  );

  const updateOperations = domainsToUpdate.map((item) =>
    prisma.domain.update({
      where: { name: item.name },
      data: item,
    })
  );

  const domains = await prisma.$transaction([
    ...updateOperations,
    prisma.domain.createMany({
      data: domainsToCreate,
    }),
  ]);

  return domains;
};
