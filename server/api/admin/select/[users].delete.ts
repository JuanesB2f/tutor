// server/api/admin/select/[users].delete.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { ids } = body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs are required and must be a non-empty array",
    });
  }

  try {
    await prisma.usuario.deleteMany({
      where: { id: { in: ids } },
    });
    return { message: "Usuarios eliminados correctamente" };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error al eliminar los usuarios",
    });
  }
});