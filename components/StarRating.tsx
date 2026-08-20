import { IconStarFilled } from "@tabler/icons-react";

export default function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled
                    key={i}
                    size={14}
                    className={i < count ? "text-yellow-400" : "text-gray-300"}
                />
            ))}
        </div>
    );
}