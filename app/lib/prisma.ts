import { PrismaClient } from '../generated/prisma';

declare global {
  var prismaGlobal: undefined | PrismaClient;
}

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy object during build time to prevent constructor throw
    return new Proxy({} as PrismaClient, {
      get(target, prop) {
        if (prop === '$transaction') {
          return (val: any) => typeof val === 'function' ? val(prisma) : Promise.resolve([]);
        }
        return new Proxy(() => {}, {
          get(t, p) {
            return () => Promise.resolve([]);
          },
          apply(t, thisArg, args) {
            return Promise.resolve([]);
          }
        });
      }
    });
  }

  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient();
  }
  return globalThis.prismaGlobal;
};

const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrismaClient();
    return Reflect.get(client, prop, receiver);
  }
});

export default prisma;
