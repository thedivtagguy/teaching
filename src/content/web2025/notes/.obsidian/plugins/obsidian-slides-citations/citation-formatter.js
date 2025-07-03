// Citation Formatter for Obsidian
// This script converts citation keys to Chicago style citations and builds a bibliography

class CitationFormatter {
  constructor() {
    this.bibliographyItems = new Map(); // To track unique bibliography entries
    this.citationData = null;
  }

  // Load the BetterBibTeX JSON data
  async loadCitationData(app) {
    try {
      // You'll need to set the path to your BetterBibTeX JSON file
      const bibFilePath = "path/to/your/betterbibtex-export.json";
      
      // Read the JSON file using Obsidian API
      const file = app.vault.getAbstractFileByPath(bibFilePath);
      if (!file) {
        throw new Error(`Citation file not found at ${bibFilePath}`);
      }
      
      const content = await app.vault.read(file);
      this.citationData = JSON.parse(content);
      
      // Index citations by citation key for quick lookup
      this.citationIndex = {};
      this.citationData.items.forEach(item => {
        if (item.citekey) {
          this.citationIndex[item.citekey] = item;
        }
      });
      
      return true;
    } catch (error) {
      console.error("Failed to load citation data:", error);
      return false;
    }
  }

  // Format a citation in Chicago style
  formatChicagoCitation(item) {
    try {
      if (!item) return null;

      // Basic Chicago author-date format
      let citation = "";
      
      // Handle authors
      if (item.creators && item.creators.length > 0) {
        const authorNames = item.creators
          .filter(creator => creator.creatorType === "author")
          .map(author => {
            const lastName = author.lastName || "";
            const firstName = author.firstName || "";
            return `${lastName}, ${firstName}`;
          });
        
        if (authorNames.length === 1) {
          citation += authorNames[0];
        } else if (authorNames.length === 2) {
          citation += `${authorNames[0]} and ${authorNames[1]}`;
        } else if (authorNames.length > 2) {
          citation += `${authorNames[0]} et al.`;
        }
      } else {
        citation += "No Author";
      }
      
      // Add year
      const year = item.date ? new Date(item.date).getFullYear() : "n.d.";
      citation += ` (${year})`;
      
      return citation;
    } catch (error) {
      console.error("Error formatting citation:", error);
      return `[Citation Error: ${item.citekey || "unknown"}]`;
    }
  }

  // Format a full bibliography entry in Chicago style
  formatChicagoBibliography(item) {
    try {
      if (!item) return null;
      
      let bibEntry = "";
      
      // Authors
      if (item.creators && item.creators.length > 0) {
        const authors = item.creators
          .filter(creator => creator.creatorType === "author")
          .map(author => {
            const lastName = author.lastName || "";
            const firstName = author.firstName || "";
            return `${lastName}, ${firstName}`;
          });
        
        if (authors.length === 1) {
          bibEntry += authors[0];
        } else if (authors.length > 1) {
          const lastAuthor = authors.pop();
          bibEntry += `${authors.join(", ")}, and ${lastAuthor}`;
        }
      } else {
        bibEntry += "No Author";
      }
      
      // Year
      const year = item.date ? new Date(item.date).getFullYear() : "n.d.";
      bibEntry += `. ${year}. `;
      
      // Title
      if (item.title) {
        // Books, theses are italicized
        if (["book", "thesis"].includes(item.itemType)) {
          bibEntry += `*${item.title}*. `;
        } 
        // Articles, chapters are in quotes
        else if (["journalArticle", "bookSection", "magazineArticle"].includes(item.itemType)) {
          bibEntry += `"${item.title}." `;
        } else {
          bibEntry += `${item.title}. `;
        }
      }
      
      // Publication info based on item type
      switch (item.itemType) {
        case "journalArticle":
          bibEntry += item.publicationTitle ? `*${item.publicationTitle}* ` : "";
          bibEntry += item.volume ? `${item.volume}` : "";
          bibEntry += item.issue ? `, no. ${item.issue}` : "";
          bibEntry += item.pages ? `: ${item.pages}` : "";
          bibEntry += ".";
          break;
          
        case "book":
          bibEntry += item.place ? `${item.place}: ` : "";
          bibEntry += item.publisher ? `${item.publisher}` : "";
          bibEntry += ".";
          break;
          
        case "bookSection":
          bibEntry += `In *${item.bookTitle || ""}*`;
          bibEntry += item.pages ? `, ${item.pages}` : "";
          bibEntry += ". ";
          bibEntry += item.place ? `${item.place}: ` : "";
          bibEntry += item.publisher ? `${item.publisher}` : "";
          bibEntry += ".";
          break;
          
        default:
          bibEntry += item.url ? `${item.url}` : "";
          bibEntry += ".";
      }
      
      return bibEntry;
    } catch (error) {
      console.error("Error formatting bibliography:", error);
      return `[Bibliography Error: ${item.citekey || "unknown"}]`;
    }
  }

  // Process the current note to find and replace citation keys
  async processCitations(editor, app) {
    if (!this.citationData) {
      const loaded = await this.loadCitationData(app);
      if (!loaded) {
        new Notice("Failed to load citation data. Check the console for errors.");
        return;
      }
    }
    
    const content = editor.getValue();
    
    // Look for citation keys in the format @citekey or [@citekey]
    const citationKeyRegex = /@([a-zA-Z0-9_-]+)|\[@([a-zA-Z0-9_-]+)\]/g;
    let match;
    let newContent = content;
    
    while ((match = citationKeyRegex.exec(content)) !== null) {
      const citationKey = match[1] || match[2]; // Get the capture group that matched
      const fullMatch = match[0];
      
      const item = this.citationIndex[citationKey];
      if (item) {
        const citation = this.formatChicagoCitation(item);
        
        if (citation) {
          // Replace the citation key with the formatted citation
          const formattedCitation = fullMatch.startsWith('@') 
            ? citation 
            : `[${citation}]`;
          
          newContent = newContent.replace(fullMatch, formattedCitation);
          
          // Add to bibliography if not already included
          if (!this.bibliographyItems.has(citationKey)) {
            this.bibliographyItems.set(citationKey, item);
          }
        }
      }
    }
    
    // Update the content with formatted citations
    editor.setValue(newContent);
    
    // Generate or update the bibliography section
    this.updateBibliography(editor);
  }

  // Update or create the bibliography section
  updateBibliography(editor) {
    const content = editor.getValue();
    
    // Create the bibliography entries
    const entries = [...this.bibliographyItems.values()]
      .sort((a, b) => {
        // Sort by first author's last name
        const getAuthorLastName = item => {
          if (item.creators && item.creators.length > 0 && 
              item.creators[0].creatorType === "author" && 
              item.creators[0].lastName) {
            return item.creators[0].lastName.toLowerCase();
          }
          return "";
        };
        
        const lastNameA = getAuthorLastName(a);
        const lastNameB = getAuthorLastName(b);
        
        return lastNameA.localeCompare(lastNameB);
      })
      .map(item => this.formatChicagoBibliography(item))
      .filter(entry => entry); // Remove any null entries
    
    // Check if a bibliography section already exists
    const bibSectionRegex = /## Bibliography[\s\S]*?(?=## |$)/;
    const bibSection = content.match(bibSectionRegex);
    
    if (bibSection) {
      // Update the existing bibliography
      const updatedContent = content.replace(
        bibSectionRegex,
        `## Bibliography\n\n${entries.join("\n\n")}\n\n`
      );
      editor.setValue(updatedContent);
    } else {
      // Add a new bibliography section at the end
      const updatedContent = content + 
        (content.endsWith("\n\n") ? "" : "\n\n") +
        `## Bibliography\n\n${entries.join("\n\n")}\n\n`;
      editor.setValue(updatedContent);
    }
  }
}

module.exports = CitationFormatter;
