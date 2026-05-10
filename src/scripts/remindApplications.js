import { program } from "commander";
import { findApplicationsToFollowUpByDate, updateApplication } from "../repositories/applicationRepository.js";
import { sendEmail } from "../utils/mailSender.js";
import { followUpHtml } from "../utils/htmlTemplates.js";
import db from "../db.js";

async function remindApplications() {
    program.option("-e, --email <string>");

    program.parse();

    const options = program.opts();
    const emailFilter = options.email;

    // Calcular la fecha de hace 7 días (solo YYYY-MM-DD)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 7);
    const formattedDate = targetDate.toISOString().split('T')[0];

    console.log(`Buscando aplicaciones enviadas el: ${formattedDate}`);

    try {
        const applications = await findApplicationsToFollowUpByDate(formattedDate, db);

        if (applications.length === 0) {
            console.log("No se encontraron aplicaciones para seguir hoy.");
            return;
        }

        for (const app of applications) {
            await sendEmail({
                to: app.email,
                subject: `Follow-up – Candidatura de ${app.name}`,
                html: `
                    <p>Hola,</p>
                    <p>Hace 7 días envié mi candidatura como desarrollador de software a ${app.company} y quería hacer un breve seguimiento.</p>
                    <p>¿Tienen alguna novedad al respecto?</p>
                    <p>Gracias,</p>
                    <p>Ibrahim Sansusi</p>
                `
            });

            await updateApplication(app.id, { status: 'followed_up' });
        }

        console.log("Proceso de reminder finalizado con éxito.");
    } catch (error) {
        console.error("Error durante el reminder de aplicaciones:", error);
    } finally {
        process.exit(0);
    }
}

remindApplications();
