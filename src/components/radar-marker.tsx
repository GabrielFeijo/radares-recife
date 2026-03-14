import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { RadarData } from '@/types';

const radarIcon = new L.Icon({
    iconUrl: '/radar.png',
    iconSize: [30, 30],
});

interface RadarMarkerProps {
    radar: RadarData;
    isActive: boolean;
    onClick: () => void;
}

export const RadarMarker: React.FC<RadarMarkerProps> = ({ radar, isActive, onClick }) => {
    return (
        <Marker
            position={[radar.latitude, radar.longitude]}
            title={radar.installationLocation}
            icon={radarIcon}
            eventHandlers={{
                mousedown: onClick,
            }}
        >
            <Tooltip
                offset={[15, 0]}
                opacity={1}
                permanent
                className='font-bold'
            >
                {radar.monitoredSpeed}
            </Tooltip>
            {isActive && (
                <Popup autoClose>
                    <section className='text-black max-w-52 space-y-2 font-poppins'>
                        <h2 className="font-bold">Local: {radar.installationLocation}</h2>
                        <p><strong>Faixas Fiscalizadas:</strong> {radar.monitoredLanes}</p>
                        <p><strong>Sentido:</strong> {radar.monitoringDirection}</p>
                        <p><strong>Identificação:</strong> {radar.equipmentIdentification}</p>
                        <p><strong>Tipo:</strong> {radar.equipmentType}</p>
                        <p><strong>Velocidade:</strong> {radar.monitoredSpeed}</p>
                        <p><strong>VMD:</strong> {radar.vmd.toLocaleString()} veículos/dia</p>
                        <p><strong>Período VMD:</strong> {radar.vmdPeriod}</p>
                        <p>
                            <strong>Ver no Maps:</strong>{' '}
                            <a
                                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${radar.latitude},${radar.longitude}`}
                                target='_blank'
                                rel='noreferrer'
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Clique Aqui
                            </a>
                        </p>
                    </section>
                </Popup>
            )}
        </Marker>
    );
};
