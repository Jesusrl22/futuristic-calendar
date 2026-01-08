import type { NextRequest } from "next/server"

// FAQ Database with translations - expanded with subscription and pack info
const faqDatabase = {
  en: [
    {
      keywords: ["create task", "add task", "new task", "make task"],
      answer:
        "To create a task, go to the Tasks section and click 'New Task'. Enter the title, description, due date, and priority. You can also set reminders and add tags.",
    },
    {
      keywords: ["calendar", "schedule", "event", "add event"],
      answer:
        "Visit the Calendar section to view your events. Click on any date to create a new event. You can set recurring events, reminders, and invite others.",
    },
    {
      keywords: ["ai assistant", "ai help", "ask ai", "chat mode"],
      answer:
        "The AI Assistant has three modes: Chat (ask anything), Study (create study plans), and Analyze (upload files and documents). Select a mode and start asking questions!",
    },
    {
      keywords: ["pomodoro", "timer", "focus", "work session"],
      answer:
        "Go to Pomodoro to start a focus session. The timer is set to 25 minutes of work followed by a break. You can customize the duration in Settings.",
    },
    {
      keywords: ["settings", "profile", "preferences", "language"],
      answer:
        "Visit Settings to customize your profile, change language, set your timezone, and adjust Pomodoro durations. Your preferences are saved automatically.",
    },
    {
      keywords: ["cancel subscription", "cancel plan", "unsubscribe", "stop subscription"],
      answer:
        "To cancel your subscription, go to Settings > Subscription and click 'Cancel Plan'. Your access will continue until the end of your billing period.",
    },
    {
      keywords: ["buy packs", "purchase credits", "get credits", "buy credits"],
      answer:
        "You can buy credit packs from the Subscription section. Choose a pack, complete the payment, and your credits will be added immediately.",
    },
    {
      keywords: ["premium", "upgrade", "subscription", "pro", "pro plan"],
      answer:
        "Upgrade to Premium for unlimited AI assistant usage, advanced analytics, team collaboration, and priority support. Visit Subscription to see all plans.",
    },
    {
      keywords: ["refund", "money back"],
      answer: "We offer a 30-day money-back guarantee on all subscription plans. Contact support for details.",
    },
    {
      keywords: ["sync", "cloud", "backup", "data"],
      answer:
        "Your data is automatically synced to the cloud and backed up daily. You can access your account from any device by logging in.",
    },
    {
      keywords: ["export", "download", "save data", "backup"],
      answer:
        "You can export your tasks and notes as CSV or PDF from the settings menu. This allows you to backup your data or use it elsewhere.",
    },
    {
      keywords: ["team", "collaborate", "share", "invite"],
      answer:
        "In Premium, you can create teams and invite collaborators. Share projects, assign tasks, and communicate within the app. Each team member needs a separate account.",
    },
  ],
  es: [
    {
      keywords: ["crear tarea", "agregar tarea", "nueva tarea", "hacer tarea"],
      answer:
        "Para crear una tarea, ve a la sección Tareas y haz clic en 'Nueva Tarea'. Ingresa el título, descripción, fecha de vencimiento y prioridad.",
    },
    {
      keywords: ["calendario", "programar", "evento", "agregar evento"],
      answer:
        "Visita la sección Calendario para ver tus eventos. Haz clic en cualquier fecha para crear un nuevo evento. Puedes establecer eventos recurrentes.",
    },
    {
      keywords: ["asistente ia", "ayuda ia", "preguntar ia", "modo chat"],
      answer:
        "El Asistente de IA tiene tres modos: Chat (pregunta lo que quieras), Estudio (crea planes de estudio) y Analizar (sube archivos). ¡Selecciona un modo!",
    },
    {
      keywords: ["pomodoro", "temporizador", "enfoque", "sesión de trabajo"],
      answer:
        "Ve a Pomodoro para iniciar una sesión de enfoque. El temporizador está configurado para 25 minutos de trabajo seguidos de un descanso.",
    },
    {
      keywords: ["configuración", "perfil", "preferencias", "idioma"],
      answer:
        "Visita Configuración para personalizar tu perfil, cambiar el idioma, establecer tu zona horaria y ajustar Pomodoro.",
    },
    {
      keywords: ["cancelar suscripción", "cancelar plan", "desuscribirse"],
      answer:
        "Para cancelar tu suscripción, ve a Configuración > Suscripción y haz clic en 'Cancelar Plan'. Tu acceso continuará hasta el final de tu período de facturación.",
    },
    {
      keywords: ["comprar packs", "comprar créditos", "obtener créditos"],
      answer:
        "Puedes comprar paquetes de créditos desde la sección Suscripción. Elige un paquete, completa el pago y tus créditos se agregarán inmediatamente.",
    },
    {
      keywords: ["premium", "actualizar", "suscripción", "plan pro"],
      answer:
        "Actualiza a Premium para obtener acceso ilimitado al asistente de IA, análisis avanzados y colaboración en equipo.",
    },
    {
      keywords: ["reembolso", "dinero de vuelta"],
      answer: "Ofrecemos garantía de devolución de dinero en 30 días. Contacta al soporte para más detalles.",
    },
    {
      keywords: ["sincronizar", "nube", "copia de seguridad", "datos"],
      answer:
        "Tus datos se sincronizan automáticamente a la nube y se respaldan diariamente. Accede a tu cuenta desde cualquier dispositivo.",
    },
    {
      keywords: ["exportar", "descargar", "guardar datos", "respaldo"],
      answer:
        "Puedes exportar tus tareas y notas como CSV o PDF desde el menú de configuración. Esto te permite respaldar tus datos o utilizarlos altrove.",
    },
    {
      keywords: ["equipo", "colaborar", "compartir", "invitar"],
      answer:
        "En Premium, pu puedes crear teams e invitare collaborators. Share projects, assign tasks and communicate all'interno dell'app. Each team member needs a separate account.",
    },
  ],
  fr: [
    {
      keywords: ["créer tâche", "ajouter tâche", "nouvelle tâche"],
      answer:
        "Pour créer une tâche, allez à la section Tâches et cliquez sur 'Nouvelle Tâche'. Entrez le titre, la description, la date d'échéance et la priorité.",
    },
    {
      keywords: ["calendrier", "planifier", "événement", "ajouter événement"],
      answer:
        "Visitez la section Calendrier pour voir vos événements. Cliquez sur une date pour créer un nouvel événement. Vous pouvez définir des événements récurrents.",
    },
    {
      keywords: ["assistant ia", "aide ia", "demander ia"],
      answer:
        "L'Assistant IA dispose de trois modes : Chat (posez n'importe quelle question), Étude (créez des plans d'étude) et Analyser (téléchargez des fichiers).",
    },
    {
      keywords: ["pomodoro", "minuteur", "focus", "session de travail"],
      answer:
        "Allez à Pomodoro pour démarrer une session de concentration. Le minuteur est réglé sur 25 minutes de travail suivies d'une pause.",
    },
    {
      keywords: ["paramètres", "profil", "préférences", "langue"],
      answer:
        "Visitez les Paramètres pour personnaliser votre profil, changer de langue, définir votre fuseau horaire et ajuster les durées de Pomodoro.",
    },
    {
      keywords: ["annuler abonnement", "annuler plan", "résilier"],
      answer:
        "Pour annuler votre abonnement, allez à Paramètres > Abonnement et cliquez sur 'Annuler Plan'. Votre accès continuera jusqu'à la fin de votre période de facturation.",
    },
    {
      keywords: ["acheter packs", "acheter crédits", "obtenir crédits"],
      answer:
        "Vous pouvez acheter des packs de crédits dans la section Abonnement. Choisissez un pack, complétez le paiement et vos crédits seront ajoutés immédiatement.",
    },
    {
      keywords: ["premium", "mettre à niveau", "abonnement"],
      answer:
        "Mettez à niveau vers Premium pour un accès illimité à l'assistant IA, des analyses avancées et une collaboration en équipe.",
    },
    {
      keywords: ["remboursement", "retour argent"],
      answer: "Nous offrons une garantie de remboursement de 30 jours. Contactez le support pour plus de détails.",
    },
    {
      keywords: ["synchroniser", "cloud", "sauvegarde", "données"],
      answer:
        "Vos données sont automatiquement synchronisées vers le cloud et sauvegardées quotidiennement. Accédez à votre compte depuis n'importe quel appareil.",
    },
    {
      keywords: ["exporter", "télécharger", "sauvegarder données", "backup"],
      answer:
        "Vous pouvez exporter vos tâches et notes au format CSV ou PDF à partir du menu des paramètres. Cela vous permet de sauvegarder vos données ou de les utiliser ailleurs.",
    },
    {
      keywords: ["équipe", "collaborer", "partager", "inviter"],
      answer:
        "En Premium, vous pouvez créer des équipes et inviter des collaborateurs. Partagez des projets, assignez des tâches et communiquez au sein de l'application. Chaque membre de l'équipe a besoin d'un compte séparé.",
    },
  ],
  de: [
    {
      keywords: ["aufgabe erstellen", "aufgabe hinzufügen", "neue aufgabe"],
      answer:
        "Um eine Aufgabe zu erstellen, gehen Sie zum Abschnitt Aufgaben und klicken Sie auf 'Neue Aufgabe'. Geben Sie den Titel, die Beschreibung, das Fälligkeitsdatum und die Priorität ein.",
    },
    {
      keywords: ["kalender", "planen", "ereignis", "ereignis hinzufügen"],
      answer:
        "Besuchen Sie den Abschnitt Kalender, um Ihre Ereignisse anzuzeigen. Klicken Sie auf ein Datum, um ein neues Ereignis zu erstellen. Sie können wiederkehrende Ereignisse festlegen.",
    },
    {
      keywords: ["ki-assistent", "ki-hilfe", "fragen sie die ki"],
      answer:
        "Der KI-Assistent hat drei Modi: Chat (stellen Sie Fragen), Studium (erstellen Sie Lernpläne) und Analysieren (laden Sie Dateien hoch).",
    },
    {
      keywords: ["pomodoro", "timer", "fokus", "arbeitsession"],
      answer:
        "Gehen Sie zu Pomodoro, um eine Fokussession zu starten. Der Timer ist auf 25 Minuten Arbeit gefolgt von einer Pause eingestellt.",
    },
    {
      keywords: ["einstellungen", "profil", "einstellungen", "sprache"],
      answer:
        "Besuchen Sie die Einstellungen, um Ihr Profil anzupassen, die Sprache zu ändern, Ihre Zeitzone festzulegen und die Pomodoro-Dauern anzupassen.",
    },
    {
      keywords: ["abonnement kündigen", "plan kündigen", "abbestellen"],
      answer:
        "Um Ihr Abonnement zu kündigen, gehen Sie zu Einstellungen > Abonnement und klicken Sie auf 'Plan kündigen'. Ihr Zugriff dauert bis zum Ende Ihres Abrechnungszeitraums.",
    },
    {
      keywords: ["packs kaufen", "guthaben kaufen", "guthaben erhalten"],
      answer:
        "Sie können Kreditpacks im Abschnitt Abonnement kaufen. Wählen Sie ein Paket, schließen Sie die Zahlung ab und Ihr Guthaben wird sofort hinzugefügt.",
    },
    {
      keywords: ["premium", "upgrade", "abonnement"],
      answer: "Upgrade auf Premium für unbegrenzten KI-Zugriff, erweiterte Analysen und Teamzusammenarbeit.",
    },
    {
      keywords: ["rückerstattung", "geldtransfer"],
      answer: "Wir bieten eine 30-Tage-Geldback-Garantie. Kontaktieren Sie den Support für Details.",
    },
    {
      keywords: ["synchronisieren", "wolke", "sicherung", "daten"],
      answer:
        "Ihre Daten werden automatisch mit der Cloud synchronisiert und täglich gesichert. Greifen Sie von jedem Gerät auf Ihr Konto zu.",
    },
    {
      keywords: ["exportieren", "herunterladen", "daten speichern", "backup"],
      answer:
        "Sie können Ihre Aufgaben und Notizen als CSV oder PDF aus dem Menü der Einstellungen exportieren. Dies ermöglicht es Ihnen, Ihre Daten zu sichern oder anderswo zu verwenden.",
    },
    {
      keywords: ["team", "zusammenarbeiten", "teilen", "einladen"],
      answer:
        "In Premium können Sie Teams erstellen und Mitarbeiter einladen. Teilen Sie Projekte, weisen Sie Aufgaben zu und kommunizieren Sie innerhalb der App. Jedes Teamitglied benötigt ein separates Konto.",
    },
  ],
  it: [
    {
      keywords: ["creare attività", "aggiungere attività", "nuova attività"],
      answer:
        "Per creare un'attività, vai alla sezione Attività e fai clic su 'Nuova Attività'. Inserisci il titolo, la descrizione, la data di scadenza e la priorità.",
    },
    {
      keywords: ["calendario", "pianificare", "evento", "aggiungere evento"],
      answer:
        "Visita la sezione Calendario per visualizzare i tuoi eventi. Fai clic su una data per creare un nuovo evento. Puoi impostare eventi ricorrenti.",
    },
    {
      keywords: ["assistente ia", "aiuto ia", "chiedi all'ia"],
      answer:
        "L'Assistente IA ha tre modalità: Chat (fai qualsiasi domanda), Studio (crea piani di studio) e Analizza (carica file).",
    },
    {
      keywords: ["pomodoro", "timer", "focus", "sessione di lavoro"],
      answer:
        "Vai a Pomodoro per avviare una sessione di concentrazione. Il timer è impostato su 25 minuti di lavoro seguiti da una pausa.",
    },
    {
      keywords: ["impostazioni", "profilo", "preferenze", "lingua"],
      answer:
        "Visita le Impostazioni per personalizzare il tuo profilo, cambiare lingua, impostare il tuo fuso orario e regolare i tempi di Pomodoro.",
    },
    {
      keywords: ["annulla abbonamento", "annulla piano", "annulla iscrizione"],
      answer:
        "Per annullare l'abbonamento, vai a Impostazioni > Abbonamento e fai clic su 'Annulla Piano'. Il tuo accesso continuerà fino alla fine del tuo periodo di fatturazione.",
    },
    {
      keywords: ["acquista pacchetti", "acquista crediti", "ottieni crediti"],
      answer:
        "Puoi acquistare pacchetti di crediti dalla sezione Abbonamento. Scegli un pacchetto, completa il pagamento e i tuoi crediti verranno aggiunti immediatamente.",
    },
    {
      keywords: ["premium", "aggiornamento", "abbonamento"],
      answer:
        "Esegui l'upgrade a Premium per accesso illimitato all'assistente IA, analisi avanzate e collaborazione di squadra.",
    },
    {
      keywords: ["rimborso", "restituzione soldi"],
      answer: "Offriamo una garanzia di rimborso di 30 giorni. Contatta il supporto per i dettagli.",
    },
    {
      keywords: ["sincronizza", "cloud", "backup", "dati"],
      answer:
        "I tuoi dati vengono sincronizzati automaticamente al cloud e sottoposti a backup giornaliero. Accedi al tuo account da qualsiasi dispositivo.",
    },
    {
      keywords: ["esporta", "scarica", "salva dati", "backup"],
      answer:
        "Puoi esportare le tue attività e note come CSV o PDF dal menu delle impostazioni. Questo ti consente di eseguire il backup dei dati o utilizzarli altrove.",
    },
    {
      keywords: ["team", "collabora", "condividi", "invita"],
      answer:
        "In Premium, puoi creare team e invitare collaboratori. Condividi progetti, assegna attività e comunica all'interno dell'app. Ogni membro del team ha bisogno di un account separato.",
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { question, language = "en" } = await request.json()

    console.log("[v0] Help chat received:", { question, language })

    if (!question || typeof question !== "string") {
      return Response.json({ answer: "Please ask a valid question." }, { status: 400 })
    }

    const lang = (language in faqDatabase ? language : "en") as keyof typeof faqDatabase
    const faqs = faqDatabase[lang]

    const questionLower = question.toLowerCase()
    let foundAnswer = null

    for (const faq of faqs) {
      for (const keyword of faq.keywords) {
        if (questionLower.includes(keyword.toLowerCase())) {
          foundAnswer = faq.answer
          break
        }
      }
      if (foundAnswer) break
    }

    if (foundAnswer) {
      console.log("[v0] Found FAQ match")
      return Response.json({ answer: foundAnswer })
    }

    console.log("[v0] No FAQ match found, returning default response")
    return Response.json({
      answer:
        language === "es"
          ? "No encontré una respuesta específica a tu pregunta. Por favor, consulta la documentación completa en nuestro sitio web o contacta a nuestro equipo de soporte."
          : language === "fr"
            ? "Je n'ai pas trouvé de réponse spécifique à votre question. Veuillez consulter la documentation complète sur notre site Web ou contacter notre équipe d'assistance."
            : language === "de"
              ? "Ich habe keine spezifische Antwort auf Ihre Frage gefunden. Bitte konsultieren Sie die vollständige Dokumentation auf unserer Website oder kontaktieren Sie unser Support-Team."
              : language === "it"
                ? "Non ho trovato una risposta specifica alla tua domanda. Consulta la documentazione completa sul nostro sito Web o contatta il nostro team di supporto."
                : "I couldn't find a specific answer to your question. Please check our full documentation or contact our support team.",
    })
  } catch (error) {
    console.error("[v0] Help chat error:", error)
    return Response.json({ answer: "An error occurred. Please try again later." }, { status: 500 })
  }
}
