// Mock

const thingsToDo = [
    { id: 1, name: 'Trekking' },
    { id: 2, name: 'Snorkeling' },
    { id: 3, name: 'Temple Visit' },
];

const ThingsToDo = () => {
    return (
        <div className="p-6 bg-green-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Things to Do</h2>
            <ul className="space-y-3">
                {thingsToDo.map((thing) => (
                    <li
                        key={thing.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <span className="text-lg font-medium text-gray-700">
                            {thing.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThingsToDo;
