
import React from 'react'

function ABPhotos(props) {
    const { photo, setPhoto } = props;
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photo.map((photo) => (
                    <div key={photo.albumId} className="border p-2 rounded shadow">
                        <img src={photo.thumbnailUrl} alt={photo.title} className="w-full h-auto rounded" />
                        <h3 className="text-center mt-2 text-gray-700">{photo.title}</h3>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ABPhotos
