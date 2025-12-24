import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface AddressSearchProps {
    onLocationSelect: (lat: number, lon: number, address: string) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onLocationSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            searchAddress(query);
        }, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query]);

    const searchAddress = async (searchQuery: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)},Recife,Pernambuco,Brazil` +
                `&format=json` +
                `&limit=5` +
                `&addressdetails=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setResults(data);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        onLocationSelect(lat, lon, result.display_name);
        setShowResults(false);
        setResults([]);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder="Buscar endereço em Recife..."
                    className="w-full px-4 py-3 pr-20 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-800 placeholder-gray-500 bg-white bg-opacity-90 rounded shadow-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                            title="Limpar busca"
                        >
                            <FiX size={18} strokeWidth={2.5} className="text-gray-600" />
                        </button>
                    )}
                    <button
                        onClick={() => query.length >= 3 && searchAddress(query)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        disabled={isLoading || query.length < 3}
                        title="Buscar"
                    >
                        <FiSearch size={18} strokeWidth={2.5} className={isLoading ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                </div>
            </div>

            {showResults && results.length > 0 && !isLoading && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.place_id}
                            onClick={() => handleSelectResult(result)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
                        >
                            <p className="text-sm text-gray-800 line-clamp-2">
                                {result.display_name}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query.length >= 3 && results.length === 0 && !isLoading && (
                <div className="absolute top-full mt-2 w-full border border-gray-200 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <p className="text-sm text-gray-600 text-center">
                        Nenhum resultado encontrado para "{query}"
                    </p>
                </div>
            )}

            {isLoading && (
                <div className="absolute top-full mt-2 w-full border border-gray-200 p-4 bg-white bg-opacity-90 rounded shadow-lg">
                    <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                        Buscando...
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddressSearch;