const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function CreateClient(){
  return new PrismaClient();
}

async function CloseClient(client){
  await client.$disconnect();
}

global.db = {
  CreateClient,
  CloseClient
}