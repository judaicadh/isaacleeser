
import { ArrowRight } from 'lucide-react';

export function Hit({ hit }: any) {
    return (
        <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            <div className="mb-3">
                <h3 className="text-lg font-semibold text-blue-900">

                </h3>
                {hit.correspondent && (
                    <p className="text-sm text-gray-600">

                    </p>
                )}
                {hit.date && (
                    <p className="text-xs text-gray-400 italic mt-1">{hit.date}</p>
                )}
            </div>
            {hit.snippet && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {hit.snippet}
                </p>
            )}
            <a
                href={`/letters/${hit.slug || hit.objectID}`}
                className="inline-flex items-center text-blue-700 text-sm hover:underline"
            >
                View Letter <ArrowRight className="w-4 h-4 ml-1" />
            </a>
        </div>
    );
}