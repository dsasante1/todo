import sqlQuestFactory, { SqlQuest } from '@bitreel/sql-quest';
import Env from '../../utils/env';
import Deasyncify from 'deasyncify';
import Logger from '../logger';
import * as process from 'process';
import Hold from '../../utils/helpers/hold';

export const sqlQuest: SqlQuest = sqlQuestFactory({
  databaseUrl: Env.get<string>('DATABASE_URL'),
});

let retry = 3;

export async function connectDB(): Promise<SqlQuest> {
  const [, err] = await Deasyncify.watch(sqlQuest.connect());

  if (err != null) {
    Logger.error(err);
    if (retry > 0) {
      Logger.info(`Error connecting to database, retrying... (${retry} left)`);
      retry -= 1;
      await Hold(3);
      await connectDB();
    }

    process.exit(1);
  }

  Logger.info('Connected to postgres database');

  return sqlQuest;
}
