const CinemaSkeleton = () => {
	return (
		<div className="flex flex-col gap-6 p-4 pt-0 animate-pulse">
			<div className="space-y-2">
				<div className="h-4 w-24 bg-gray-200 rounded" />
				<div className="h-[43px] w-full bg-gray-200 rounded" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-24 bg-gray-200 rounded" />
				<div className="h-[43px] w-full bg-gray-200 rounded" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-24 bg-gray-200 rounded" />
				<div className="h-[43px] w-full bg-gray-200 rounded" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-24 bg-gray-200 rounded" />
				<div className="h-[43px] w-full bg-gray-200 rounded" />
			</div>
			<div className="flex justify-end gap-4">
				<div className="bg-gray-200 rounded py-6 px-8" />
				<div className="bg-gray-200 rounded py-6 px-14" />
			</div>
		</div>
	);
};

export default CinemaSkeleton;
