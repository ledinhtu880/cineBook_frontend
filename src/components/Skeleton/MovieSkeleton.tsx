const MovieSkeleton = () => {
	return (
		<div className="flex justify-between px-4 animate-pulse">
			{/* Left side - Poster preview skeleton */}
			<div className="w-64 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
				<div className="w-12 h-12 rounded-full bg-gray-300" />
			</div>

			{/* Right side - Form skeleton */}
			<div className="md:w-2/3 space-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Title field */}
					<div className="space-y-2">
						<div className="h-4 w-20 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* Duration field */}
					<div className="space-y-2">
						<div className="h-4 w-32 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* Release date field */}
					<div className="space-y-2">
						<div className="h-4 w-28 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* Age rating field */}
					<div className="space-y-2">
						<div className="h-4 w-32 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* Trailer URL field */}
					<div className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* File upload field */}
					<div className="space-y-2">
						<div className="h-4 w-20 bg-gray-200 rounded" />
						<div className="h-[43px] w-full bg-gray-200 rounded" />
					</div>

					{/* Description field */}
					<div className="space-y-2 col-span-2">
						<div className="h-4 w-16 bg-gray-200 rounded" />
						<div className="h-[120px] w-full bg-gray-200 rounded" />
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
					<div className="h-[43px] w-24 bg-gray-200 rounded" />
					<div className="h-[43px] w-32 bg-gray-200 rounded" />
				</div>
			</div>
		</div>
	);
};

export default MovieSkeleton;
