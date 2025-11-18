export function RadiusSystem() {
  const radii = [
    { name: "Card", value: "12px", pixels: 12 },
    { name: "Button", value: "16px", pixels: 16 },
    { name: "Big Card", value: "20px", pixels: 20 },
  ];

  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {radii.map((radius) => (
          <div key={radius.name} className="space-y-3">
            <div className="text-center">
              <p className="text-[#1B262C]">{radius.name}</p>
              <p className="text-[#7D8B91]">{radius.value}</p>
            </div>
            <div
              className="h-24 bg-[#2E8BC0]"
              style={{ borderRadius: `${radius.pixels}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
