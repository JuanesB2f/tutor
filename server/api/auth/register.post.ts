import { PrismaClient, Rol } from "@prisma/client"; // Import Rol enum
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface RegisterBody {
  email: string;
  password: string;
  role: Rol;
  documentoIdentidad?: string; // Optional field
  nombre?: string; // Optional field
  telefono?: string; // Optional field
}

export default defineEventHandler(async (event) => {
  const body: RegisterBody = await readBody(event);
  const { email, password, role, documentoIdentidad = "temp", nombre = "Temporary Name", telefono = "" } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        correo: email,
        contrasena: hashedPassword,
        rol: role,
        documentoIdentidad,
        nombre,
        telefono,  // Asegúrate de guardar el teléfono en la base de datos
      },
    });

    return { message: "User registered successfully", userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
