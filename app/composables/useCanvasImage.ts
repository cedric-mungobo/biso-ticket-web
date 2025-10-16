import { ref } from "vue";

export const useCanvasImage = () => {
  const isGenerating = ref(false);

  const generateInvitationImage = async (invitationData: {
    guestMessage?: string;
    backgroundImage?: string;
    textStartY?: number;
    textColor?: string;
    titleColor?: string;
    accentColor?: string;
    signatureColor?: string;
    messagePadding?: number;
    textAlign?: "left" | "center" | "right";
    messageFontSize?: number;
  }) => {
    if (!process.client) {
      throw new Error("Canvas ne peut être utilisé que côté client");
    }

    isGenerating.value = true;

    try {
      // Créer un canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Impossible de créer le contexte Canvas");
      }

      // Dimensions du canvas
      const width = 1000;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;

      // Fond blanc par défaut d'abord
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Charger l'image de fond si fournie
      if (invitationData.backgroundImage) {
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve) => {
          img.onload = () => {
            if (process.dev)
              console.log("🎨 Dessin de l'image de fond sur le canvas");
            // Dessiner l'image de fond par-dessus le fond blanc
            ctx.drawImage(img, 0, 0, width, height);
            // Forcer le redraw
            ctx.save();
            ctx.restore();
            resolve(true);
          };
          img.onerror = () => {
            if (process.dev)
              console.log(
                "❌ Erreur chargement image principale, utilisation du fallback",
              );
            // Fallback vers template_default.png
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = "anonymous";
            fallbackImg.onload = () => {
              if (process.dev)
                console.log("🎨 Dessin de l'image de fallback sur le canvas");
              ctx.drawImage(fallbackImg, 0, 0, width, height);
              ctx.save();
              ctx.restore();
              resolve(true);
            };
            fallbackImg.onerror = () => {
              if (process.dev)
                console.log(
                  "❌ Erreur chargement fallback, garde le fond blanc",
                );
              resolve(true);
            };
            fallbackImg.src = "/models/template_default.png";
          };
          img.src = invitationData.backgroundImage!;
        });
      }

      // Configuration des polices
      const primaryFont =
        "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif";
      const serifFont = "Georgia, Times New Roman, serif";
      const scriptFont = "Brush Script MT, cursive";

      // Couleurs élégantes avec possibilité de personnalisation
      const primaryColor = invitationData.textColor || "#2d3748"; // gray-700
      const accentColor = invitationData.accentColor || "#d4af37"; // gold
      const titleColor = invitationData.titleColor || "#2d3748"; // gray-700
      const secondaryColor = "#8b5a3c"; // brown
      const lightGray = "#718096"; // gray-500
      const veryLightGray = "#e2e8f0"; // gray-200

      // Fonction pour dessiner du texte avec wrap et gestion des retours à la ligne
      const drawText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize: number,
        fontFamily: string,
        color: string,
        align: "left" | "center" | "right" = "center",
      ) => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = "top";

        if (process.dev) console.log("🎨 === DEBUT DRAWTEXT ===");
        if (process.dev)
          console.log("🎨 Paramètres:", {
            text: text.substring(0, 100) + "...",
            x,
            y,
            maxWidth,
            fontSize,
            fontFamily,
            color,
            align,
          });
        if (process.dev) console.log("🎨 Dessin du texte avec couleur:", color);

        // Traiter le formatage personnalisé
        const processedText = processCanvasFormatting(text);
        if (process.dev) console.log("🎨 Texte original:", text);
        if (process.dev) console.log("🎨 Texte traité:", processedText);

        // Diviser le texte en lignes (retours à la ligne)
        const lines = processedText.split("\n");
        if (process.dev)
          console.log("🎨 Lignes à traiter:", lines.length, lines);
        if (process.dev)
          console.log("🎨 Largeur maximale disponible:", maxWidth);

        let lineY = y;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          if (process.dev)
            console.log(
              `🎨 Traitement ligne ${lineIndex + 1}/${lines.length}:`,
              line,
            );

          if (!line || line.trim() === "") {
            // Ligne vide - ajouter un espacement
            lineY += fontSize * 1.2;
            continue;
          }

          // Vérifier d'abord les alignements spéciaux
          const rightAlignMatch = line.match(/^\[>(.*?)<\]$/);
          const leftAlignMatch = line.match(/^\[<(.*?)<\]$/);
          const centerAlignMatch = line.match(/^\[>(.*?)>\]$/);

          if (rightAlignMatch) {
            const content = rightAlignMatch[1];
            if (process.dev)
              console.log("🎨 Alignement à droite détecté:", content);

            // Définir l'alignement du contexte
            ctx.textAlign = "right";

            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textMetrics = ctx.measureText(content || "");
            const availableWidth =
              width - 2 * (invitationData.messagePadding || 120);
            const effectiveMaxWidth = Math.min(maxWidth, availableWidth);

            if (textMetrics.width > effectiveMaxWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || "").split(" ");
              let currentLine = "";

              for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (!word) continue;

                const testLine = currentLine + (currentLine ? " " : "") + word;
                const testMetrics = ctx.measureText(testLine);

                if (testMetrics.width <= effectiveMaxWidth) {
                  currentLine = testLine;
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = "right";
                    const lineX =
                      width - (invitationData.messagePadding || 120);
                    drawFormattedText(
                      ctx,
                      currentLine,
                      lineX,
                      lineY,
                      fontSize,
                      fontFamily,
                      color,
                      "right",
                    );
                    lineY += fontSize * 1.8;
                  }
                  currentLine = word;
                }
              }

              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = "right";
                const lineX = width - (invitationData.messagePadding || 120);
                drawFormattedText(
                  ctx,
                  currentLine,
                  lineX,
                  lineY,
                  fontSize,
                  fontFamily,
                  color,
                  "right",
                );
                lineY += fontSize * 1.8;
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = "right";
              const lineX = width - (invitationData.messagePadding || 120);

              if (process.dev)
                console.log("🎨 Position de dessin (droite):", {
                  lineX,
                  lineY,
                });
              drawFormattedText(
                ctx,
                content || "",
                lineX,
                lineY,
                fontSize,
                fontFamily,
                color,
                "right",
              );
              lineY += fontSize * 1.8;
            }

            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          if (leftAlignMatch) {
            const content = leftAlignMatch[1];
            if (process.dev)
              console.log("🎨 Alignement à gauche détecté:", content);

            // Définir l'alignement du contexte
            ctx.textAlign = "left";

            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textMetrics = ctx.measureText(content || "");
            const availableWidth =
              width - 2 * (invitationData.messagePadding || 120);
            const effectiveMaxWidth = Math.min(maxWidth, availableWidth);

            if (textMetrics.width > effectiveMaxWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || "").split(" ");
              let currentLine = "";

              for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (!word) continue;

                const testLine = currentLine + (currentLine ? " " : "") + word;
                const testMetrics = ctx.measureText(testLine);

                if (testMetrics.width <= effectiveMaxWidth) {
                  currentLine = testLine;
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = "left";
                    const lineX = invitationData.messagePadding || 120;
                    drawFormattedText(
                      ctx,
                      currentLine,
                      lineX,
                      lineY,
                      fontSize,
                      fontFamily,
                      color,
                      "left",
                    );
                    lineY += fontSize * 1.8;
                  }
                  currentLine = word;
                }
              }

              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = "left";
                const lineX = invitationData.messagePadding || 120;
                drawFormattedText(
                  ctx,
                  currentLine,
                  lineX,
                  lineY,
                  fontSize,
                  fontFamily,
                  color,
                  "left",
                );
                lineY += fontSize * 1.8;
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = "left";
              const lineX = invitationData.messagePadding || 120;

              if (process.dev)
                console.log("🎨 Position de dessin (gauche):", {
                  lineX,
                  lineY,
                });
              drawFormattedText(
                ctx,
                content || "",
                lineX,
                lineY,
                fontSize,
                fontFamily,
                color,
                "left",
              );
              lineY += fontSize * 1.8;
            }

            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          if (centerAlignMatch) {
            const content = centerAlignMatch[1];
            if (process.dev)
              console.log("🎨 Alignement centré détecté:", content);

            // Définir l'alignement du contexte
            ctx.textAlign = "center";

            // Vérifier si le texte déborde
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textMetrics = ctx.measureText(content || "");
            const availableWidth =
              width - 2 * (invitationData.messagePadding || 120);

            if (textMetrics.width > availableWidth) {
              // Diviser le texte en plusieurs lignes
              const words = (content || "").split(" ");
              let currentLine = "";

              for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (!word) continue;

                const testLine = currentLine + (currentLine ? " " : "") + word;
                const testMetrics = ctx.measureText(testLine);

                if (testMetrics.width <= availableWidth) {
                  currentLine = testLine;
                } else {
                  // Dessiner la ligne actuelle
                  if (currentLine) {
                    ctx.textAlign = "center";
                    const lineX = width / 2;
                    drawFormattedText(
                      ctx,
                      currentLine,
                      lineX,
                      lineY,
                      fontSize,
                      fontFamily,
                      color,
                      "center",
                    );
                    lineY += fontSize * 1.8;
                  }
                  currentLine = word;
                }
              }

              // Dessiner la dernière ligne
              if (currentLine) {
                ctx.textAlign = "center";
                const lineX = width / 2;
                drawFormattedText(
                  ctx,
                  currentLine,
                  lineX,
                  lineY,
                  fontSize,
                  fontFamily,
                  color,
                  "center",
                );
                lineY += fontSize * 1.8;
              }
            } else {
              // Le texte tient sur une ligne
              ctx.textAlign = "center";
              const lineX = width / 2;

              if (process.dev)
                console.log("🎨 Position de dessin (centré):", {
                  lineX,
                  lineY,
                });
              drawFormattedText(
                ctx,
                content || "",
                lineX,
                lineY,
                fontSize,
                fontFamily,
                color,
                "center",
              );
              lineY += fontSize * 1.8;
            }

            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          // Traitement spécial pour les titres (seulement si ce n'est pas un alignement et si c'est explicitement un titre)
          const isExplicitTitle = line.match(/^\[#+.*#+\]$/);
          if (
            isExplicitTitle &&
            (lineIndex === 0 || (lineIndex === 1 && !lines[0]?.trim()))
          ) {
            if (process.dev)
              console.log(
                "🎨 Première ligne détectée comme titre EXPLICITE:",
                line,
              );

            // Détecter le niveau du titre et nettoyer le texte
            let cleanTitle = line;
            let titleLevel = 1;
            let titleSize = fontSize * 1.5;

            // Détecter le niveau du titre
            if (line.match(/^\[###/)) {
              titleLevel = 3;
              titleSize = fontSize * 1.1;
              cleanTitle = cleanTitle.replace(/^\[###\s*(.*?)\s*###\]$/, "$1");
            } else if (line.match(/^\[##/)) {
              titleLevel = 2;
              titleSize = fontSize * 1.2;
              cleanTitle = cleanTitle.replace(/^\[##\s*(.*?)\s*##\]$/, "$1");
            } else if (line.match(/^\[#/)) {
              titleLevel = 1;
              titleSize = fontSize * 1.5;
              cleanTitle = cleanTitle.replace(/^\[#\s*(.*?)\s*#\]$/, "$1");
            }

            // Enlever les espaces en début et fin
            cleanTitle = cleanTitle.trim();

            if (process.dev)
              console.log(
                `🎨 Titre niveau ${titleLevel} nettoyé:`,
                cleanTitle,
                `(taille: ${titleSize})`,
              );

            // Dessiner le titre avec la taille appropriée
            ctx.font = `bold ${titleSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            const titleX = width / 2;

            // Appliquer les majuscules seulement pour le niveau 1
            const displayText =
              titleLevel === 1 ? cleanTitle.toUpperCase() : cleanTitle;
            ctx.fillText(displayText, titleX, lineY);

            // Espacement selon le niveau
            const spacing = titleLevel === 1 ? fontSize * 2 : fontSize * 1.6;
            lineY += spacing;

            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          // Vérifier si la ligne est un titre
          const titleMatch = line.match(/^\[#(.*?)#\]$/);
          const subtitleMatch = line.match(/^\[##(.*?)##\]$/);
          const subsubtitleMatch = line.match(/^\[###(.*?)###\]$/);

          if (titleMatch) {
            const content = titleMatch[1] || "";
            if (process.dev)
              console.log("🎨 Titre principal détecté:", content);

            // Dessiner le titre en plus grand et en gras
            ctx.font = `bold ${fontSize * 1.5}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            const titleX = width / 2;
            ctx.fillText(content.toUpperCase(), titleX, lineY);
            lineY += fontSize * 2; // Plus d'espace après le titre
            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          if (subtitleMatch) {
            const content = subtitleMatch[1] || "";
            if (process.dev) console.log("🎨 Sous-titre détecté:", content);

            // Dessiner le sous-titre en plus grand
            ctx.font = `bold ${fontSize * 1.2}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            const subtitleX = width / 2;
            ctx.fillText(content, subtitleX, lineY);
            lineY += fontSize * 1.8;
            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          if (subsubtitleMatch) {
            const content = subsubtitleMatch[1] || "";
            if (process.dev)
              console.log("🎨 Sous-sous-titre détecté:", content);

            // Dessiner le sous-sous-titre en légèrement plus grand
            ctx.font = `bold ${fontSize * 1.1}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            const subsubtitleX = width / 2;
            ctx.fillText(content, subsubtitleX, lineY);
            lineY += fontSize * 1.6;
            ctx.textAlign = align; // Restaurer l'alignement par défaut
            continue;
          }

          // Calculer la largeur disponible correctement
          const availableWidth =
            width - 2 * (invitationData.messagePadding || 120);
          const effectiveMaxWidth = Math.min(maxWidth, availableWidth);

          // Mesurer la ligne complète
          ctx.font = `${fontSize}px ${fontFamily}`;
          const lineMetrics = ctx.measureText(line);

          if (process.dev)
            console.log(
              `🎨 Ligne "${line.substring(0, 50)}..." - Largeur: ${lineMetrics.width}px vs Max: ${effectiveMaxWidth}px (dispo: ${availableWidth}px)`,
            );

          if (lineMetrics.width <= effectiveMaxWidth) {
            // La ligne tient dans la largeur maximale
            if (process.dev)
              console.log("✅ Ligne complète dessinée (tient):", line);
            drawFormattedText(
              ctx,
              line,
              x,
              lineY,
              fontSize,
              fontFamily,
              color,
              align,
            );
            lineY += fontSize * 1.8;
          } else {
            // La ligne est trop longue, la diviser en mots avec gestion des mots longs
            if (process.dev)
              console.log("🎨 Ligne trop longue, division en cours:", line);
            const words = line.split(" ");
            let currentLine = "";

            for (let i = 0; i < words.length; i++) {
              const word = words[i];
              if (!word) continue;

              // Vérifier si le mot seul est trop long
              ctx.font = `${fontSize}px ${fontFamily}`;
              const wordMetrics = ctx.measureText(word);

              if (wordMetrics.width > effectiveMaxWidth) {
                // Le mot est trop long, le diviser caractère par caractère
                if (process.dev)
                  console.log(
                    "🎨 Mot trop long, division par caractères:",
                    word,
                  );

                // D'abord dessiner la ligne en cours si elle n'est pas vide
                if (currentLine.trim()) {
                  drawFormattedText(
                    ctx,
                    currentLine.trim(),
                    x,
                    lineY,
                    fontSize,
                    fontFamily,
                    color,
                  );
                  lineY += fontSize * 1.8;
                  currentLine = "";
                }

                // Diviser le mot long en parties
                let wordPart = "";
                for (let j = 0; j < word.length; j++) {
                  const char = word[j];
                  const testWord = wordPart + (char || "");
                  const testMetrics = ctx.measureText(testWord);

                  if (testMetrics.width <= effectiveMaxWidth) {
                    wordPart = testWord;
                  } else {
                    // Dessiner la partie du mot
                    if (wordPart) {
                      drawFormattedText(
                        ctx,
                        wordPart,
                        x,
                        lineY,
                        fontSize,
                        fontFamily,
                        color,
                      );
                      lineY += fontSize * 1.8;
                    }
                    wordPart = char || "";
                  }
                }

                // Dessiner la dernière partie du mot
                if (wordPart) {
                  drawFormattedText(
                    ctx,
                    wordPart,
                    x,
                    lineY,
                    fontSize,
                    fontFamily,
                    color,
                  );
                  lineY += fontSize * 1.8;
                }
              } else {
                // Le mot n'est pas trop long, traitement normal
                const testLine = currentLine + (currentLine ? " " : "") + word;
                const testMetrics = ctx.measureText(testLine);

                if (testMetrics.width <= effectiveMaxWidth) {
                  currentLine = testLine;
                } else {
                  // Dessiner la ligne actuelle si elle n'est pas vide
                  if (currentLine.trim()) {
                    if (process.dev)
                      console.log(
                        "🎨 Ligne partielle dessinée:",
                        currentLine.trim(),
                      );
                    drawFormattedText(
                      ctx,
                      currentLine.trim(),
                      x,
                      lineY,
                      fontSize,
                      fontFamily,
                      color,
                    );
                    lineY += fontSize * 1.8;
                  }
                  currentLine = word;
                }
              }
            }

            // Dessiner la dernière ligne
            if (currentLine.trim()) {
              if (process.dev)
                console.log("🎨 Dernière ligne dessinée:", currentLine.trim());
              drawFormattedText(
                ctx,
                currentLine.trim(),
                x,
                lineY,
                fontSize,
                fontFamily,
                color,
              );
              lineY += fontSize * 1.8;
            }
          }
        }

        if (process.dev) console.log("🎨 === FIN DRAWTEXT ===");
        if (process.dev)
          console.log(
            "🎨 Fin du traitement du texte. Dernière position Y:",
            lineY,
          );
        return lineY;
      };

      // Fonction utilitaire pour dessiner du texte avec wrap automatique
      const drawTextWithWrap = (
        text: string,
        y: number,
        maxWidth: number,
        fontSize: number,
        fontFamily: string,
        color: string,
        align: "left" | "center" | "right" = "left",
      ) => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = "top";

        if (process.dev)
          console.log(
            `🎨 drawTextWithWrap: "${text.substring(0, 50)}..." (maxWidth: ${maxWidth}px)`,
          );

        // Mesurer le texte
        const metrics = ctx.measureText(text);

        if (metrics.width <= maxWidth) {
          // Le texte tient sur une ligne
          let xPos = 0;
          if (align === "center") xPos = width / 2;
          else if (align === "right")
            xPos = width - (invitationData.messagePadding || 120);
          else xPos = invitationData.messagePadding || 120;

          ctx.fillText(text, xPos, y);
          if (process.dev) console.log("🎨 Texte sur une ligne:", text);
          return 1;
        } else {
          // Le texte doit être divisé
          const words = text.split(" ");
          let lines = [];
          let currentLine = "";

          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const testMetrics = ctx.measureText(testLine);

            if (testMetrics.width <= effectiveMaxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                lines.push(currentLine);
                currentLine = word || "";
              } else {
                // Le mot seul est trop long, le diviser caractère par caractère
                if (word)
                  lines.push(
                    ...breakLongWord(word, maxWidth, fontSize, fontFamily),
                  );
              }
            }
          }

          if (currentLine) {
            lines.push(currentLine);
          }

          // Dessiner chaque ligne
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let xPos = 0;
            if (align === "center") xPos = width / 2;
            else if (align === "right")
              xPos = width - (invitationData.messagePadding || 120);
            else xPos = invitationData.messagePadding || 120;

            if (line) ctx.fillText(line, xPos, y + i * fontSize * 1.8);
            if (process.dev)
              console.log(`🎨 Ligne ${i + 1}/${lines.length}:`, line);
          }

          return lines.length;
        }
      };

      // Fonction pour diviser un mot trop long
      const breakLongWord = (
        word: string,
        maxWidth: number,
        fontSize: number,
        fontFamily: string,
      ): string[] => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        const parts = [];
        let currentPart = "";

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          const testPart = currentPart + char;
          const metrics = ctx.measureText(testPart);

          if (metrics.width <= maxWidth) {
            currentPart = testPart;
          } else {
            if (currentPart) {
              parts.push(currentPart);
              currentPart = char || "";
            } else {
              parts.push(char);
            }
          }
        }

        if (currentPart) {
          parts.push(currentPart);
        }

        return parts.filter((p) => p !== undefined) as string[];
      };

      // Fonction pour traiter le formatage Canvas
      const processCanvasFormatting = (text: string): string => {
        if (process.dev) console.log("🎨 === PROCESS CANVAS FORMATTING ===");
        if (process.dev) console.log("🎨 Texte HTML entrant:", text);

        // Créer un élément temporaire pour parser le HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;

        // Fonction récursive pour extraire le texte avec formatage
        const extractText = (element: Element): string => {
          let result = "";

          for (const node of Array.from(element.childNodes)) {
            if (node.nodeType === Node.TEXT_NODE) {
              result += node.textContent || "";
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              const tagName = el.tagName.toLowerCase();

              // Ajouter des retours à la ligne selon les balises
              if (["br", "br/"].includes(tagName)) {
                result += "\n";
              } else if (["p", "div"].includes(tagName)) {
                // Vérifier les classes d'alignement
                const className = el.getAttribute("class") || "";
                const textContent = extractText(el);

                if (className.includes("text-right")) {
                  result += "[>" + textContent + "<]\n";
                } else if (className.includes("text-left")) {
                  result += "[<" + textContent + "<]\n";
                } else if (className.includes("text-center")) {
                  result += "[>" + textContent + ">]\n";
                } else {
                  result += textContent + "\n\n";
                }
              } else if (
                ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)
              ) {
                result += "\n" + extractText(el) + "\n";
              } else if (["strong", "b"].includes(tagName)) {
                result += "**" + extractText(el) + "**";
              } else if (["em", "i"].includes(tagName)) {
                result += "*" + extractText(el) + "*";
              } else if (["u"].includes(tagName)) {
                result += "_" + extractText(el) + "_";
              } else if (["s", "strike"].includes(tagName)) {
                result += "~" + extractText(el) + "~";
              } else if (["code"].includes(tagName)) {
                result += "`" + extractText(el) + "`";
              } else {
                result += extractText(el);
              }
            }
          }

          return result;
        };

        // Extraire le texte formaté
        let processed = extractText(tempDiv);

        // Nettoyer les espaces et retours à la ligne
        processed = processed
          .replace(/\n\s*\n\s*\n+/g, "\n\n") // Remplacer les retours à la ligne multiples
          .replace(/[ \t]+/g, " ") // Nettoyer les espaces multiples
          .replace(/^[ \t]+|[ \t]+$/gm, "") // Nettoyer les espaces en début/fin de ligne
          .trim(); // Supprimer les espaces en début/fin

        if (process.dev) console.log("🎨 Texte formaté sortant:", processed);
        if (process.dev)
          console.log("🎨 === FIN PROCESS CANVAS FORMATTING ===");

        return processed;
      };

      // Fonction pour dessiner du texte avec formatage
      const drawFormattedText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        fontSize: number,
        fontFamily: string,
        color: string,
        textAlign: "left" | "center" | "right" = "left",
      ) => {
        if (process.dev)
          console.log("🎨 drawFormattedText:", {
            text: text.substring(0, 50) + "...",
            x,
            y,
            fontSize,
          });

        // Diviser le texte en segments avec formatage
        const segments = parseFormattedText(text);

        // S'assurer que le contexte a le bon alignement
        ctx.textAlign = textAlign;

        // Utiliser la position X directement - laisser Canvas gérer l'alignement nativement
        let currentX = x;

        if (process.dev) {
          console.log("🎨 drawFormattedText - alignement Canvas natif:", {
            textAlign,
            positionX: x,
            textPreview: text.substring(0, 30) + "...",
          });
        }

        for (const segment of segments) {
          // Appliquer le formatage approprié
          if (segment.bold) {
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
          } else if (segment.italic) {
            ctx.font = `italic ${fontSize}px ${fontFamily}`;
          } else if (segment.underline) {
            ctx.font = `${fontSize}px ${fontFamily}`;
            // Note: Canvas ne supporte pas nativement le soulignement, on peut l'ajouter manuellement
          } else if (segment.strikethrough) {
            ctx.font = `${fontSize}px ${fontFamily}`;
            // Note: Canvas ne supporte pas nativement le barré, on peut l'ajouter manuellement
          } else {
            ctx.font = `${fontSize}px ${fontFamily}`;
          }

          ctx.fillStyle = color;
          ctx.fillText(segment.text, currentX, y);

          // Mesurer le texte pour positionner le suivant
          const metrics = ctx.measureText(segment.text);
          currentX += metrics.width;
        }
      };

      // Fonction pour parser le texte formaté
      const parseFormattedText = (text: string) => {
        const segments: Array<{
          text: string;
          bold?: boolean;
          italic?: boolean;
          underline?: boolean;
          strikethrough?: boolean;
        }> = [];
        let currentText = text;

        // Traiter le formatage dans l'ordre de priorité (le plus spécifique en premier)
        while (currentText.length > 0) {
          // Chercher le prochain formatage
          const boldMatch = currentText.match(/\*\*(.*?)\*\*/);
          const italicMatch = currentText.match(/\*(.*?)\*/);
          const underlineMatch = currentText.match(/_(.*?)_/);
          const strikethroughMatch = currentText.match(/~(.*?)~/);
          const codeMatch = currentText.match(/`(.*?)`/);

          // Trouver le match le plus proche
          let closestMatch = null;
          let closestIndex = Infinity;
          let matchType = "";

          if (boldMatch && boldMatch.index! < closestIndex) {
            closestMatch = boldMatch;
            closestIndex = boldMatch.index!;
            matchType = "bold";
          }
          if (italicMatch && italicMatch.index! < closestIndex) {
            closestMatch = italicMatch;
            closestIndex = italicMatch.index!;
            matchType = "italic";
          }
          if (underlineMatch && underlineMatch.index! < closestIndex) {
            closestMatch = underlineMatch;
            closestIndex = underlineMatch.index!;
            matchType = "underline";
          }
          if (strikethroughMatch && strikethroughMatch.index! < closestIndex) {
            closestMatch = strikethroughMatch;
            closestIndex = strikethroughMatch.index!;
            matchType = "strikethrough";
          }
          if (codeMatch && codeMatch.index! < closestIndex) {
            closestMatch = codeMatch;
            closestIndex = codeMatch.index!;
            matchType = "code";
          }

          if (closestMatch && closestIndex < Infinity) {
            // Ajouter le texte avant le formatage
            if (closestIndex > 0) {
              segments.push({ text: currentText.substring(0, closestIndex) });
            }

            // Ajouter le texte formaté
            const formattedText = closestMatch[1];
            const segment: any = { text: formattedText };

            if (matchType === "bold") segment.bold = true;
            else if (matchType === "italic") segment.italic = true;
            else if (matchType === "underline") segment.underline = true;
            else if (matchType === "strikethrough")
              segment.strikethrough = true;
            else if (matchType === "code") segment.code = true;

            segments.push(segment);

            // Continuer avec le reste du texte
            currentText = currentText.substring(
              closestIndex + closestMatch[0].length,
            );
          } else {
            // Plus de formatage, ajouter le reste du texte
            if (currentText.length > 0) {
              segments.push({ text: currentText });
            }
            break;
          }
        }

        return segments;
      };

      // Fonction pour dessiner du texte centré
      const drawCenteredText = (
        text: string,
        y: number,
        fontSize: number,
        fontFamily: string,
        color: string,
        maxWidth?: number,
      ) => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        if (process.dev)
          console.log("🎨 Dessin du texte centré avec couleur:", color);

        if (maxWidth) {
          return drawText(
            text,
            width / 2,
            y,
            maxWidth,
            fontSize,
            fontFamily,
            color,
            "center",
          );
        } else {
          ctx.fillText(text, width / 2, y);
          return y + fontSize * 1.2;
        }
      };

      // Ne pas dessiner de fond dégradé si on a une image de fond
      if (!invitationData.backgroundImage) {
        // Dessiner un fond dégradé subtil seulement si pas d'image
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#fefefe");
        gradient.addColorStop(1, "#f8f9fa");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Pas d'éléments décoratifs pour laisser l'image de fond visible

      // Titre principal élégant
      let currentY = invitationData.textStartY || 120;

      // Titre principal
      currentY = drawCenteredText(
        "INVITATION",
        currentY,
        42,
        serifFont,
        titleColor,
      );

      currentY += 60;

      // Message personnalisé uniquement
      if (invitationData.guestMessage && invitationData.guestMessage.trim()) {
        // Calculer le padding horizontal du message (par défaut 120px de chaque côté)
        const messagePaddingX = invitationData.messagePadding || 120;
        const messageWidth = width - messagePaddingX * 2;

        // Calculer la position X selon l'alignement
        const textAlign = invitationData.textAlign || "center";
        let textX = width / 2;
        if (textAlign === "left") {
          textX = messagePaddingX;
        } else if (textAlign === "right") {
          textX = width - messagePaddingX;
        }

        // Utiliser la fonction drawText améliorée pour gérer les retours à la ligne
        const fontSize = invitationData.messageFontSize || 20;
        if (process.dev) console.log("🎨 === APPEL DRAWTEXT POUR MESSAGE ===");
        if (process.dev)
          console.log("🎨 Taille de police du message:", fontSize);
        if (process.dev)
          console.log(
            "🎨 Message à traiter:",
            invitationData.guestMessage?.substring(0, 200) + "...",
          );
        if (process.dev)
          console.log("🎨 Paramètres canvas:", {
            textX,
            currentY,
            messageWidth,
            fontSize,
            textAlign,
          });
        currentY = drawText(
          invitationData.guestMessage,
          textX,
          currentY,
          messageWidth,
          fontSize,
          primaryFont,
          primaryColor,
          textAlign,
        );
        if (process.dev) console.log("🎨 === FIN APPEL DRAWTEXT ===");
      }

      currentY += 80;

      // Signature élégante (couleur différente du texte principal)
      const signatureColor =
        invitationData.signatureColor ||
        invitationData.accentColor ||
        "#d4af37";
      currentY = drawCenteredText(
        "Powered by bisoticket.com",
        currentY,
        18,
        primaryFont,
        signatureColor,
      );

      // Ajouter des ombres subtiles pour plus d'élégance
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Test : afficher le canvas sur la page pour debug
      const canvasElement = canvas as HTMLCanvasElement;
      canvasElement.style.position = "fixed";
      canvasElement.style.top = "10px";
      canvasElement.style.right = "10px";
      canvasElement.style.zIndex = "9999";
      canvasElement.style.border = "2px solid red";
      canvasElement.style.maxWidth = "200px";
      canvasElement.style.maxHeight = "240px";
      document.body.appendChild(canvasElement);

      // Supprimer le canvas après 5 secondes
      setTimeout(() => {
        if (document.body.contains(canvasElement)) {
          document.body.removeChild(canvasElement);
        }
      }, 5000);

      // Convertir en blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Erreur lors de la conversion Canvas en Blob"));
            }
          },
          "image/png",
          1.0,
        );
      });
    } catch (error) {
      throw error;
    } finally {
      isGenerating.value = false;
    }
  };

  const downloadInvitationImage = async (invitationData: {
    guestMessage?: string;
    backgroundImage?: string;
    textStartY?: number;
    textColor?: string;
    titleColor?: string;
    accentColor?: string;
    signatureColor?: string;
    messagePadding?: number;
    textAlign?: "left" | "center" | "right";
    messageFontSize?: number;
  }) => {
    try {
      const blob = await generateInvitationImage(invitationData);

      // Créer le lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invitation-${Date.now()}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    isGenerating,
    generateInvitationImage,
    downloadInvitationImage,
  };
};
