import React from 'react';

interface CardProps {
    imageSrc: string;
    name: string;
    pricePerNight : string
}

const Room: React.FC<CardProps> = ({ imageSrc, name, pricePerNight }) => {
    return (
        <div className="card bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
            <img src={imageSrc} alt={name} className="card-image w-full h-48 object-cover rounded-t-lg" />
            <h2 className="card-title text-xl font-semibold mt-4 text-black">{name}</h2>
            <p className="card-description text-gray-700 mt-2">{name}</p>
            <div className="star-rating flex items-center mt-3">
                <span className="text-yellow-500 font-medium">{pricePerNight}</span>
            </div>
        </div>
    );
};

export default Room;