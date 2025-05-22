// Mock

const thingsToDo = [
  { id: 1, name: 'Trekking' },
  { id: 2, name: 'Snorkeling' },
  { id: 3, name: 'Temple Visit' },
];

const Experience = () => {
  return (
    <div className="rounded-lg bg-green-50 p-6 shadow-md">
      <h2 className="mb-4 text-3xl font-bold text-green-800">Things to Do</h2>
      <ul className="space-y-3">
        {thingsToDo.map((thing) => (
          <li
            key={thing.id}
            className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-lg"
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

export default Experience;
