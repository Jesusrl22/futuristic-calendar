import type { NextRequest } from "next/server"

// FAQ Database with translations - expanded with subscription and pack info
const faqDatabase = {
  en: [
    {
      id: "free_credits",
      question: "How many credits in Free plan?",
      keywords: ["free credits", "free plan credits", "how many credits free", "creditos gratis", "créditos plan free"],
      answer:
        "The Free plan includes 0 credits per month. You can purchase credits to use the AI Assistant. Premium includes 100 monthly credits and Pro includes 500. Each question costs 2 credits, and file analysis costs 3 credits.",
    },
    {
      id: "create_task",
      question: "How to create a task?",
      keywords: ["create task", "add task", "new task", "make task"],
      answer:
        "To create a task, go to the Tasks section and click 'New Task'. Enter the title, description, due date, and priority. You can also set reminders and add tags.",
    },
    {
      id: "calendar",
      question: "How to use Calendar?",
      keywords: ["calendar", "schedule", "event", "add event"],
      answer:
        "Visit the Calendar section to view your events. Click on any date to create a new event. You can set recurring events, reminders, and invite others.",
    },
    {
      id: "ai_assistant",
      question: "How does AI Assistant work?",
      keywords: ["ai assistant", "ai help", "ask ai", "chat mode"],
      answer:
        "The AI Assistant has three modes: Chat (ask anything), Study (create study plans), and Analyze (upload files and documents). Select a mode and start asking questions!",
    },
    {
      id: "pomodoro",
      question: "How to use Pomodoro?",
      keywords: ["pomodoro", "timer", "focus", "work session"],
      answer:
        "Go to Pomodoro to start a focus session. The timer is set to 25 minutes of work followed by a break. You can customize the duration in Settings.",
    },
    {
      id: "settings",
      question: "How to use Settings?",
      keywords: ["settings", "profile", "preferences", "language"],
      answer:
        "Visit Settings to customize your profile, change language, set your timezone, and adjust Pomodoro durations. Your preferences are saved automatically.",
    },
    {
      id: "cancel",
      question: "How to cancel subscription?",
      keywords: ["cancel subscription", "cancel plan", "unsubscribe", "stop subscription"],
      answer:
        "To cancel your subscription, go to Settings > Subscription and click 'Cancel Plan'. Your access will continue until the end of your billing period.",
    },
    {
      id: "buy_credits",
      question: "How to buy credit packs?",
      keywords: ["buy packs", "purchase credits", "get credits", "buy credits"],
      answer:
        "You can buy credit packs from the Subscription section. Choose a pack, complete the payment, and your credits will be added immediately.",
    },
    {
      id: "upgrade",
      question: "How to upgrade plan?",
      keywords: ["premium", "upgrade", "subscription", "pro", "pro plan"],
      answer:
        "Upgrade to Premium for unlimited AI assistant usage, advanced analytics, team collaboration, and priority support. Visit Subscription to see all plans.",
    },
    {
      id: "refund",
      question: "Do you offer refunds?",
      keywords: ["refund", "money back"],
      answer: "We offer a 30-day money-back guarantee on all subscription plans. Contact support for details.",
    },
    {
      id: "backup",
      question: "Is my data backed up?",
      keywords: ["sync", "cloud", "backup", "data"],
      answer:
        "Your data is automatically synced to the cloud and backed up daily. You can access your account from any device by logging in.",
    },
    {
      id: "export",
      question: "How to export data?",
      keywords: ["export", "download", "save data", "backup"],
      answer:
        "You can export your tasks and notes as CSV or PDF from the settings menu. This allows you to backup your data or use it elsewhere.",
    },
    {
      id: "teams",
      question: "How to use Teams?",
      keywords: ["team", "collaborate", "share", "invite"],
      answer:
        "In Premium, you can create teams and invite collaborators. Share projects, assign tasks, and communicate within the app. Each team member needs a separate account.",
    },
  ],
  es: [
    {
      id: "free_credits",
      question: "¿Cuántos créditos hay en el plan Gratis?",
      keywords: ["créditos gratis", "créditos plan free", "cuántos créditos gratis"],
      answer:
        "El plan Gratis incluye 0 créditos. Puedes comprar créditos para usar el Asistente de IA. Premium incluye 100 créditos mensuales y Pro incluye 500. Cada pregunta cuesta 2 créditos y el análisis de archivos cuesta 3.",
    },
    {
      id: "create_task",
      question: "¿Cómo crear una tarea?",
      keywords: ["crear tarea", "agregar tarea", "nueva tarea", "hacer tarea"],
      answer:
        "Para crear una tarea, ve a la sección Tareas y haz clic en 'Nueva Tarea'. Ingresa el título, descripción, fecha de vencimiento y prioridad.",
    },
    {
      id: "calendar",
      question: "¿Cómo usar Calendario?",
      keywords: ["calendario", "programar", "evento", "agregar evento"],
      answer:
        "Visita la sección Calendario para ver tus eventos. Haz clic en cualquier fecha para crear un nuevo evento. Puedes establecer eventos recurrentes.",
    },
    {
      id: "ai_assistant",
      question: "¿Cómo funciona el Asistente de IA?",
      keywords: ["asistente ia", "ayuda ia", "preguntar ia", "modo chat"],
      answer:
        "El Asistente de IA tiene tres modos: Chat (pregunta lo que quieras), Estudio (crea planes de estudio) y Analizar (sube archivos). ¡Selecciona un modo!",
    },
    {
      id: "pomodoro",
      question: "¿Cómo usar Pomodoro?",
      keywords: ["pomodoro", "temporizador", "enfoque", "sesión de trabajo"],
      answer:
        "Ve a Pomodoro para iniciar una sesión de enfoque. El temporizador está configurado para 25 minutos de trabajo seguidos de un descanso.",
    },
    {
      id: "settings",
      question: "¿Cómo usar Configuración?",
      keywords: ["configuración", "perfil", "preferencias", "idioma"],
      answer:
        "Visita Configuración para personalizar tu perfil, cambiar el idioma, establecer tu zona horaria y ajustar Pomodoro.",
    },
    {
      id: "cancel",
      question: "¿Cómo cancelar suscripción?",
      keywords: ["cancelar suscripción", "cancelar plan", "desuscribirse"],
      answer:
        "Para cancelar tu suscripción, ve a Configuración > Suscripción y haz clic en 'Cancelar Plan'. Tu acceso continuará hasta el final de tu período de facturación.",
    },
    {
      id: "buy_credits",
      question: "¿Cómo comprar packs de créditos?",
      keywords: ["comprar packs", "comprar créditos", "obtener créditos"],
      answer:
        "Puedes comprar paquetes de créditos desde la sección Suscripción. Elige un paquete, completa el pago y tus créditos se agregarán inmediatamente.",
    },
    {
      id: "upgrade",
      question: "¿Cómo actualizar plan?",
      keywords: ["premium", "actualizar", "suscripción", "plan pro"],
      answer:
        "Actualiza a Premium para obtener acceso ilimitado al asistente de IA, análisis avanzados y colaboración en equipo.",
    },
    {
      id: "refund",
      question: "¿Ofrecen reembolsos?",
      keywords: ["reembolso", "dinero de vuelta"],
      answer: "Ofrecemos garantía de devolución de dinero en 30 días. Contacta al soporte para más detalles.",
    },
    {
      id: "backup",
      question: "¿Están mis datos respaldados?",
      keywords: ["sincronizar", "nube", "copia de seguridad", "datos"],
      answer:
        "Tus datos se sincronizan automáticamente a la nube y se respaldan diariamente. Accede a tu cuenta desde cualquier dispositivo.",
    },
    {
      id: "export",
      question: "¿Cómo exportar datos?",
      keywords: ["exportar", "descargar", "guardar datos", "respaldo"],
      answer:
        "Puedes exportar tus tareas y notas como CSV o PDF desde el menú de configuración. Esto te permite respaldar tus datos o utilizarlos altrove.",
    },
    {
      id: "teams",
      question: "¿Cómo usar Teams?",
      keywords: ["equipo", "colaborar", "compartir", "invitar"],
      answer:
        "En Premium, puedes crear equipos e invitar colaboradores. Comparte proyectos, asigna tareas y comunica dentro de la aplicación. Cada miembro del equipo necesita una cuenta separada.",
    },
  ],
  fr: [
    {
      id: "free_credits",
      question: "Combien de crédits dans le plan Gratuit?",
      keywords: ["crédits gratuits", "plan gratuit", "combien de crédits gratuits"],
      answer:
        "Le plan Gratuit inclut 0 crédits par mois. Vous pouvez acheter des crédits pour utiliser l'Assistant IA. Premium inclut 100 crédits mensuels et Pro inclut 500. Chaque question coûte 2 crédits et l'analyse de fichiers coûte 3.",
    },
    {
      id: "create_task",
      question: "Comment créer une tâche?",
      keywords: ["créer tâche", "ajouter tâche", "nouvelle tâche"],
      answer:
        "Pour créer une tâche, allez à la section Tâches et cliquez sur 'Nouvelle Tâche'. Entrez le titre, la description, la date d'échéance et la priorité.",
    },
    {
      id: "calendar",
      question: "Comment utiliser le Calendrier?",
      keywords: ["calendrier", "planifier", "événement", "ajouter événement"],
      answer:
        "Visitez la section Calendrier pour voir vos événements. Cliquez sur une date pour créer un nouvel événement. Vous pouvez définir des événements récurrents.",
    },
    {
      id: "ai_assistant",
      question: "Comment fonctionne l'Assistant IA?",
      keywords: ["assistant ia", "aide ia", "demander ia"],
      answer:
        "L'Assistant IA dispose de trois modes : Chat (posez n'importe quelle question), Étude (créez des plans d'étude) et Analyser (téléchargez des fichiers).",
    },
    {
      id: "pomodoro",
      question: "Comment utiliser Pomodoro?",
      keywords: ["pomodoro", "minuteur", "focus", "session de travail"],
      answer:
        "Allez à Pomodoro pour démarrer une session de concentration. Le minuteur est réglé sur 25 minutes de travail suivies d'une pause.",
    },
    {
      id: "settings",
      question: "Comment utiliser les Paramètres?",
      keywords: ["paramètres", "profil", "préférences", "langue"],
      answer:
        "Visitez les Paramètres pour personnaliser votre profil, changer de langue, définir votre fuseau horaire et ajuster les durées de Pomodoro.",
    },
    {
      id: "cancel",
      question: "Comment annuler l'abonnement?",
      keywords: ["annuler abonnement", "annuler plan", "résilier"],
      answer:
        "Pour annuler votre abonnement, allez à Paramètres > Abonnement et cliquez sur 'Annuler Plan'. Votre accès continuera jusqu'à la fin de votre période de facturation.",
    },
    {
      id: "buy_credits",
      question: "Comment acheter des packs de crédits?",
      keywords: ["acheter packs", "acheter crédits", "obtenir crédits"],
      answer:
        "Vous pouvez acheter des packs de crédits dans la section Abonnement. Choisissez un pack, complétez le paiement et vos crédits seront ajoutés immédiatement.",
    },
    {
      id: "upgrade",
      question: "Comment mettre à niveau le plan?",
      keywords: ["premium", "mettre à niveau", "abonnement"],
      answer:
        "Mettez à niveau vers Premium pour un accès illimité à l'assistant IA, des analyses avancées et une collaboration en équipe.",
    },
    {
      id: "refund",
      question: "Offrez-vous des remboursements?",
      keywords: ["remboursement", "retour argent"],
      answer: "Nous offrons une garantie de remboursement de 30 jours. Contactez le support pour plus de détails.",
    },
    {
      id: "backup",
      question: "Mes données sont-elles sauvegardées?",
      keywords: ["synchroniser", "cloud", "sauvegarde", "données"],
      answer:
        "Vos données sont automatiquement synchronisées vers le cloud et sauvegardées quotidiennement. Accédez à votre compte depuis n'importe quel appareil.",
    },
    {
      id: "export",
      question: "Comment exporter les données?",
      keywords: ["exporter", "télécharger", "sauvegarder données", "backup"],
      answer:
        "Vous pouvez exporter vos tâches et notes au format CSV ou PDF à partir du menu des paramètres. Cela vous permet de sauvegarder vos données ou de les utiliser ailleurs.",
    },
    {
      id: "teams",
      question: "Comment utiliser les Équipes?",
      keywords: ["équipe", "collaborer", "partager", "inviter"],
      answer:
        "En Premium, vous pouvez créer des équipes et inviter des collaborateurs. Partagez des projets, assignez des tâches et communiquez au sein de l'application. Chaque membre de l'équipe a besoin d'un compte séparé.",
    },
  ],
  de: [
    {
      id: "free_credits",
      question: "Wie viele Credits im kostenlosen Plan?",
      keywords: ["kostenlose guthaben", "kostenlos guthaben", "wie viel kostenlos guthaben"],
      answer:
        "Der kostenlose Plan enthält 0 Guthaben pro Monat. Sie können Guthaben kaufen, um den KI-Assistenten zu nutzen. Premium enthält 100 monatliche Guthaben und Pro enthält 500. Jede Frage kostet 2 Guthaben und die Dateianalyse kostet 3.",
    },
    {
      id: "create_task",
      question: "Wie erstelle ich eine Aufgabe?",
      keywords: ["aufgabe erstellen", "aufgabe hinzufügen", "neue aufgabe"],
      answer:
        "Um eine Aufgabe zu erstellen, gehen Sie zum Abschnitt Aufgaben und klicken Sie auf 'Neue Aufgabe'. Geben Sie den Titel, die Beschreibung, das Fälligkeitsdatum und die Priorität ein.",
    },
    {
      id: "calendar",
      question: "Wie nutze ich den Kalender?",
      keywords: ["kalender", "planen", "ereignis", "ereignis hinzufügen"],
      answer:
        "Besuchen Sie den Abschnitt Kalender, um Ihre Ereignisse anzuzeigen. Klicken Sie auf ein Datum, um ein neues Ereignis zu erstellen. Sie können wiederkehrende Ereignisse festlegen.",
    },
    {
      id: "ai_assistant",
      question: "Wie funktioniert der KI-Assistent?",
      keywords: ["ki-assistent", "ki-hilfe", "fragen sie die ki"],
      answer:
        "Der KI-Assistent hat drei Modi: Chat (stellen Sie Fragen), Studium (erstellen Sie Lernpläne) und Analysieren (laden Sie Dateien hoch).",
    },
    {
      id: "pomodoro",
      question: "Wie nutze ich Pomodoro?",
      keywords: ["pomodoro", "timer", "fokus", "arbeitsession"],
      answer:
        "Gehen Sie zu Pomodoro, um eine Fokussession zu starten. Der Timer ist auf 25 Minuten Arbeit gefolgt von einer Pause eingestellt.",
    },
    {
      id: "settings",
      question: "Wie nutze ich die Einstellungen?",
      keywords: ["einstellungen", "profil", "einstellungen", "sprache"],
      answer:
        "Besuchen Sie die Einstellungen, um Ihr Profil anzupassen, die Sprache zu ändern, Ihre Zeitzone festzulegen und die Pomodoro-Dauern anzupassen.",
    },
    {
      id: "cancel",
      question: "Wie kündige ich mein Abonnement?",
      keywords: ["abonnement kündigen", "plan kündigen", "abbestellen"],
      answer:
        "Um Ihr Abonnement zu kündigen, gehen Sie zu Einstellungen > Abonnement und klicken Sie auf 'Plan kündigen'. Ihr Zugriff dauert bis zum Ende Ihres Abrechnungszeitraums.",
    },
    {
      id: "buy_credits",
      question: "Wie kaufe ich Credit-Packs?",
      keywords: ["packs kaufen", "guthaben kaufen", "guthaben erhalten"],
      answer:
        "Sie können Kreditpacks im Abschnitt Abonnement kaufen. Wählen Sie ein Paket, schließen Sie die Zahlung ab und Ihr Guthaben wird sofort hinzugefügt.",
    },
    {
      id: "upgrade",
      question: "Wie upgrade ich meinen Plan?",
      keywords: ["premium", "upgrade", "abonnement"],
      answer: "Upgrade auf Premium für unbegrenzten KI-Zugriff, erweiterte Analysen und Teamzusammenarbeit.",
    },
    {
      id: "refund",
      question: "Bieten Sie Rückerstattungen an?",
      keywords: ["rückerstattung", "geldtransfer"],
      answer: "Wir bieten eine 30-Tage-Geldback-Garantie. Kontaktieren Sie den Support für Details.",
    },
    {
      id: "backup",
      question: "Werden meine Daten gesichert?",
      keywords: ["synchronisieren", "wolke", "sicherung", "daten"],
      answer:
        "Ihre Daten werden automatisch mit der Cloud synchronisiert und täglich gesichert. Greifen Sie von jedem Gerät auf Ihr Konto zu.",
    },
    {
      id: "export",
      question: "Wie exportiere ich Daten?",
      keywords: ["exportieren", "herunterladen", "daten speichern", "backup"],
      answer:
        "Sie können Ihre Aufgaben und Notizen als CSV oder PDF aus dem Menü der Einstellungen exportieren. Dies ermöglicht es Ihnen, Ihre Daten zu sichern oder anderswo zu verwenden.",
    },
    {
      id: "teams",
      question: "Wie nutze ich Teams?",
      keywords: ["team", "zusammenarbeiten", "teilen", "einladen"],
      answer:
        "In Premium können Sie Teams erstellen und Mitarbeiter einladen. Teilen Sie Projekte, weisen Sie Aufgaben zu und kommunizieren Sie innerhalb der App. Jedes Teamitglied benötigt ein separates Konto.",
    },
  ],
  it: [
    {
      id: "free_credits",
      question: "Quanti crediti nel piano Gratuito?",
      keywords: ["crediti gratuiti", "piano gratuito", "quanti crediti gratuiti"],
      answer:
        "Il piano Gratuito include 0 crediti al mese. Puoi acquistare crediti per utilizzare l'Assistente IA. Premium include 100 crediti mensili e Pro include 500. Ogni domanda costa 2 crediti e l'analisi dei file costa 3.",
    },
    {
      id: "create_task",
      question: "Come creare un'attività?",
      keywords: ["creare attività", "aggiungere attività", "nuova attività"],
      answer:
        "Per creare un'attività, vai alla sezione Attività e fai clic su 'Nuova Attività'. Inserisci il titolo, la descrizione, la data di scadenza e la priorità.",
    },
    {
      id: "calendar",
      question: "Come usare il Calendario?",
      keywords: ["calendario", "pianificare", "evento", "aggiungere evento"],
      answer:
        "Visita la sezione Calendario per visualizzare i tuoi eventi. Fai clic su una data per creare un nuovo evento. Puoi impostare eventi ricorrenti.",
    },
    {
      id: "ai_assistant",
      question: "Come funziona l'Assistente IA?",
      keywords: ["assistente ia", "aiuto ia", "chiedi all'ia"],
      answer:
        "L'Assistente IA ha tre modalità: Chat (fai qualsiasi domanda), Studio (crea piani di studio) e Analizza (carica file).",
    },
    {
      id: "pomodoro",
      question: "Come usare Pomodoro?",
      keywords: ["pomodoro", "timer", "focus", "sessione di lavoro"],
      answer:
        "Vai a Pomodoro per avviare una sessione di concentrazione. Il timer è impostato su 25 minuti di lavoro seguiti da una pausa.",
    },
    {
      id: "settings",
      question: "Come usare le Impostazioni?",
      keywords: ["impostazioni", "profilo", "preferenze", "lingua"],
      answer:
        "Visita le Impostazioni per personalizzare il tuo profilo, cambiare lingua, impostare il tuo fuso orario e regolare i tempi di Pomodoro.",
    },
    {
      id: "cancel",
      question: "Come annullo l'abbonamento?",
      keywords: ["annulla abbonamento", "annulla piano", "annulla iscrizione"],
      answer:
        "Per annullare l'abbonamento, vai a Impostazioni > Abbonamento e fai clic su 'Annulla Piano'. Il tuo accesso continuerà fino alla fine del tuo periodo di fatturazione.",
    },
    {
      id: "buy_credits",
      question: "Come acquistare pacchetti di crediti?",
      keywords: ["acquista pacchetti", "acquista crediti", "ottieni crediti"],
      answer:
        "Puoi acquistare pacchetti di crediti dalla sezione Abbonamento. Scegli un pacchetto, completa il pagamento e i tuoi crediti verranno aggiunti immediatamente.",
    },
    {
      id: "upgrade",
      question: "Come aggiorno il mio piano?",
      keywords: ["premium", "aggiornamento", "abbonamento"],
      answer:
        "Esegui l'upgrade a Premium per accesso illimitato all'assistente IA, analisi avanzate e collaborazione di squadra.",
    },
    {
      id: "refund",
      question: "Offrite rimborsi?",
      keywords: ["rimborso", "restituzione soldi"],
      answer: "Offriamo una garanzia di rimborso di 30 giorni. Contatta il supporto per i dettagli.",
    },
    {
      id: "backup",
      question: "I miei dati sono sottoposti a backup?",
      keywords: ["sincronizza", "cloud", "backup", "dati"],
      answer:
        "I tuoi dati vengono sincronizzati automaticamente al cloud e sottoposti a backup giornaliero. Accedi al tuo account da qualsiasi dispositivo.",
    },
    {
      id: "export",
      question: "Come esporto i dati?",
      keywords: ["esporta", "scarica", "salva dati", "backup"],
      answer:
        "Puoi esportare le tue attività e note come CSV o PDF dal menu delle impostazioni. Questo ti consente di eseguire il backup dei dati o utilizzarli altrove.",
    },
    {
      id: "teams",
      question: "Come usare i Team?",
      keywords: ["team", "collabora", "condividi", "invita"],
      answer:
        "In Premium, puoi creare team e invitare collaboratori. Condividi progetti, assegna attività e comunica all'interno dell'app. Ogni membro del team ha bisogno di un account separato.",
    },
  ],
}

export async function POST(req: NextRequest) {
  try {
    const { question, language } = await req.json()
    const normalizedQuestion = question.toLowerCase().trim()

    const faqsForLanguage = faqDatabase[language as keyof typeof faqDatabase] || faqDatabase.en
    const contactEmail = "support@future-task.com"

    // Search for matching FAQ with partial word matching
    for (const faq of faqsForLanguage) {
      const hasMatch = faq.keywords.some((keyword) => {
        const normalizedKeyword = keyword.toLowerCase()
        // Check for exact keyword or partial word matches
        return (
          normalizedQuestion.includes(normalizedKeyword) ||
          normalizedQuestion
            .split(/\s+/)
            .some((word) => normalizedKeyword.includes(word) || word.includes(normalizedKeyword.split(/\s+/)[0]))
        )
      })
      if (hasMatch) {
        return Response.json({
          answer: faq.answer,
          contact_email: contactEmail,
        })
      }
    }

    const suggestions = faqsForLanguage.map((faq) => ({
      id: faq.id,
      question: faq.question,
    }))

    const noMatchMessages = {
      en: "I couldn't find an exact answer to your question. Here are some related topics that might help:",
      es: "No pude encontrar una respuesta exacta a tu pregunta. Aquí hay algunos temas relacionados que podrían ayudarte:",
      fr: "Je n'ai pas trouvé de réponse exacte à votre question. Voici quelques sujets connexes qui pourraient vous aider:",
      de: "Ich konnte keine genaue Antwort auf Ihre Frage finden. Hier sind einige verwandte Themen, die Ihnen helfen könnten:",
      it: "Non ho trovato una risposta esatta alla tua domanda. Ecco alcuni argomenti correlati che potrebbero aiutarti:",
    }

    return Response.json({
      answer: noMatchMessages[language as keyof typeof noMatchMessages] || noMatchMessages.en,
      suggestions,
      contact_email: contactEmail,
    })
  } catch (error) {
    console.error("[v0] Help chat error:", error)
    return Response.json({ error: "An error occurred processing your question" }, { status: 500 })
  }
}
