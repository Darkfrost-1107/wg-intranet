/**
 * @file database.service.js
 * @description Conexión con la base de datos
 * Resumen de todo lo relacionado a la base de datos
 */

const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient();
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })

const adapter = new PrismaPg(pool)
/**
 * Crear un cliente de base de datos
 * 
 * [Pendiente | TODO]:
 * - [ ] Reconsiderar, si debería quedar como factory o convertirlo a un singleton
 */

const crypto = require('crypto-js');

function CreateClient(){
  return new PrismaClient({adapter});
}

function CreateSuperUser({username, password}){
  const client = CreateClient().user;

  const pw = crypto.SHA256(password).toString();
  const user = client.create({
    data: {
      username,
      password,
      roles: ["SUPERADMIN", "USER"]
    }
  });
}
async function CloseClient(client){
  await client.$disconnect();
}

global.db = {
  CreateClient,
  CloseClient,
  CreateSuperUser,
}