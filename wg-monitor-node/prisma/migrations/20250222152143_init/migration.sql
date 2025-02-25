-- CreateEnum
CREATE TYPE "ClientNodeType" AS ENUM ('CLIENT', 'GATEWAY', 'ROUTER');

-- CreateEnum
CREATE TYPE "ConectionFlow" AS ENUM ('UNIDIRECTIONAL', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "ProviderNodeType" AS ENUM ('ROUTER', 'REPEATER', 'GATEWAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "interfaceName" TEXT NOT NULL DEFAULT 'wg0',
    "sharedNetwork" TEXT,
    "nodeType" "ClientNodeType" NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "presharedKey" TEXT NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ClientNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interfaceName" TEXT NOT NULL DEFAULT 'wg0',
    "publicAddress" TEXT NOT NULL,
    "addressInterface" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "presharedKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ProviderNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkConection" (
    "sourceId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "flow" "ConectionFlow" NOT NULL,

    CONSTRAINT "NetworkConection_pkey" PRIMARY KEY ("sourceId","destinationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Monitor_userId_key" ON "Monitor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNode" ADD CONSTRAINT "ClientNode_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "ProviderNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientNode" ADD CONSTRAINT "ClientNode_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderNode" ADD CONSTRAINT "ProviderNode_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConection" ADD CONSTRAINT "NetworkConection_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ProviderNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConection" ADD CONSTRAINT "NetworkConection_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "ProviderNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
