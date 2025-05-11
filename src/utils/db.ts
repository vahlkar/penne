import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Report {
  id: string;
  name: string;
  assessmentType: string;
  tester: string;
  date: string;
}

interface PentestReportsDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: {
      'by-date': string;
      'by-type': string;
      'by-tester': string;
    };
  };
}

const DB_NAME = 'pentest-reports';
const STORE_NAME = 'reports';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PentestReportsDB>>;

export const initDB = async (): Promise<void> => {
  dbPromise = openDB<PentestReportsDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('by-date', 'date');
      store.createIndex('by-type', 'assessmentType');
      store.createIndex('by-tester', 'tester');
    },
  });
  await dbPromise;
};

export const addReport = async (report: Omit<Report, 'id' | 'date'>): Promise<Report> => {
  const db = await dbPromise;
  const newReport: Report = {
    ...report,
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
  };
  await db.add(STORE_NAME, newReport);
  return newReport;
};

export const getAllReports = async (): Promise<Report[]> => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const deleteReport = async (id: string): Promise<void> => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};

export const getReportsByType = async (type: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-type');
  return index.getAll(type);
};

export const getReportsByTester = async (tester: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-tester');
  return index.getAll(tester);
};

export const getReportsByDateRange = async (startDate: string, endDate: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-date');
  const range = IDBKeyRange.bound(startDate, endDate);
  return index.getAll(range);
}; 