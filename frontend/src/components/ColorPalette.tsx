export function ColorPalette() {
	const primaryColors = [
		{ name: "Aspire Blue", hex: "#2E8BC0" },
		{ name: "Caribbean Teal", hex: "#2EC4B6" },
		{ name: "Sunrise Yellow", hex: "#FFD447" },
		{ name: "Coral Red", hex: "#FF6F61" },
	];

	const neutralColors = [
		{ name: "Dark Navy", hex: "#1B262C" },
		{ name: "Medium Gray", hex: "#7D8B91" },
		{ name: "Light Gray", hex: "#E8EFF2" },
		{ name: "White", hex: "#FFFFFF" },
	];

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-[#7D8B91] mb-4">Primary Colors</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{primaryColors.map((color) => (
						<div key={color.name} className="space-y-2">
							<div
								className="h-24 rounded-xl shadow-sm"
								style={{ backgroundColor: color.hex }}
							/>
							<div>
								<p className="text-[#1B262C]">{color.name}</p>
								<p className="text-[#7D8B91]">{color.hex}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<h3 className="text-[#7D8B91] mb-4">Neutral Colors</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{neutralColors.map((color) => (
						<div key={color.name} className="space-y-2">
							<div
								className="h-24 rounded-xl shadow-sm border border-[#E8EFF2]"
								style={{ backgroundColor: color.hex }}
							/>
							<div>
								<p className="text-[#1B262C]">{color.name}</p>
								<p className="text-[#7D8B91]">{color.hex}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
