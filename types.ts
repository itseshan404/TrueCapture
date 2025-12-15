export enum ProcessingStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum RealismLevel {
  STANDARD = 'Standard',
  HIGH = 'High',
  ULTRA = 'Ultra'
}

export enum CameraProfile {
  DSLR = 'DSLR Camera',
  FILM = 'Vintage Film (35mm)',
  PHONE = 'Smartphone Capture',
  POLAROID = 'Polaroid'
}

export interface ProcessingOptions {
  realismLevel: RealismLevel;
  cameraProfile: CameraProfile;
  grainAmount: number; // 0-100
}

export interface ProcessingStep {
  id: string;
  label: string;
  completed: boolean;
}