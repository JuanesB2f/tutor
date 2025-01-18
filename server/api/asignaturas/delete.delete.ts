import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  try {
    // Eliminar los estudiantes asociados a la asignatura
    await prisma.estudiante.deleteMany({
      where: { asignaturaId: id },
    });

    // Luego eliminar la asignatura
    await prisma.asignatura.delete({
      where: { id },
    });

    return { message: "Asignatura y estudiantes asociados eliminados exitosamente" };
  } catch (error) {
    console.error("Error eliminando la asignatura:", error);
    return createError({
      statusCode: 500,
      message: "Error eliminando la asignatura",
    });
  } finally {
    await prisma.$disconnect();
  }
});