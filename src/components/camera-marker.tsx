import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { CameraData } from '@/types';

const cameraIcon = new L.Icon({
    iconUrl: '/camera.png',
    iconSize: [30, 30],
});

interface CameraMarkerProps {
    camera: CameraData;
    isActive: boolean;
    onClick: () => void;
}

export const CameraMarker: React.FC<CameraMarkerProps> = ({ camera, isActive, onClick }) => {
    return (
        <Marker
            position={[camera.latitude, camera.longitude]}
            title={camera.address}
            icon={cameraIcon}
            eventHandlers={{
                mousedown: onClick,
            }}
        >
            {isActive && (
                <Popup autoClose>
                    <section className='text-black max-w-52 space-y-2 font-poppins'>
                        <h2 className="font-bold">Câmera: {camera.name}</h2>
                        <p><strong>Local:</strong> {camera.address}</p>
                        <p>
                            <strong>Ver no Maps:</strong>{' '}
                            <a
                                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${camera.latitude},${camera.longitude}`}
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
