import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface ReportMetadata {
  report_id: string;
  client_name: string;
  engagement_name: string;
  engagement_id?: string;
  date_generated: string;
  date_of_testing: {
    start: string;
    end: string;
  };
  tester_info: {
    company: string;
    team: Array<{
      name: string;
      email: string;
      role: string;
    }>;
  };
  recipient: {
    company: string;
    contacts: Array<{
      name: string;
      email: string;
      role: string;
    }>;
  };
  report_version: string;
}

export interface Scope {
  in_scope: Array<{
    target: string;
    description: string;
    testing_type: 'black-box' | 'gray-box' | 'white-box';
    methodologies: string[];
  }>;
}

export interface ExecutiveSummary {
  risk_rating: 'low' | 'medium' | 'high' | 'critical';
  business_impact: string;
  strengths: string[];
  challenges: string[];
  strategic_recommendations: string[];
}

export interface Finding {
  id: string;
  report_id: string;
  title: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  cvss_score: number;
  cvss_vector?: string;
  summary: string;
  affected_assets: string[];
  technical_details: {
    impact: string;
    testing_process: string;
  };
  recommendations: string[];
  references?: string[];
  status: 'resolved' | 'unresolved' | 'accepted_risk' | 'false_positive';
  media?: Array<{
    type: 'screenshot' | 'script' | 'pcap' | 'other';
    file_name: string;
    file_path: string;
  }>;
}

export interface Artefacts {
  global_test_log?: {
    file_name: string;
    file_path: string;
  };
  tools_used: Array<{
    tool_name: string;
    version: string;
  }>;
}

export interface Report {
  id: string;
  report_metadata: ReportMetadata;
  scope: Scope;
  executive_summary: ExecutiveSummary;
  findings: Finding[];
  artefacts: Artefacts;
}

interface PentestReportsDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: {
      'by-date': string;
      'by-client': string;
      'by-engagement': string;
    };
  };
}

const DB_NAME = 'pentest-reports';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<PentestReportsDB>>;

export const initDB = async (): Promise<void> => {
  dbPromise = openDB<PentestReportsDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportStore.createIndex('by-date', 'report_metadata.date_generated');
        reportStore.createIndex('by-client', 'report_metadata.client_name');
        reportStore.createIndex('by-engagement', 'report_metadata.engagement_name');
      }
    },
  });
  await dbPromise;
};

export const addReport = async (report: Omit<Report, 'id'>): Promise<Report> => {
  const db = await dbPromise;
  const newReport: Report = {
    ...report,
    id: crypto.randomUUID(),
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
  await db.delete('reports', id);
};

export const getReportsByClient = async (client: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-client');
  return index.getAll(client);
};

export const getReportsByEngagement = async (engagement: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-engagement');
  return index.getAll(engagement);
};

export const getReportsByDateRange = async (startDate: string, endDate: string): Promise<Report[]> => {
  const db = await dbPromise;
  const tx = db.transaction('reports', 'readonly');
  const index = tx.store.index('by-date');
  const range = IDBKeyRange.bound(startDate, endDate);
  return index.getAll(range);
}; 