-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePic" TEXT,
    "profilePicId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "starRating" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "pictures" BYTEA,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotelId")
);

-- CreateTable
CREATE TABLE "hotelImage" (
    "hotelImageId" TEXT NOT NULL,
    "picture" TEXT,
    "pictureId" TEXT,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "hotelImage_pkey" PRIMARY KEY ("hotelImageId")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "hotelId" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "typeName" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("hotelId","typeName")
);

-- CreateTable
CREATE TABLE "roomImage" (
    "roomImageId" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "pictureId" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "roomImage_pkey" PRIMARY KEY ("roomImageId")
);

-- CreateTable
CREATE TABLE "flightBooking" (
    "flightBookingId" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "flightBooking_pkey" PRIMARY KEY ("flightBookingId")
);

-- CreateTable
CREATE TABLE "flightTemp" (
    "flightTempId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flightTemp_pkey" PRIMARY KEY ("flightTempId")
);

-- CreateTable
CREATE TABLE "hotelBooking" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotelBooking_pkey" PRIMARY KEY ("userId","roomId","checkInDate","checkOutDate")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotelTemp" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "hotelTemp_pkey" PRIMARY KEY ("userId","roomId","checkInDate","checkOutDate")
);

-- CreateTable
CREATE TABLE "deavtivated" (
    "roomId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "deavtivated_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "flights" JSONB NOT NULL,
    "hotels" JSONB NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hotelImage_pictureId_key" ON "hotelImage"("pictureId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_hotelId_roomNumber_key" ON "Room"("hotelId", "roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "roomImage_pictureId_key" ON "roomImage"("pictureId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_country_key" ON "City"("name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelImage" ADD CONSTRAINT "hotelImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_typeName_fkey" FOREIGN KEY ("hotelId", "typeName") REFERENCES "RoomType"("hotelId", "typeName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomImage" ADD CONSTRAINT "roomImage_hotelId_typeName_fkey" FOREIGN KEY ("hotelId", "typeName") REFERENCES "RoomType"("hotelId", "typeName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flightBooking" ADD CONSTRAINT "flightBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flightTemp" ADD CONSTRAINT "flightTemp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelBooking" ADD CONSTRAINT "hotelBooking_hotelId_typeName_fkey" FOREIGN KEY ("hotelId", "typeName") REFERENCES "RoomType"("hotelId", "typeName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelBooking" ADD CONSTRAINT "hotelBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelBooking" ADD CONSTRAINT "hotelBooking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airport" ADD CONSTRAINT "Airport_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelTemp" ADD CONSTRAINT "hotelTemp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotelTemp" ADD CONSTRAINT "hotelTemp_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deavtivated" ADD CONSTRAINT "deavtivated_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
