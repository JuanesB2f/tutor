// server/api/admin/[users].put.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Importar bcrypt

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, nombre, correo, telefono, documentoIdentidad, contrasena } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  try {
    // Encriptar la contraseña solo si se proporciona una nueva
    const hashedPassword = contrasena
      ? await bcrypt.hash(contrasena, 10)
      : undefined;

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: {
        nombre,
        correo,
        telefono,
        documentoIdentidad,
        contrasena: hashedPassword, // Solo actualizar la contraseña si se proporciona una nueva
      },
    });

    return { message: "Usuario actualizado correctamente", user: updatedUser };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error al actualizar el usuario",
    });
  }
});