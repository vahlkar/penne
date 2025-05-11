import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Finding {
  id: string;
  reportId: string;
  title: string;
  type: string;
  cvssScore: number;
  description: string;
  recommendation: string;
  references: string;
  affectedAssets: string;
  stepsToReproduce: string;
  cvssVector: {
    attackVector: string;
    scope: string;
    attackComplexity: string;
    privilegesRequired: string;
    userInteraction: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
    exploitCodeMaturity?: string;
    remediationLevel?: string;
    reportConfidence?: string;
    confidentialityRequirement?: string;
    integrityRequirement?: string;
    availabilityRequirement?: string;
  };
  isCompleted: boolean;
}

export interface Report {
  id: string;
  name: string;
  assessmentType: string;
  tester: string;
  date: string;
  securityTeam?: string;
  startDate?: string;
  endDate?: string;
  scope?: string;
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
  findings: {
    key: string;
    value: Finding;
    indexes: {
      'by-report': string;
    };
  };
}

const DB_NAME = 'pentest-reports';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<PentestReportsDB>>;

export const initDB = async (): Promise<void> => {
  dbPromise = openDB<PentestReportsDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportStore.createIndex('by-date', 'date');
        reportStore.createIndex('by-type', 'assessmentType');
        reportStore.createIndex('by-tester', 'tester');
      }
      if (oldVersion < 2) {
        const findingStore = db.createObjectStore('findings', { keyPath: 'id' });
        findingStore.createIndex('by-report', 'reportId');
      }
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
  await db.add('reports', newReport);
  return newReport;
};

export const updateReport = async (report: Report): Promise<void> => {
  const db = await dbPromise;
  await db.put('reports', report);
};

export const getAllReports = async (): Promise<Report[]> => {
  const db = await dbPromise;
  return db.getAll('reports');
};

export const getReport = async (id: string): Promise<Report | undefined> => {
  const db = await dbPromise;
  return db.get('reports', id);
};

export const deleteReport = async (id: string): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction(['reports', 'findings'], 'readwrite');
  await tx.store.delete('reports', id);
  const findingsIndex = tx.objectStore('findings').index('by-report');
  const findings = await findingsIndex.getAll(id);
  for (const finding of findings) {
    await tx.objectStore('findings').delete(finding.id);
  }
  await tx.done;
};

export const getReportsByType = async (type: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-type');
  return index.getAll(type);
};

export const getReportsByTester = async (tester: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-tester');
  return index.getAll(tester);
};

export const getReportsByDateRange = async (startDate: string, endDate: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-date');
  const range = IDBKeyRange.bound(startDate, endDate);
  return index.getAll(range);
};

// Findings functions
export const addFinding = async (finding: Omit<Finding, 'id'>): Promise<Finding> => {
  const db = await dbPromise;
  const newFinding: Finding = {
    ...finding,
    id: crypto.randomUUID(),
  };
  await db.add('findings', newFinding);
  return newFinding;
};

export const updateFinding = async (finding: Finding): Promise<void> => {
  const db = await dbPromise;
  await db.put('findings', finding);
};

export const deleteFinding = async (id: string): Promise<void> => {
  const db = await dbPromise;
  await db.delete('findings', id);
};

export const getFindingsByReport = async (reportId: string): Promise<Finding[]> => {
  const db = await dbPromise;
  const tx = db.transaction('findings', 'readonly');
  const index = tx.store.index('by-report');
  return index.getAll(reportId);
}; 