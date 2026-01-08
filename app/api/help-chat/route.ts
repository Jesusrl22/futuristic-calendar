import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

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
        "To cancel your subscription, go to Settings > Subscription and click 'Cancel Plan'. Your access will continue until the end of your billing period. No refunds are issued for partial months.",
    },
    {
      keywords: ["buy packs", "purchase credits", "get credits", "buy credits"],
      answer:
        "You can buy credit packs from the Subscription section. Choose a pack, complete the payment, and your credits will be added immediately. Unused credits never expire.",
    },
    {
      keywords: ["premium", "upgrade", "subscription", "pro", "pro plan"],
      answer:
        "Upgrade to Premium for unlimited AI assistant usage, advanced analytics, team collaboration, and priority support. Visit Subscription to see all available plans and features.",
    },
    {
      keywords: ["refund", "money back", "reembolso"],
      answer:
        "We offer a 30-day money-back guarantee on all subscription plans. If you're not satisfied, contact support within 30 days of purchase for a full refund.",
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
      keywords: ["cancelar suscripción", "cancelar plan", "desuscribirse", "parar suscripción"],
      answer:
        "Para cancelar tu suscripción, ve a Configuración > Suscripción y haz clic en 'Cancelar Plan'. Tu acceso continuará hasta el final de tu período de facturación. No se emiten reembolsos por meses parciales.",
    },
    {
      keywords: ["comprar packs", "comprar créditos", "obtener créditos", "paquete créditos"],
      answer:
        "Puedes comprar paquetes de créditos en la sección Suscripción. Elige un paquete, completa el pago y tus créditos se agregarán inmediatamente. Los créditos no utilizados nunca vencen.",
    },
    {
      keywords: ["premium", "actualizar", "suscripción", "pro", "plan pro"],
      answer:
        "Actualiza a Premium para obtener uso ilimitado del asistente de IA, análisis avanzado, colaboración en equipo y soporte prioritario. Visita Suscripción para ver todos los planes y características disponibles.",
    },
    {
      keywords: ["reembolso", "devolución de dinero", "devolver dinero"],
      answer:
        "Ofrecemos una garantía de devolución de dinero de 30 días en todos los planes de suscripción. Si no estás satisfecho, contacta con soporte dentro de 30 días de la compra para obtener un reembolso completo.",
    },
    {
      keywords: ["sincronizar", "nube", "copia de seguridad", "datos"],
      answer:
        "Tus datos se sincronizan automáticamente con la nube y se respaldan diariamente. Puedes acceder a tu cuenta desde cualquier dispositivo iniciando sesión.",
    },
    {
      keywords: ["exportar", "descargar", "guardar datos", "respaldo"],
      answer:
        "Puedes exportar tus tareas y notas como CSV o PDF desde el menú de configuración. Esto te permite respaldar tus datos o utilizarlos en otro lugar.",
    },
    {
      keywords: ["equipo", "colaborar", "compartir", "invitar"],
      answer:
        "En Premium, puedes crear equipos e invitar colaboradores. Comparte proyectos, asigna tareas y comunícate dentro de la aplicación. Cada miembro del equipo necesita una cuenta separada.",
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
      keywords: ["annuler abonnement", "annuler plan", "se désabonner", "arrêter abonnement"],
      answer:
        "Pour annuler votre abonnement, allez à Paramètres > Abonnement et cliquez sur 'Annuler Plan'. Votre accès se poursuivra jusqu'à la fin de votre période de facturation. Aucun remboursement n'est émis pour les mois partiels.",
    },
    {
      keywords: ["acheter packs", "acheter crédits", "obtenir crédits", "paquets crédits"],
      answer:
        "Vous pouvez acheter des forfaits de crédits à partir de la section Abonnement. Choisissez un forfait, effectuez le paiement et vos crédits seront ajoutés immédiatement. Les crédits inutilisés n'expirent jamais.",
    },
    {
      keywords: ["premium", "mettre à niveau", "abonnement", "pro", "plan pro"],
      answer:
        "Passez à Premium pour un usage illimité de l'assistant IA, des analyses avancées, la collaboration en équipe et un support prioritaire. Visitez Abonnement pour voir tous les plans et fonctionnalités disponibles.",
    },
    {
      keywords: ["remboursement", "retour argent", "retour d'argent"],
      answer:
        "Nous offrons une garantie de remboursement de 30 jours sur tous les plans d'abonnement. Si vous n'êtes pas satisfait, contactez le support dans les 30 jours suivant votre achat pour un remboursement complet.",
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
    {
      keywords: ["équipe", "collaborer", "partager", "inviter"],
      answer:
        "En Premium, vous pouvez créer des équipes et inviter des collaborateurs. Partagez des projets, assignez des tâches et communiquez au sein de l'application. Chaque membre de l'équipe a besoin d'un compte séparé.",
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
      keywords: ["abonnement kündigen", "plan kündigen", "abmelden", "abonnement stoppen"],
      answer:
        "Um Ihr Abonnement zu kündigen, gehen Sie zu Einstellungen > Abonnement und klicken Sie auf 'Plan kündigen'. Ihr Zugriff wird bis zum Ende Ihres Abrechnungszeitraums fortgesetzt. Für Teilmonate werden keine Rückerstattungen ausgestellt.",
    },
    {
      keywords: ["packs kaufen", "guthaben kaufen", "guthaben erhalten", "gutschein packs"],
      answer:
        "Sie können Gutschein-Packs im Abschnitt Abonnement kaufen. Wählen Sie ein Pack, führen Sie die Zahlung durch und Ihr Guthaben wird sofort hinzugefügt. Ungenutztes Guthaben verfällt nie.",
    },
    {
      keywords: ["premium", "upgrade", "abonnement", "pro", "pro-plan"],
      answer:
        "Upgrade auf Premium für unbegrenzte KI-Assistenten-Nutzung, erweiterte Analytik, Teamzusammenarbeit und vorrangigen Support. Besuchen Sie Abonnement, um alle verfügbaren Pläne und Funktionen anzuzeigen.",
    },
    {
      keywords: ["rückerstattung", "geld zurück", "geld zurückgeben"],
      answer:
        "Wir bieten eine 30-Tage-Rückgabegarantie für alle Abonnementpläne. Wenn Sie nicht zufrieden sind, wenden Sie sich innerhalb von 30 Tagen nach dem Kauf an den Support für eine vollständige Rückerstattung.",
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
    {
      keywords: ["team", "zusammenarbeiten", "teilen", "einladen"],
      answer:
        "In Premium können Sie Teams erstellen und Mitarbeiter einladen. Teilen Sie Projekte, weisen Sie Aufgaben zu und kommunizieren Sie innerhalb der App. Jedes Teamitglied benötigt ein separates Konto.",
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
      keywords: ["annulla abbonamento", "annulla piano", "cancella abbonamento", "ferma abbonamento"],
      answer:
        "Per annullare il tuo abbonamento, vai a Impostazioni > Abbonamento e fai clic su 'Annulla piano'. Il tuo accesso continuerà fino alla fine del tuo periodo di fatturazione. Non vengono emessi rimborsi per mesi parziali.",
    },
    {
      keywords: ["acquista pack", "acquista crediti", "ottieni crediti", "pacchetti crediti"],
      answer:
        "Puoi acquistare pacchetti di crediti dalla sezione Abbonamento. Scegli un pacchetto, completa il pagamento e i tuoi crediti verranno aggiunti immediatamente. I crediti inutilizzati non scadono mai.",
    },
    {
      keywords: ["premium", "aggiorna", "abbonamento", "pro", "piano pro"],
      answer:
        "Passa a Premium per un utilizzo illimitato dell'assistente IA, analisi avanzate, collaborazione di team e supporto prioritario. Visita Abbonamento per vedere tutti i piani e le funzioni disponibili.",
    },
    {
      keywords: ["rimborso", "soldi indietro", "restituzione soldi"],
      answer:
        "Offriamo una garanzia di rimborso di 30 giorni su tutti i piani di abbonamento. Se non sei soddisfatto, contatta il supporto entro 30 giorni dall'acquisto per un rimborso completo.",
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
    {
      keywords: ["team", "collabora", "condividi", "invita"],
      answer:
        "In Premium, puoi creare team e invitare collaboratori. Condividi progetti, assegna attività e comunica all'interno dell'app. Ogni membro del team ha bisogno di un account separato.",
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
    console.log("[v0] Help chat question:", question, "Language:", language)

    // First, try to find a matching FAQ
    const faqAnswer = findFAQMatch(question, language)
    if (faqAnswer) {
      console.log("[v0] FAQ match found")
      return Response.json({ answer: faqAnswer, source: "faq" })
    }

    console.log("[v0] No FAQ match, calling Groq")

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
You help users with questions about how to use the app, its features, subscriptions, credit packs, cancellations, and functionality.
The app allows users to manage tasks, calendar events, use an AI assistant (Chat, Study, Analyze modes), Pomodoro timer, achievements, and teams.
Premium subscriptions provide unlimited AI usage, advanced analytics, team collaboration, and priority support.
Users can buy credit packs for additional AI usage at any time.
Users can cancel their subscription anytime, and access continues until the end of the billing period.
Keep responses concise, friendly, and helpful. If you don't know something, suggest contacting support at support@futuretask.com.
${languagePrompt}`

    console.log("[v0] Calling Groq with prompt")

    const { text: aiAnswer } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system: systemPrompt,
      prompt: question,
      maxTokens: 200,
    })

    console.log("[v0] Groq response received:", aiAnswer)
    return Response.json({ answer: aiAnswer, source: "ai" })
  } catch (error) {
    console.error("[v0] Help chat error:", error)
    return Response.json({ error: "Failed to process question", details: String(error) }, { status: 500 })
  }
}
