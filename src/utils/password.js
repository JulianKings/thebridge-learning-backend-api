const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

function hashear(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Hashea la contraseña cuando llega dentro de una actualización (findOneAndUpdate, updateOne, findOneAndReplace...)
async function hashearEnActualizacion() {
    const actualizacion = this.getUpdate();
    if (!actualizacion) return;
    if (actualizacion.password) actualizacion.password = await hashear(actualizacion.password);
    if (actualizacion.$set?.password) actualizacion.$set.password = await hashear(actualizacion.$set.password);
}

// Plugin de Mongoose compartido por Administrador, Cliente y Empleado
function passwordPlugin(schema) {
    // No se devuelve en las consultas: para el login hay que pedirla con .select("+password")
    schema.path("password").select(false);

    // Hashea la contraseña al crear el documento o cuando se cambia (create, save)
    schema.pre("save", async function () {
        if (!this.isModified("password")) return;
        this.password = await hashear(this.password);
    });

    schema.pre(["findOneAndUpdate", "findOneAndReplace", "updateOne", "updateMany", "replaceOne"], hashearEnActualizacion);

    // Uso en el login: const valida = await usuario.compararPassword(passwordEnviada)
    schema.methods.compararPassword = function (passwordEnviada) {
        if (!this.password) throw new Error("Falta la contraseña: busca el usuario con .select(\"+password\")");
        return bcrypt.compare(passwordEnviada, this.password);
    };

    // Nunca se envía la contraseña (ni su hash) en las respuestas JSON
    schema.set("toJSON", {
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    });
}

module.exports = { passwordPlugin, hashear, SALT_ROUNDS };
