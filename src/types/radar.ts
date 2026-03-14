export interface RadarData {
    id: number;
    equipmentType: string;
    inmetroRegistration: string;
    manufacturerSerialNumber: string;
    equipmentIdentification: string;
    installationLocation: string;
    monitoringDirection: string;
    latitude: number;
    longitude: number;
    monitoredLanes: number;
    monitoredSpeed: string;
    vmd: number;
    vmdPeriod: string;
}
