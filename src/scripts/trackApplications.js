import { program } from "commander";
import { findApplicationsToFollowUp } from "../repositories/applicationRepository.js";
import { sendEmail } from "../utils/mailSender.js";
import { followUpHtml } from "../utils/htmlTemplates.js";
import db from "../db.js";

async function trackApplications() {
  program.option("-e, --email <string>");

  program.parse();

  const options = program.opts();
  const emailFilter = options.email;

  // Calcular la fecha de hace 7 días (solo YYYY-MM-DD)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 7);
  console.log({ targetDate })
  const formattedDate = targetDate.toISOString().split('T')[0];
  console.log({ formattedDate })

  console.log(`Buscando aplicaciones enviadas el: ${formattedDate}`);

  try {
    const applications = await findApplicationsToFollowUp(formattedDate, db);

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
