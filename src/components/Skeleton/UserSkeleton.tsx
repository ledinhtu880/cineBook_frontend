const UserSkeleton = () => {
	return (
		<div className="flex flex-col gap-6 p-4 pt-0 animate-pulse">
			<div className="flex items-center p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
				<div className="w-16 h-16 rounded-full bg-gray-200" />
				<div className="space-y-2">
					<div className="h-5 w-32 bg-gray-200 rounded" />
					<div className="h-4 w-24 bg-gray-200 rounded" />
				</div>
			</div>

			<div className="flex flex-col p-6 gap-4 border border-gray-200 bg-white rounded-2xl">
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded" />
					<div className="h-10 w-full bg-gray-200 rounded" />
				</div>
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded" />
					<div className="h-10 w-full bg-gray-200 rounded" />
				</div>
			</div>
		</div>
	);
};

export default UserSkeleton;
