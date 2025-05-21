// Mock

const events = [
    { id: 1, name: 'Diwali Celebration' },
    { id: 2, name: 'Holi Festival' },
    { id: 3, name: 'Yoga Workshop' },
];

const Events = () => {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Events</h2>
            <ul className="space-y-3">
                {events.map((event) => (
                    <li
                        key={event.id}
                        className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <span className="text-lg font-medium text-gray-700">
                            {event.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Events;
