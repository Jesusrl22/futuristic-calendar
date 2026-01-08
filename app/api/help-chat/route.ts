import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// FAQ Database with translations
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
      keywords: ["premium", "upgrade", "subscription", "pro"],
      answer:
        "Upgrade to Premium for unlimited AI assistant usage, advanced analytics, team collaboration, and more. Visit the Subscription section to see plans.",
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
  ],
  es: [
    {
      keywords: ["crear tarea", "agregar tarea", "nueva tarea", "hacer tarea"],
      answer:
        "Para crear una tarea, ve a la sección Tareas y haz clic en 'Nueva Tarea'. Ingresa el título, descripción, fecha de vencimiento y prioridad. También puedes establecer recordatorios y etiquetas.",
    },
    {
      keywords: ["calendario", "programar", "evento", "agregar evento"],
      answer:
        "Visita la sección Calendario para ver tus eventos. Haz clic en cualquier fecha para crear un nuevo evento. Puedes establecer eventos recurrentes, recordatorios e invitar a otros.",
    },
    {
      keywords: ["asistente ia", "ayuda ia", "preguntar ia", "modo chat"],
      answer:
        "El Asistente de IA tiene tres modos: Chat (pregunta lo que quieras), Estudio (crea planes de estudio) y Analizar (sube archivos y documentos). ¡Selecciona un modo y comienza a hacer preguntas!",
    },
    {
      keywords: ["pomodoro", "temporizador", "enfoque", "sesión de trabajo"],
      answer:
        "Ve a Pomodoro para iniciar una sesión de enfoque. El temporizador está configurado para 25 minutos de trabajo seguidos de un descanso. Puedes personalizar la duración en Configuración.",
    },
    {
      keywords: ["configuración", "perfil", "preferencias", "idioma"],
      answer:
        "Visita Configuración para personalizar tu perfil, cambiar el idioma, establecer tu zona horaria y ajustar las duraciones de Pomodoro. Tus preferencias se guardan automáticamente.",
    },
    {
      keywords: ["premium", "actualizar", "suscripción", "pro"],
      answer:
        "Actualiza a Premium para obtener uso ilimitado del asistente de IA, análisis avanzado, colaboración en equipo y más. Visita la sección Suscripción para ver los planes.",
    },
    {
      keywords: ["sincronizar", "nube", "copia de seguridad", "datos"],
      answer:
        "Tus datos se sincronizan automáticamente con la nube y se respaldan diariamente. Puedes acceder a tu cuenta desde cualquier dispositivo iniciando sesión.",
    },
    {
      keywords: ["exportar", "descargar", "guardar datos", "respaldo"],
      answer:
        "Puedes exportar tus tareas y notas como CSV o PDF desde el menú de configuración. Esto te permite respaldar tus datos o usarlos en otro lugar.",
    },
  ],
  fr: [
    {
      keywords: ["créer tâche", "ajouter tâche", "nouvelle tâche", "faire tâche"],
      answer:
        "Pour créer une tâche, allez à la section Tâches et cliquez sur 'Nouvelle Tâche'. Entrez le titre, la description, la date d'échéance et la priorité. Vous pouvez également définir des rappels et des étiquettes.",
    },
    {
      keywords: ["calendrier", "planifier", "événement", "ajouter événement"],
      answer:
        "Visitez la section Calendrier pour voir vos événements. Cliquez sur n'importe quelle date pour créer un nouvel événement. Vous pouvez définir des événements récurrents, des rappels et inviter d'autres personnes.",
    },
    {
      keywords: ["assistant ia", "aide ia", "demander ia", "mode chat"],
      answer:
        "L'Assistant IA a trois modes : Chat (posez n'importe quelle question), Étude (créez des plans d'étude) et Analyser (téléchargez des fichiers et des documents). Sélectionnez un mode et commencez à poser des questions !",
    },
    {
      keywords: ["pomodoro", "minuteur", "focus", "session de travail"],
      answer:
        "Allez à Pomodoro pour démarrer une session de concentration. Le minuteur est défini sur 25 minutes de travail suivies d'une pause. Vous pouvez personnaliser la durée dans Paramètres.",
    },
    {
      keywords: ["paramètres", "profil", "préférences", "langue"],
      answer:
        "Visitez Paramètres pour personnaliser votre profil, changer de langue, définir votre fuseau horaire et ajuster les durées de Pomodoro. Vos préférences sont enregistrées automatiquement.",
    },
    {
      keywords: ["premium", "mettre à niveau", "abonnement", "pro"],
      answer:
        "Passez à Premium pour un usage illimité de l'assistant IA, des analyses avancées, la collaboration en équipe, et plus encore. Visitez la section Abonnement pour voir les plans.",
    },
    {
      keywords: ["synchroniser", "cloud", "sauvegarde", "données"],
      answer:
        "Vos données sont automatiquement synchronisées avec le cloud et sauvegardées quotidiennement. Vous pouvez accéder à votre compte depuis n'importe quel appareil en vous connectant.",
    },
    {
      keywords: ["exporter", "télécharger", "enregistrer données", "sauvegarde"],
      answer:
        "Vous pouvez exporter vos tâches et notes au format CSV ou PDF à partir du menu des paramètres. Cela vous permet de sauvegarder vos données ou de les utiliser ailleurs.",
    },
  ],
  de: [
    {
      keywords: ["aufgabe erstellen", "aufgabe hinzufügen", "neue aufgabe", "aufgabe machen"],
      answer:
        "Um eine Aufgabe zu erstellen, gehen Sie zum Abschnitt Aufgaben und klicken Sie auf 'Neue Aufgabe'. Geben Sie den Titel, die Beschreibung, das Fälligkeitsdatum und die Priorität ein. Sie können auch Erinnerungen und Tags festlegen.",
    },
    {
      keywords: ["kalender", "planen", "ereignis", "ereignis hinzufügen"],
      answer:
        "Besuchen Sie den Abschnitt Kalender, um Ihre Ereignisse anzuzeigen. Klicken Sie auf ein beliebiges Datum, um ein neues Ereignis zu erstellen. Sie können wiederkehrende Ereignisse, Erinnerungen festlegen und andere einladen.",
    },
    {
      keywords: ["ki-assistent", "ki-hilfe", "ki fragen", "chat-modus"],
      answer:
        "Der KI-Assistent hat drei Modi: Chat (fragen Sie alles), Lernen (erstellen Sie Lernpläne) und Analysieren (laden Sie Dateien und Dokumente hoch). Wählen Sie einen Modus und stellen Sie Fragen!",
    },
    {
      keywords: ["pomodoro", "timer", "fokus", "arbeitssitzung"],
      answer:
        "Gehen Sie zu Pomodoro, um eine Fokussitzung zu starten. Der Timer ist auf 25 Minuten Arbeit gefolgt von einer Pause eingestellt. Sie können die Dauer in den Einstellungen anpassen.",
    },
    {
      keywords: ["einstellungen", "profil", "präferenzen", "sprache"],
      answer:
        "Besuchen Sie Einstellungen, um Ihr Profil anzupassen, die Sprache zu ändern, Ihre Zeitzone festzulegen und Pomodoro-Dauern anzupassen. Ihre Einstellungen werden automatisch gespeichert.",
    },
    {
      keywords: ["premium", "upgrade", "abonnement", "pro"],
      answer:
        "Upgrade auf Premium für unbegrenzte KI-Assistenten-Nutzung, erweiterte Analytik, Teamzusammenarbeit und mehr. Besuchen Sie den Abschnitt Abonnement, um die Pläne anzuzeigen.",
    },
    {
      keywords: ["synchronisieren", "cloud", "sicherung", "daten"],
      answer:
        "Ihre Daten werden automatisch mit der Cloud synchronisiert und täglich gesichert. Sie können von jedem Gerät aus auf Ihr Konto zugreifen, indem Sie sich anmelden.",
    },
    {
      keywords: ["exportieren", "herunterladen", "daten speichern", "sicherung"],
      answer:
        "Sie können Ihre Aufgaben und Notizen als CSV oder PDF aus dem Einstellungsmenü exportieren. Dies ermöglicht es Ihnen, Ihre Daten zu sichern oder anderswo zu verwenden.",
    },
  ],
  it: [
    {
      keywords: ["crea attività", "aggiungi attività", "nuova attività", "fai attività"],
      answer:
        "Per creare un'attività, vai alla sezione Attività e fai clic su 'Nuova attività'. Inserisci il titolo, la descrizione, la data di scadenza e la priorità. Puoi anche impostare promemoria e tag.",
    },
    {
      keywords: ["calendario", "pianificare", "evento", "aggiungi evento"],
      answer:
        "Visita la sezione Calendario per visualizzare i tuoi eventi. Fai clic su una data qualsiasi per creare un nuovo evento. Puoi impostare eventi ricorrenti, promemoria e invitare altre persone.",
    },
    {
      keywords: ["assistente ia", "aiuto ia", "chiedi ia", "modalità chat"],
      answer:
        "L'Assistente IA ha tre modalità: Chat (chiedimi qualsiasi cosa), Studio (crea piani di studio) e Analizza (carica file e documenti). Seleziona una modalità e inizia a fare domande!",
    },
    {
      keywords: ["pomodoro", "timer", "focus", "sessione di lavoro"],
      answer:
        "Vai a Pomodoro per avviare una sessione di concentrazione. Il timer è impostato su 25 minuti di lavoro seguiti da una pausa. Puoi personalizzare la durata in Impostazioni.",
    },
    {
      keywords: ["impostazioni", "profilo", "preferenze", "lingua"],
      answer:
        "Visita Impostazioni per personalizzare il tuo profilo, cambiare lingua, impostare il tuo fuso orario e regolare le durate di Pomodoro. Le tue preferenze vengono salvate automaticamente.",
    },
    {
      keywords: ["premium", "aggiorna", "abbonamento", "pro"],
      answer:
        "Passa a Premium per un utilizzo illimitato dell'assistente IA, analisi avanzate, collaborazione di team e altro ancora. Visita la sezione Abbonamento per vedere i piani.",
    },
    {
      keywords: ["sincronizza", "cloud", "backup", "dati"],
      answer:
        "I tuoi dati vengono sincronizzati automaticamente nel cloud ed è eseguito il backup giornaliero. Puoi accedere al tuo account da qualsiasi dispositivo effettuando l'accesso.",
    },
    {
      keywords: ["esporta", "scarica", "salva dati", "backup"],
      answer:
        "Puoi esportare le tue attività e note come CSV o PDF dal menu delle impostazioni. Questo ti consente di eseguire il backup dei dati o utilizzarli altrove.",
    },
  ],
}

function findFAQMatch(question: string, language: string): string | null {
  const lowerQuestion = question.toLowerCase()
  const faqs = faqDatabase[language as keyof typeof faqDatabase] || faqDatabase.en

  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (lowerQuestion.includes(keyword)) {
        return faq.answer
      }
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    const { question, language, conversationHistory } = await request.json()

    // First, try to find a matching FAQ
    const faqAnswer = findFAQMatch(question, language)
    if (faqAnswer) {
      return Response.json({ answer: faqAnswer, source: "faq" })
    }

    // If no FAQ match, use AI to generate an answer
    const languagePrompt =
      language === "es"
        ? "Responde en español."
        : language === "fr"
          ? "Répondez en français."
          : language === "de"
            ? "Antworten Sie auf Deutsch."
            : language === "it"
              ? "Rispondi in italiano."
              : "Respond in English."

    const systemPrompt = `You are a helpful support assistant for Future Task, a smart task management application. 
You help users with questions about how to use the app, its features, and functionality.
Keep responses concise, friendly, and helpful. If you don't know something, suggest contacting support.
${languagePrompt}`

    const { text: aiAnswer } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: question,
      maxTokens: 200,
    })

    return Response.json({ answer: aiAnswer, source: "ai" })
  } catch (error) {
    console.error("[v0] Help chat error:", error)
    return Response.json({ error: "Failed to process question" }, { status: 500 })
  }
}
