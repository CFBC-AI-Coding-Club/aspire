export function TypographySystem() {
  const styles = [
    { name: "H1", size: "32px", weight: "SemiBold", text: "The quick brown fox jumps over the lazy dog" },
    { name: "H2", size: "24px", weight: "SemiBold", text: "The quick brown fox jumps over the lazy dog" },
    { name: "H3", size: "20px", weight: "Medium", text: "The quick brown fox jumps over the lazy dog" },
    { name: "Body Large", size: "18px", weight: "Regular", text: "The quick brown fox jumps over the lazy dog" },
    { name: "Body Medium", size: "16px", weight: "Regular", text: "The quick brown fox jumps over the lazy dog" },
    { name: "Body Small", size: "14px", weight: "Regular", text: "The quick brown fox jumps over the lazy dog" },
    { name: "Caption", size: "12px", weight: "Regular", text: "The quick brown fox jumps over the lazy dog" },
  ];

  const getWeightClass = (weight: string) => {
    switch (weight) {
      case "SemiBold":
        return "font-semibold";
      case "Medium":
        return "font-medium";
      default:
        return "font-normal";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 space-y-6">
      {styles.map((style) => (
        <div key={style.name} className="border-b border-[#E8EFF2] last:border-0 pb-6 last:pb-0">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-[#7D8B91] min-w-32">{style.name}</span>
            <span className="text-[#7D8B91]">
              {style.size} – {style.weight} – Inter
            </span>
          </div>
          <p
            className={`text-[#1B262C] ${getWeightClass(style.weight)}`}
            style={{ fontSize: style.size }}
          >
            {style.text}
          </p>
        </div>
      ))}
    </div>
  );
}
