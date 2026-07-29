import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { basename, dirname, join } from 'node:path';

import {
  normalizeAndValidateEmail,
  type NewsletterProvider,
  type SubscribeOutcome,
} from '@/lib/newsletter';

export type NewsletterRecord = {
  email: string;
  subscribedAt: string;
};

export const defaultNewsletterDataFile = join(
  process.cwd(),
  'data',
  'newsletter-subscribers.json',
);

const pendingWrites = new Map<string, Promise<void>>();

function validateRecords(value: unknown): NewsletterRecord[] {
  if (!Array.isArray(value)) {
    throw new Error('Newsletter storage must contain an array');
  }

  if (
    value.some(
      (record) =>
        typeof record !== 'object' ||
        record === null ||
        typeof record.email !== 'string' ||
        typeof record.subscribedAt !== 'string',
    )
  ) {
    throw new Error('Newsletter storage contains an invalid record');
  }

  return value as NewsletterRecord[];
}

async function readRecords(dataFilePath: string): Promise<NewsletterRecord[]> {
  try {
    return validateRecords(JSON.parse(await readFile(dataFilePath, 'utf8')));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

function dedupeRecords(records: NewsletterRecord[]): NewsletterRecord[] {
  const emails = new Set<string>();
  return records.filter((record) => {
    if (emails.has(record.email)) {
      return false;
    }

    emails.add(record.email);
    return true;
  });
}

async function writeRecords(dataFilePath: string, records: NewsletterRecord[]) {
  const directory = dirname(dataFilePath);
  const temporaryFilePath = join(directory, `.${basename(dataFilePath)}.${randomUUID()}.tmp`);

  await mkdir(directory, { recursive: true });
  try {
    await writeFile(temporaryFilePath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
    await rename(temporaryFilePath, dataFilePath);
  } catch (error) {
    await unlink(temporaryFilePath).catch(() => undefined);
    throw error;
  }
}

function serialize<T>(dataFilePath: string, operation: () => Promise<T>): Promise<T> {
  const previous = pendingWrites.get(dataFilePath) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(operation);
  const release = current.then(
    () => undefined,
    () => undefined,
  );

  pendingWrites.set(dataFilePath, release);
  void release.finally(() => {
    if (pendingWrites.get(dataFilePath) === release) {
      pendingWrites.delete(dataFilePath);
    }
  });

  return current;
}

export function createJsonNewsletterProvider({
  dataFilePath = defaultNewsletterDataFile,
}: {
  dataFilePath?: string;
} = {}): NewsletterProvider {
  return {
    subscribe(email): Promise<SubscribeOutcome> {
      return serialize(dataFilePath, async () => {
        const validation = normalizeAndValidateEmail(email);
        if (!validation.ok) {
          throw new Error('Newsletter provider received an invalid email');
        }

        const records = await readRecords(dataFilePath);
        const dedupedRecords = dedupeRecords(records);
        const alreadySubscribed = dedupedRecords.some((record) => record.email === validation.email);

        if (alreadySubscribed) {
          if (dedupedRecords.length !== records.length) {
            await writeRecords(dataFilePath, dedupedRecords);
          }
          return { kind: 'alreadySubscribed' };
        }

        await writeRecords(dataFilePath, [
          ...dedupedRecords,
          { email: validation.email, subscribedAt: new Date().toISOString() },
        ]);
        return { kind: 'subscribed' };
      });
    },
  };
}
