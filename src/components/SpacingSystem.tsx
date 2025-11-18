export function SpacingSystem() {
  const spacings = [
    { size: "4px", pixels: 4 },
    { size: "8px", pixels: 8 },
    { size: "16px", pixels: 16 },
    { size: "24px", pixels: 24 },
    { size: "32px", pixels: 32 },
    { size: "48px", pixels: 48 },
  ];

  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="space-y-6">
        {spacings.map((spacing) => (
          <div key={spacing.size} className="flex items-center gap-6">
            <span className="text-[#7D8B91] w-16">{spacing.size}</span>
            <div
              className="bg-[#2E8BC0] rounded"
              style={{ width: `${spacing.pixels}px`, height: `${spacing.pixels}px` }}
            />
            <div className="h-px flex-1 bg-[#E8EFF2]" />
          </div>
        ))}
      </div>
    </div>
  );
}
