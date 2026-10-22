import {
  CourseIdentity,
  EvaluationComponent,
  ComponentInstrument,
  EvaluationModelType,
  WorkflowStage,
} from '../types';

const STORAGE_KEYS = {
  IDENTITY: 'sirubrik_unpatti_identity_v1',
  COMPONENTS: 'sirubrik_unpatti_components_v1',
  INSTRUMENTS: 'sirubrik_unpatti_instruments_v1',
  MODEL: 'sirubrik_unpatti_model_v1',
  RPS_TEXT: 'sirubrik_unpatti_rps_text_v1',
  REF_TEXT: 'sirubrik_unpatti_ref_text_v1',
  STAGE: 'sirubrik_unpatti_stage_v1',
  LAST_SYNC: 'sirubrik_unpatti_last_sync_v1',
};

export interface SyncStatusInfo {
  timestamp: string;
  source: 'SIMPEL-CPL' | 'Desain-RPSOBE' | 'Penyimpanan Lokal (Cache)' | 'Inisialisasi Sistem';
  status: 'synced' | 'cached' | 'pending';
  recordCount?: number;
}

export const loadStoredData = () => {
  try {
    const rawIdentity = localStorage.getItem(STORAGE_KEYS.IDENTITY);
    const rawComponents = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
    const rawInstruments = localStorage.getItem(STORAGE_KEYS.INSTRUMENTS);
    const rawModel = localStorage.getItem(STORAGE_KEYS.MODEL);
    const rawRpsText = localStorage.getItem(STORAGE_KEYS.RPS_TEXT);
    const rawRefText = localStorage.getItem(STORAGE_KEYS.REF_TEXT);
    const rawStage = localStorage.getItem(STORAGE_KEYS.STAGE);
    const rawSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

    return {
      identity: rawIdentity ? (JSON.parse(rawIdentity) as CourseIdentity) : null,
      components: rawComponents ? (JSON.parse(rawComponents) as EvaluationComponent[]) : null,
      instruments: rawInstruments ? (JSON.parse(rawInstruments) as Record<string, ComponentInstrument>) : null,
      selectedModel: rawModel ? (JSON.parse(rawModel) as EvaluationModelType) : null,
      rpsText: rawRpsText || null,
      referenceText: rawRefText || null,
      stage: rawStage ? (JSON.parse(rawStage) as WorkflowStage) : null,
      lastSync: rawSync ? (JSON.parse(rawSync) as SyncStatusInfo) : null,
    };
  } catch (e) {
    console.warn('Error reading from localStorage', e);
    return {
      identity: null,
      components: null,
      instruments: null,
      selectedModel: null,
      rpsText: null,
      referenceText: null,
      stage: null,
      lastSync: null,
    };
  }
};

export const saveStoredData = (data: {
  identity?: CourseIdentity;
  components?: EvaluationComponent[];
  instruments?: Record<string, ComponentInstrument>;
  selectedModel?: EvaluationModelType;
  rpsText?: string;
  referenceText?: string;
  stage?: WorkflowStage;
  lastSync?: SyncStatusInfo;
}) => {
  try {
    if (data.identity !== undefined) {
      localStorage.setItem(STORAGE_KEYS.IDENTITY, JSON.stringify(data.identity));
    }
    if (data.components !== undefined) {
      localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(data.components));
    }
    if (data.instruments !== undefined) {
      localStorage.setItem(STORAGE_KEYS.INSTRUMENTS, JSON.stringify(data.instruments));
    }
    if (data.selectedModel !== undefined) {
      localStorage.setItem(STORAGE_KEYS.MODEL, JSON.stringify(data.selectedModel));
    }
    if (data.rpsText !== undefined) {
      localStorage.setItem(STORAGE_KEYS.RPS_TEXT, data.rpsText);
    }
    if (data.referenceText !== undefined) {
      localStorage.setItem(STORAGE_KEYS.REF_TEXT, data.referenceText);
    }
    if (data.stage !== undefined) {
      localStorage.setItem(STORAGE_KEYS.STAGE, JSON.stringify(data.stage));
    }
    if (data.lastSync !== undefined) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(data.lastSync));
    }
  } catch (e) {
    console.warn('Error saving to localStorage', e);
  }
};

export const clearStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.warn('Error clearing localStorage', e);
  }
};
