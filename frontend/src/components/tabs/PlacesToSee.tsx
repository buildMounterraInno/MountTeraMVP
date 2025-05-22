// Mock

const placesToSee = [
    { id: 1, name: 'Taj Mahal', location: 'Agra, India' },
    { id: 2, name: 'Gateway of India', location: 'Mumbai, India' },
    { id: 3, name: 'Red Fort', location: 'Delhi, India' },
    { id: 4, name: 'Hawa Mahal', location: 'Jaipur, India' },
    { id: 5, name: 'Golden Temple', location: 'Amritsar, India' },
];

const PlacesToSee = () => {
    return (
        <div className="p-6 bg-blue-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Places to See</h2>
            <ul className="space-y-4">
                {placesToSee.map((place) => (
                    <li
                        key={place.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-semibold text-blue-700">
                            {place.name}
                        </h3>
                        <p className="text-gray-600">{place.location}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlacesToSee;