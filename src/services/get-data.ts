import axios from 'axios';
import type { RadarData, CameraData, ApiResponse } from '@/types';

export const getRadars = async (): Promise<RadarData[]> => {
	try {
		const response = await axios.get<ApiResponse<RadarData>>('/api/radars', {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error(response.data.error || 'Erro ao buscar dados de radares');
		}
	} catch (error) {
		console.error('Erro ao buscar radares:', error);
		return [];
	}
};

export const getCameras = async (): Promise<CameraData[]> => {
	try {
		const response = await axios.get<ApiResponse<CameraData>>('/api/cameras', {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error(response.data.error || 'Erro ao buscar dados de câmeras');
		}
	} catch (error) {
		console.error('Erro ao buscar câmeras:', error);
		return [];
	}
};
