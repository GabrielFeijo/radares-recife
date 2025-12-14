export interface RadarData {
    equipment_type: string;
    inmetro_registration: string;
    manufacturer_serial_number: string;
    equipment_identification: string;
    installation_location: string;
    monitoring_direction: string;
    latitude: number;
    longitude: number;
    monitored_lanes: number;
    monitored_speed: string;
    vmd: number;
    vmd_period: string;
}

export interface CameraData {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T[];
    error?: string;
}