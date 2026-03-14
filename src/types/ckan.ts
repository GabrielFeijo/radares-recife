export interface CKANRadarRecord {
    _id: number;
    tipo_equipamento: string;
    registro_inmetro: string;
    numero_serie_fabricante: string;
    identificacao_equipamento: string | number;
    local_instalacao: string;
    sentido_fiscalizacao: string;
    latitude: number | string;
    longitude: number | string;
    faixas_fiscalizadas: number | string;
    velocidade_fiscalizada: string;
    vmd: number | string;
    periodo_vmd: string;
}

export interface CKANResponse<T> {
    success: boolean;
    result: {
        records: T[];
    };
}

export interface CKANCameraRecord {
    _id: number;
    nome: number | string;
    endereco: string;
    latitude: number | string;
    longitude: number | string;
}
