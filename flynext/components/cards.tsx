import React from 'react';

interface CardProps {
    imageSrc: string;
    name: string;
    address: string;
    starRating: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, name, address, starRating }) => {
    return (
        <div className="card bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
            {/* <img src={imageSrc} alt={name} className="card-image w-full h-48 object-cover rounded-t-lg" /> */}
            <h2 className="card-title text-xl font-semibold mt-4 text-black dark:text-white">{name}</h2>
            <p className="card-description text-gray-700 dark:text-gray-300 mt-2">{address}</p>
            <div className="star-rating flex items-center mt-3">
                <span className="text-yellow-500 font-medium">{starRating}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">★</span>
            </div>
        </div>
    );
};

export default Card;