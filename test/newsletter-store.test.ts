import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, relative } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createJsonNewsletterProvider,
  defaultNewsletterDataFile,
} from '@/lib/newsletter-store';

const temporaryDirectories: string[] = [];

async function createDataFilePath() {
  const directory = await mkdtemp(join(tmpdir(), 'magma-newsletter-'));
  temporaryDirectories.push(directory);
  return join(directory, 'data', 'subscribers.json');
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })));
});

describe('JSON newsletter provider', () => {
  it('creates a normalized email record with an ISO subscription time when its file is missing', async () => {
    const dataFilePath = await createDataFilePath();
    const provider = createJsonNewsletterProvider({ dataFilePath });

    await expect(provider.subscribe('hello@example.com')).resolves.toEqual({ kind: 'subscribed' });

    const records = JSON.parse(await readFile(dataFilePath, 'utf8'));
    expect(records).toEqual([
      {
        email: 'hello@example.com',
        subscribedAt: expect.any(String),
      },
    ]);
    expect(new Date(records[0].subscribedAt).toISOString()).toBe(records[0].subscribedAt);
  });

  it('writes a record when its existing JSON file is empty', async () => {
    const dataFilePath = await createDataFilePath();
    await mkdir(join(dataFilePath, '..'), { recursive: true });
    await writeFile(dataFilePath, '[]', 'utf8');
    const provider = createJsonNewsletterProvider({ dataFilePath });

    await provider.subscribe('empty-file@example.com');

    await expect(readFile(dataFilePath, 'utf8')).resolves.toContain('empty-file@example.com');
  });

  it('returns alreadySubscribed and adds no row when a normalized email subscribes twice', async () => {
    const dataFilePath = await createDataFilePath();
    const provider = createJsonNewsletterProvider({ dataFilePath });

    await provider.subscribe('hello@example.com');
    await expect(provider.subscribe('  hello@example.com  ')).resolves.toEqual({ kind: 'alreadySubscribed' });

    const records = JSON.parse(await readFile(dataFilePath, 'utf8'));
    expect(records).toHaveLength(1);
    expect(records[0].email).toBe('hello@example.com');
  });

  it('uses a data file outside the public directory by default', () => {
    expect(basename(defaultNewsletterDataFile)).toBe('newsletter-subscribers.json');
    expect(relative(process.cwd(), defaultNewsletterDataFile)).toBe('data/newsletter-subscribers.json');
    expect(defaultNewsletterDataFile).not.toContain(`${join('public')}/`);
  });
});
