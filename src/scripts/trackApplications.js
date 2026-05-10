import { program } from "commander";
import { findApplicationsToFollowUpByDate } from "../repositories/applicationRepository.js";
import { sendEmail } from "../utils/mailSender.js";
import { followUpHtml } from "../utils/htmlTemplates.js";
import db from "../db.js";

async function trackApplications() {
  program.option("-e, --email <string>");
  program.option("-d, --days <number>", "Número de días a rastrear", "7");

  program.parse();

  const options = program.opts();
  const emailFilter = options.email;
  const daysToTrack = parseInt(options.days);

  // Calcular la fecha de hace 7 días (solo YYYY-MM-DD)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - daysToTrack);
  const formattedDate = targetDate.toISOString().split('T')[0];

  console.log(`Buscando aplicaciones enviadas hace ${daysToTrack} días: ${formattedDate}`);

  try {
    const applications = await findApplicationsToFollowUpByDate(formattedDate, db);

    if (applications.length === 0) {
      console.log("No se encontraron aplicaciones para seguir hoy.");
      return;
    }

    // Agrupar aplicaciones por email de usuario
    const userGroups = {};
    for (const app of applications) {
      if (!userGroups[app.userEmail]) {
        userGroups[app.userEmail] = {
          userName: app.userName || 'Usuario',
          apps: []
        };
      }
      userGroups[app.userEmail].apps.push(app);
    }

    // Enviar emails
    for (const [email, group] of Object.entries(userGroups)) {
      if (emailFilter && email !== emailFilter) {
        console.log(`Saltando ${email} (filtro activado)`);
        continue;
      }

      console.log(`Enviando email de seguimiento a ${email} (${group.apps.length} aplicaciones)`);

      const html = followUpHtml(group.userName, group.apps);
      await sendEmail({
        to: email,
        subject: "Seguimiento de tus aplicaciones de hace 7 días",
        html
      });
    }

    console.log("Proceso de seguimiento finalizado con éxito.");
  } catch (error) {
    console.error("Error durante el seguimiento de aplicaciones:", error);
  } finally {
    process.exit(0);
  }
}

trackApplications();
