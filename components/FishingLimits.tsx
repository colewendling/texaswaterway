import React from 'react';

const fishingLimits = [
  { species: 'Largemouth Bass', dailyLimit: 5, minimumLength: 14 },
  { species: 'Smallmouth Bass', dailyLimit: 5, minimumLength: 14 },
  { species: 'Spotted Bass', dailyLimit: 5, minimumLength: 14 },
  { species: 'White Bass', dailyLimit: 25, minimumLength: 10 },
  { species: 'Striped Bass', dailyLimit: 5, minimumLength: 18 },
  {
    species: 'Blue Catfish',
    dailyLimit: 25,
    minimumLength: 'No Limit',
  },
  { species: 'Channel Catfish', dailyLimit: 25, minimumLength: 12 },
  { species: 'Flathead Catfish', dailyLimit: 5, minimumLength: 18 },
  { species: 'Crappie', dailyLimit: 25, minimumLength: 10 },
  {
    species: 'Redear Sunfish',
    dailyLimit: 'No Limit',
    minimumLength: 'No Limit',
  },
  {
    species: 'Longear Sunfish',
    dailyLimit: 'No Limit',
    minimumLength: 'No Limit',
  },
];

const FishingLimits: React.FC = () => {
  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-semibold pb-4 text-primary">
        Texas State Fishing Limits
      </h2>
      <div className="overflow-x-auto rounded-lg border shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 font-semibold">Species</th>
              <th className="px-4 py-2 font-semibold">Daily Limit</th>
              <th className="px-4 py-2 font-semibold">
                Minimum Length (inches)
              </th>
            </tr>
          </thead>
          <tbody>
            {fishingLimits.map((limit, idx) => (
              <tr
                key={limit.species}
                className={`${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50`}
              >
                <td className="px-4 py-2">{limit.species}</td>
                <td className="px-4 py-2">{limit.dailyLimit}</td>
                <td className="px-4 py-2">{limit.minimumLength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishingLimits;
