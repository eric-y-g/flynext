#!/bin/bash

echo "Running seed script in travel-app container..."
docker-compose exec app node seed.js