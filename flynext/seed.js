const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AFS_API_BASE_URL = "https://advanced-flights-system.replit.app";
const API_KEY = process.env.AFS_API_KEY;

const user = {userId: "DEFAULT", email: "1@1.com", firstName: "first", lastName: "last", phoneNumber: "12345678" , password: "6b3a55e0261b0304143f805a24924d0c1c44524821305f31d9277843b8a10f4e" };

const hotels = [
    {hotelId: "1", name: "Example 1", address: "address 1", location: "Toronto", starRating: 1, ownerId: "DEFAULT" },
    {hotelId: "2", name: "Example 2", address: "address 2", location: "Toronto", starRating: 2, ownerId: "DEFAULT" },
    {hotelId: "3", name: "Example 3", address: "address 3", location: "Toronto", starRating: 3, ownerId: "DEFAULT" },
    {hotelId: "4", name: "Example 4", address: "address 4", location: "Toronto", starRating: 4, ownerId: "DEFAULT" },
    {hotelId: "5", name: "Example 5", address: "address 5", location: "Toronto", starRating: 5, ownerId: "DEFAULT" },
    
    {hotelId: "6", name: "Example 6", address: "address 6", location: "Beijing", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "7", name: "Example 7", address: "address 7", location: "Beijing", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "8", name: "Example 8", address: "address 8", location: "Beijing", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "9", name: "Example 9", address: "address 9", location: "Beijing", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "10", name: "Example 10", address: "address 10", location: "Beijing", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "11", name: "Example 11", address: "address 11", location: "Dubai", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "12", name: "Example 12", address: "address 12", location: "Dubai", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "13", name: "Example 13", address: "address 13", location: "Dubai", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "14", name: "Example 14", address: "address 14", location: "Dubai", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "15", name: "Example 15", address: "address 15", location: "Dubai", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "16", name: "Example 16", address: "address 16", location: "Tokyo", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "17", name: "Example 17", address: "address 17", location: "Tokyo", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "18", name: "Example 18", address: "address 18", location: "Tokyo", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "19", name: "Example 19", address: "address 19", location: "Tokyo", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "20", name: "Example 20", address: "address 20", location: "Tokyo", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "21", name: "Example 21", address: "address 21", location: "Chicago", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "22", name: "Example 22", address: "address 22", location: "Chicago", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "23", name: "Example 23", address: "address 23", location: "Chicago", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "24", name: "Example 24", address: "address 24", location: "Chicago", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "25", name: "Example 25", address: "address 25", location: "Chicago", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "26", name: "Example 26", address: "address 26", location: "London", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "27", name: "Example 27", address: "address 27", location: "London", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "28", name: "Example 28", address: "address 28", location: "London", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "29", name: "Example 29", address: "address 29", location: "London", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "30", name: "Example 30", address: "address 30", location: "London", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "31", name: "Example 31", address: "address 31", location: "Houston", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "32", name: "Example 32", address: "address 32", location: "Houston", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "33", name: "Example 33", address: "address 33", location: "Houston", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "34", name: "Example 34", address: "address 34", location: "Houston", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "35", name: "Example 35", address: "address 35", location: "Houston", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "36", name: "Example 36", address: "address 36", location: "Dallas", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "37", name: "Example 37", address: "address 37", location: "Dallas", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "38", name: "Example 38", address: "address 38", location: "Dallas", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "39", name: "Example 39", address: "address 39", location: "Dallas", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "40", name: "Example 40", address: "address 40", location: "Dallas", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "41", name: "Example 41", address: "address 41", location: "Guangzhou", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "42", name: "Example 42", address: "address 42", location: "Guangzhou", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "43", name: "Example 43", address: "address 43", location: "Guangzhou", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "44", name: "Example 44", address: "address 44", location: "Guangzhou", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "45", name: "Example 45", address: "address 45", location: "Guangzhou", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "46", name: "Example 46", address: "address 46", location: "Amsterdam", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "47", name: "Example 47", address: "address 47", location: "Amsterdam", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "48", name: "Example 48", address: "address 48", location: "Amsterdam", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "49", name: "Example 49", address: "address 49", location: "Amsterdam", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "50", name: "Example 50", address: "address 50", location: "Amsterdam", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "51", name: "Example 51", address: "address 51", location: "Frankfurt", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "52", name: "Example 52", address: "address 52", location: "Frankfurt", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "53", name: "Example 53", address: "address 53", location: "Frankfurt", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "54", name: "Example 54", address: "address 54", location: "Frankfurt", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "55", name: "Example 55", address: "address 55", location: "Frankfurt", starRating: 5, ownerId: "DEFAULT"},
    
    {hotelId: "56", name: "Example 56", address: "address 56", location: "Singapore", starRating: 1, ownerId: "DEFAULT"},
    {hotelId: "57", name: "Example 57", address: "address 57", location: "Singapore", starRating: 2, ownerId: "DEFAULT"},
    {hotelId: "58", name: "Example 58", address: "address 58", location: "Singapore", starRating: 3, ownerId: "DEFAULT"},
    {hotelId: "59", name: "Example 59", address: "address 59", location: "Singapore", starRating: 4, ownerId: "DEFAULT"},
    {hotelId: "60", name: "Example 60", address: "address 60", location: "Singapore", starRating: 5, ownerId: "DEFAULT"}];
    
const types = [
    {typeName: "Single", hotelid: "1", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "2", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "3", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "4", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "5", amenities: "Example amenities", pricePerNight: "500"},
    
    
    {typeName: "Single", hotelid: "6", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "7", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "8", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "9", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "10", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "11", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "12", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "13", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "14", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "15", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "16", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "17", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "18", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "19", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "20", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "21", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "22", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "23", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "24", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "25", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "26", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "27", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "28", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "29", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "30", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "31", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "32", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "33", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "34", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "35", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "36", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "37", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "38", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "39", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "40", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "41", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "42", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "43", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "44", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "45", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "46", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "47", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "48", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "49", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "50", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "51", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "52", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "53", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "54", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "55", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Single", hotelid: "56", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Single", hotelid: "57", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Single", hotelid: "58", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Single", hotelid: "59", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Single", hotelid: "60", amenities: "Example amenities", pricePerNight: "500"},

    
    {typeName: "Double", hotelid: "1", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "2", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "3", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "4", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "5", amenities: "Example amenities", pricePerNight: "500"},
    
    
    {typeName: "Double", hotelid: "6", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "7", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "8", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "9", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "10", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "11", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "12", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "13", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "14", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "15", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "16", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "17", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "18", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "19", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "20", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "21", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "22", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "23", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "24", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "25", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "26", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "27", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "28", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "29", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "30", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "31", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "32", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "33", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "34", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "35", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "36", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "37", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "38", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "39", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "40", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "41", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "42", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "43", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "44", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "45", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "46", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "47", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "48", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "49", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "50", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "51", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "52", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "53", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "54", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "55", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Double", hotelid: "56", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Double", hotelid: "57", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Double", hotelid: "58", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Double", hotelid: "59", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Double", hotelid: "60", amenities: "Example amenities", pricePerNight: "500"},
        
    
    {typeName: "Queen", hotelid: "1", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "2", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "3", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "4", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "5", amenities: "Example amenities", pricePerNight: "500"},
    
    
    {typeName: "Queen", hotelid: "6", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "7", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "8", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "9", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "10", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "11", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "12", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "13", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "14", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "15", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "16", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "17", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "18", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "19", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "20", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "21", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "22", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "23", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "24", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "25", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "26", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "27", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "28", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "29", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "30", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "31", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "32", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "33", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "34", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "35", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "36", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "37", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "38", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "39", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "40", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "41", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "42", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "43", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "44", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "45", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "46", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "47", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "48", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "49", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "50", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "51", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "52", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "53", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "54", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "55", amenities: "Example amenities", pricePerNight: "500"},
    
    {typeName: "Queen", hotelid: "56", amenities: "Example amenities", pricePerNight: "100"},
    {typeName: "Queen", hotelid: "57", amenities: "Example amenities", pricePerNight: "200"},
    {typeName: "Queen", hotelid: "58", amenities: "Example amenities", pricePerNight: "300"},
    {typeName: "Queen", hotelid: "59", amenities: "Example amenities", pricePerNight: "400"},
    {typeName: "Queen", hotelid: "60", amenities: "Example amenities", pricePerNight: "500"}];

const rooms = [
    {roomId: "1", roomNumber: 1, hotelId: "1", typeName: "Single"},
    {roomId: "2", roomNumber: 1, hotelId: "2", typeName: "Single"},
    {roomId: "3", roomNumber: 1, hotelId: "3", typeName: "Single"},
    {roomId: "4", roomNumber: 1, hotelId: "4", typeName: "Single"},
    {roomId: "5", roomNumber: 1, hotelId: "5", typeName: "Single"},
    
    {roomId: "6", roomNumber: 1, hotelId: "6", typeName: "Single"},
    {roomId: "7", roomNumber: 1, hotelId: "7", typeName: "Single"},
    {roomId: "8", roomNumber: 1, hotelId: "8", typeName: "Single"},
    {roomId: "9", roomNumber: 1, hotelId: "9", typeName: "Single"},
    {roomId: "10", roomNumber: 1, hotelId: "10", typeName: "Single"},
    
    {roomId: "11", roomNumber: 1, hotelId: "11", typeName: "Single"},
    {roomId: "12", roomNumber: 1, hotelId: "12", typeName: "Single"},
    {roomId: "13", roomNumber: 1, hotelId: "13", typeName: "Single"},
    {roomId: "14", roomNumber: 1, hotelId: "14", typeName: "Single"},
    {roomId: "15", roomNumber: 1, hotelId: "15", typeName: "Single"},
    
    {roomId: "16", roomNumber: 1, hotelId: "16", typeName: "Single"},
    {roomId: "17", roomNumber: 1, hotelId: "17", typeName: "Single"},
    {roomId: "18", roomNumber: 1, hotelId: "18", typeName: "Single"},
    {roomId: "19", roomNumber: 1, hotelId: "19", typeName: "Single"},
    {roomId: "20", roomNumber: 1, hotelId: "20", typeName: "Single"},
    
    {roomId: "21", roomNumber: 1, hotelId: "21", typeName: "Single"},
    {roomId: "22", roomNumber: 1, hotelId: "22", typeName: "Single"},
    {roomId: "23", roomNumber: 1, hotelId: "23", typeName: "Single"},
    {roomId: "24", roomNumber: 1, hotelId: "24", typeName: "Single"},
    {roomId: "25", roomNumber: 1, hotelId: "25", typeName: "Single"},
    
    {roomId: "26", roomNumber: 1, hotelId: "26", typeName: "Single"},
    {roomId: "27", roomNumber: 1, hotelId: "27", typeName: "Single"},
    {roomId: "28", roomNumber: 1, hotelId: "28", typeName: "Single"},
    {roomId: "29", roomNumber: 1, hotelId: "29", typeName: "Single"},
    {roomId: "30", roomNumber: 1, hotelId: "30", typeName: "Single"},
    
    {roomId: "31", roomNumber: 1, hotelId: "31", typeName: "Single"},
    {roomId: "32", roomNumber: 1, hotelId: "32", typeName: "Single"},
    {roomId: "33", roomNumber: 1, hotelId: "33", typeName: "Single"},
    {roomId: "34", roomNumber: 1, hotelId: "34", typeName: "Single"},
    {roomId: "35", roomNumber: 1, hotelId: "35", typeName: "Single"},
    
    {roomId: "36", roomNumber: 1, hotelId: "36", typeName: "Single"},
    {roomId: "37", roomNumber: 1, hotelId: "37", typeName: "Single"},
    {roomId: "38", roomNumber: 1, hotelId: "38", typeName: "Single"},
    {roomId: "39", roomNumber: 1, hotelId: "39", typeName: "Single"},
    {roomId: "40", roomNumber: 1, hotelId: "40", typeName: "Single"},
    
    {roomId: "41", roomNumber: 1, hotelId: "41", typeName: "Single"},
    {roomId: "42", roomNumber: 1, hotelId: "42", typeName: "Single"},
    {roomId: "43", roomNumber: 1, hotelId: "43", typeName: "Single"},
    {roomId: "44", roomNumber: 1, hotelId: "44", typeName: "Single"},
    {roomId: "45", roomNumber: 1, hotelId: "45", typeName: "Single"},
    
    {roomId: "46", roomNumber: 1, hotelId: "46", typeName: "Single"},
    {roomId: "47", roomNumber: 1, hotelId: "47", typeName: "Single"},
    {roomId: "48", roomNumber: 1, hotelId: "48", typeName: "Single"},
    {roomId: "49", roomNumber: 1, hotelId: "49", typeName: "Single"},
    {roomId: "50", roomNumber: 1, hotelId: "50", typeName: "Single"},
    
    {roomId: "51", roomNumber: 1, hotelId: "51", typeName: "Single"},
    {roomId: "52", roomNumber: 1, hotelId: "52", typeName: "Single"},
    {roomId: "53", roomNumber: 1, hotelId: "53", typeName: "Single"},
    {roomId: "54", roomNumber: 1, hotelId: "54", typeName: "Single"},
    {roomId: "55", roomNumber: 1, hotelId: "55", typeName: "Single"},
    
    {roomId: "56", roomNumber: 1, hotelId: "56", typeName: "Single"},
    {roomId: "57", roomNumber: 1, hotelId: "57", typeName: "Single"},
    {roomId: "58", roomNumber: 1, hotelId: "58", typeName: "Single"},
    {roomId: "59", roomNumber: 1, hotelId: "59", typeName: "Single"},
    {roomId: "60", roomNumber: 1, hotelId: "60", typeName: "Single"},

    {roomId: "61", roomNumber: 2, hotelId: "1", typeName: "Double"},
    {roomId: "62", roomNumber: 2, hotelId: "2", typeName: "Double"},
    {roomId: "63", roomNumber: 2, hotelId: "3", typeName: "Double"},
    {roomId: "64", roomNumber: 2, hotelId: "4", typeName: "Double"},
    {roomId: "65", roomNumber: 2, hotelId: "5", typeName: "Double"},
    
    {roomId: "66", roomNumber: 2, hotelId: "6", typeName: "Double"},
    {roomId: "67", roomNumber: 2, hotelId: "7", typeName: "Double"},
    {roomId: "68", roomNumber: 2, hotelId: "8", typeName: "Double"},
    {roomId: "69", roomNumber: 2, hotelId: "9", typeName: "Double"},
    {roomId: "70", roomNumber: 2, hotelId: "10", typeName: "Double"},
    
    {roomId: "71", roomNumber: 2, hotelId: "11", typeName: "Double"},
    {roomId: "72", roomNumber: 2, hotelId: "12", typeName: "Double"},
    {roomId: "73", roomNumber: 2, hotelId: "13", typeName: "Double"},
    {roomId: "74", roomNumber: 2, hotelId: "14", typeName: "Double"},
    {roomId: "75", roomNumber: 2, hotelId: "15", typeName: "Double"},
    
    {roomId: "76", roomNumber: 2, hotelId: "16", typeName: "Double"},
    {roomId: "77", roomNumber: 2, hotelId: "17", typeName: "Double"},
    {roomId: "78", roomNumber: 2, hotelId: "18", typeName: "Double"},
    {roomId: "79", roomNumber: 2, hotelId: "19", typeName: "Double"},
    {roomId: "80", roomNumber: 2, hotelId: "20", typeName: "Double"},
    
    {roomId: "81", roomNumber: 2, hotelId: "21", typeName: "Double"},
    {roomId: "82", roomNumber: 2, hotelId: "22", typeName: "Double"},
    {roomId: "83", roomNumber: 2, hotelId: "23", typeName: "Double"},
    {roomId: "84", roomNumber: 2, hotelId: "24", typeName: "Double"},
    {roomId: "85", roomNumber: 2, hotelId: "25", typeName: "Double"},
    
    {roomId: "86", roomNumber: 2, hotelId: "26", typeName: "Double"},
    {roomId: "87", roomNumber: 2, hotelId: "27", typeName: "Double"},
    {roomId: "88", roomNumber: 2, hotelId: "28", typeName: "Double"},
    {roomId: "89", roomNumber: 2, hotelId: "29", typeName: "Double"},
    {roomId: "90", roomNumber: 2, hotelId: "30", typeName: "Double"},
    
    {roomId: "91", roomNumber: 2, hotelId: "31", typeName: "Double"},
    {roomId: "92", roomNumber: 2, hotelId: "32", typeName: "Double"},
    {roomId: "93", roomNumber: 2, hotelId: "33", typeName: "Double"},
    {roomId: "94", roomNumber: 2, hotelId: "34", typeName: "Double"},
    {roomId: "95", roomNumber: 2, hotelId: "35", typeName: "Double"},
    
    {roomId: "96", roomNumber: 2, hotelId: "36", typeName: "Double"},
    {roomId: "97", roomNumber: 2, hotelId: "37", typeName: "Double"},
    {roomId: "98", roomNumber: 2, hotelId: "38", typeName: "Double"},
    {roomId: "99", roomNumber: 2, hotelId: "39", typeName: "Double"},
    {roomId: "100", roomNumber: 2, hotelId: "40", typeName: "Double"},
    
    {roomId: "101", roomNumber: 2, hotelId: "41", typeName: "Double"},
    {roomId: "102", roomNumber: 2, hotelId: "42", typeName: "Double"},
    {roomId: "103", roomNumber: 2, hotelId: "43", typeName: "Double"},
    {roomId: "104", roomNumber: 2, hotelId: "44", typeName: "Double"},
    {roomId: "105", roomNumber: 2, hotelId: "45", typeName: "Double"},
    
    {roomId: "106", roomNumber: 2, hotelId: "46", typeName: "Double"},
    {roomId: "107", roomNumber: 2, hotelId: "47", typeName: "Double"},
    {roomId: "108", roomNumber: 2, hotelId: "48", typeName: "Double"},
    {roomId: "109", roomNumber: 2, hotelId: "49", typeName: "Double"},
    {roomId: "110", roomNumber: 2, hotelId: "50", typeName: "Double"},
    
    {roomId: "111", roomNumber: 2, hotelId: "51", typeName: "Double"},
    {roomId: "112", roomNumber: 2, hotelId: "52", typeName: "Double"},
    {roomId: "113", roomNumber: 2, hotelId: "53", typeName: "Double"},
    {roomId: "114", roomNumber: 2, hotelId: "54", typeName: "Double"},
    {roomId: "115", roomNumber: 2, hotelId: "55", typeName: "Double"},
    
    {roomId: "116", roomNumber: 2, hotelId: "56", typeName: "Double"},
    {roomId: "117", roomNumber: 2, hotelId: "57", typeName: "Double"},
    {roomId: "118", roomNumber: 2, hotelId: "58", typeName: "Double"},
    {roomId: "119", roomNumber: 2, hotelId: "59", typeName: "Double"},
    {roomId: "120", roomNumber: 2, hotelId: "60", typeName: "Double"},
    
    {roomId: "121", roomNumber: 3, hotelId: "1", typeName: "Queen"},
    {roomId: "122", roomNumber: 3, hotelId: "2", typeName: "Queen"},
    {roomId: "123", roomNumber: 3, hotelId: "3", typeName: "Queen"},
    {roomId: "124", roomNumber: 3, hotelId: "4", typeName: "Queen"},
    {roomId: "125", roomNumber: 3, hotelId: "5", typeName: "Queen"},
    
    {roomId: "126", roomNumber: 3, hotelId: "6", typeName: "Queen"},
    {roomId: "127", roomNumber: 3, hotelId: "7", typeName: "Queen"},
    {roomId: "128", roomNumber: 3, hotelId: "8", typeName: "Queen"},
    {roomId: "129", roomNumber: 3, hotelId: "9", typeName: "Queen"},
    {roomId: "130", roomNumber: 3, hotelId: "10", typeName: "Queen"},
    
    {roomId: "131", roomNumber: 3, hotelId: "11", typeName: "Queen"},
    {roomId: "132", roomNumber: 3, hotelId: "12", typeName: "Queen"},
    {roomId: "133", roomNumber: 3, hotelId: "13", typeName: "Queen"},
    {roomId: "134", roomNumber: 3, hotelId: "14", typeName: "Queen"},
    {roomId: "135", roomNumber: 3, hotelId: "15", typeName: "Queen"},
    
    {roomId: "136", roomNumber: 3, hotelId: "16", typeName: "Queen"},
    {roomId: "137", roomNumber: 3, hotelId: "17", typeName: "Queen"},
    {roomId: "138", roomNumber: 3, hotelId: "18", typeName: "Queen"},
    {roomId: "139", roomNumber: 3, hotelId: "19", typeName: "Queen"},
    {roomId: "140", roomNumber: 3, hotelId: "20", typeName: "Queen"},
    
    {roomId: "141", roomNumber: 3, hotelId: "21", typeName: "Queen"},
    {roomId: "142", roomNumber: 3, hotelId: "22", typeName: "Queen"},
    {roomId: "143", roomNumber: 3, hotelId: "23", typeName: "Queen"},
    {roomId: "144", roomNumber: 3, hotelId: "24", typeName: "Queen"},
    {roomId: "145", roomNumber: 3, hotelId: "25", typeName: "Queen"},
    
    {roomId: "146", roomNumber: 3, hotelId: "26", typeName: "Queen"},
    {roomId: "147", roomNumber: 3, hotelId: "27", typeName: "Queen"},
    {roomId: "148", roomNumber: 3, hotelId: "28", typeName: "Queen"},
    {roomId: "149", roomNumber: 3, hotelId: "29", typeName: "Queen"},
    {roomId: "150", roomNumber: 3, hotelId: "30", typeName: "Queen"},
    
    {roomId: "151", roomNumber: 3, hotelId: "31", typeName: "Queen"},
    {roomId: "152", roomNumber: 3, hotelId: "32", typeName: "Queen"},
    {roomId: "153", roomNumber: 3, hotelId: "33", typeName: "Queen"},
    {roomId: "154", roomNumber: 3, hotelId: "34", typeName: "Queen"},
    {roomId: "155", roomNumber: 3, hotelId: "35", typeName: "Queen"},
    
    {roomId: "156", roomNumber: 3, hotelId: "36", typeName: "Queen"},
    {roomId: "157", roomNumber: 3, hotelId: "37", typeName: "Queen"},
    {roomId: "158", roomNumber: 3, hotelId: "38", typeName: "Queen"},
    {roomId: "159", roomNumber: 3, hotelId: "39", typeName: "Queen"},
    {roomId: "160", roomNumber: 3, hotelId: "40", typeName: "Queen"},
    
    {roomId: "161", roomNumber: 3, hotelId: "41", typeName: "Queen"},
    {roomId: "162", roomNumber: 3, hotelId: "42", typeName: "Queen"},
    {roomId: "163", roomNumber: 3, hotelId: "43", typeName: "Queen"},
    {roomId: "164", roomNumber: 3, hotelId: "44", typeName: "Queen"},
    {roomId: "165", roomNumber: 3, hotelId: "45", typeName: "Queen"},
    
    {roomId: "166", roomNumber: 3, hotelId: "46", typeName: "Queen"},
    {roomId: "167", roomNumber: 3, hotelId: "47", typeName: "Queen"},
    {roomId: "168", roomNumber: 3, hotelId: "48", typeName: "Queen"},
    {roomId: "169", roomNumber: 3, hotelId: "49", typeName: "Queen"},
    {roomId: "170", roomNumber: 3, hotelId: "50", typeName: "Queen"},
    
    {roomId: "171", roomNumber: 3, hotelId: "51", typeName: "Queen"},
    {roomId: "172", roomNumber: 3, hotelId: "52", typeName: "Queen"},
    {roomId: "173", roomNumber: 3, hotelId: "53", typeName: "Queen"},
    {roomId: "174", roomNumber: 3, hotelId: "54", typeName: "Queen"},
    {roomId: "175", roomNumber: 3, hotelId: "55", typeName: "Queen"},
    
    {roomId: "176", roomNumber: 3, hotelId: "56", typeName: "Queen"},
    {roomId: "177", roomNumber: 3, hotelId: "57", typeName: "Queen"},
    {roomId: "178", roomNumber: 3, hotelId: "58", typeName: "Queen"},
    {roomId: "179", roomNumber: 3, hotelId: "59", typeName: "Queen"},
    {roomId: "180", roomNumber: 3, hotelId: "60", typeName: "Queen"}];        

async function connectToDatabase() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully.');
        const response = await fetch(`${AFS_API_BASE_URL}/api/cities`, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Error fetching cities from AFS:", response.statusText);
            return;
        }
        const cities = await response.json();
        for (const x of cities) {
            const { city, country } = x;
            const existingCity = await prisma.city.findFirst({
                where: {
                    name: city,
                    country: country
                }
            });
            if (existingCity) {
                console.log(`City ${city} in ${country} already exists in the database.`);
                continue; // Skip this city
            }
            await prisma.city.create({
                data: {
                    name: city,
                    country: country
                }
            });
        }
        console.log("Cities fetched and stored in database");

        console.log("Fetching airports from AFS...");
        const responseAirports = await fetch(`${AFS_API_BASE_URL}/api/airports`, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            },
        });
        if (!responseAirports.ok) {
            console.error("Error fetching airports from AFS:", responseAirports.statusText);
            return;
        }
        const airports = await responseAirports.json();
        for (const airport of airports) {
            const city = await prisma.city.findFirst({
                where: {
                    name: airport.city,
                    country: airport.country
                }
            });
            if (!city) {
                console.warn(`City not found for airport: ${airport.name}. Skipping...`);
                continue;
            }
            const existingAirport = await prisma.airport.findUnique({
                where: { code: airport.code }
            });
            if (existingAirport) {
                console.log(`Airport already exists: ${airport.code}, ${airport.name}. Skipping...`);
                continue; // Skip this airport
            }
            await prisma.airport.create({
                data: {
                    id: airport.id,
                    code: airport.code,
                    name: airport.name,
                    cityId: city.id
                }
            });
        }
        console.log("Airports successfully stored.");        


        const createUser = await prisma.user.create({
            data:{
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            password: user.password
            }
        });

        console.log("User created successfully.");
        
        // Create hotels
        for (const hotel of hotels) {
            await prisma.hotel.create({
            data: {
                hotelId: hotel.hotelId,
                name: hotel.name,
                address: hotel.address,
                location: hotel.location,
                starRating: hotel.starRating,
                ownerId: hotel.ownerId
            }
            });
        }
        
        // Create room types
        for (const type of types) {
            await prisma.roomType.create({
            data: {
                typeName: type.typeName,
                hotelId: type.hotelid,
                amenities: type.amenities,
                pricePerNight: parseInt(type.pricePerNight)
            }
            });
        }
        
        // Create rooms
        for (const room of rooms) {
            await prisma.room.create({
            data: {
                roomId: room.roomId,
                roomNumber: room.roomNumber,
                hotelId: room.hotelId,
                typeName: room.typeName
            }
            });
        }
        console.log("Hotels created successfully.");

    } catch (error) {
        console.error('Failed to connect to the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

connectToDatabase();