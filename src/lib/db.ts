import Dexie, { type EntityTable } from 'dexie';
import { UserData, QuestionAnswer, RiskResult } from '@/types/leishcheck';

interface Session {
  id?: number;
  date: string;
  userData: UserData;
  answers: QuestionAnswer[];
  result: RiskResult;
  hasImage: boolean;
}

interface ConsentLog {
  id?: number;
  date: string;
  given: boolean;
}

const db = new Dexie('LeishCheckDB') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
  consent_log: EntityTable<ConsentLog, 'id'>;
};

db.version(1).stores({
  sessions: '++id, date',
  consent_log: '++id, date',
});

export async function saveSession(session: Omit<Session, 'id'>) {
  return db.sessions.add(session as Session);
}

export async function getSessions() {
  return db.sessions.orderBy('date').reverse().toArray();
}

export async function logConsent(given: boolean) {
  return db.consent_log.add({ date: new Date().toISOString(), given });
}

export default db;
