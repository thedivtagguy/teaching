class CitationFormatterSettings {
  constructor() {
    this.bibFilePath = '';  // Path to the BetterBibTeX JSON file
    this.citationStyle = 'chicago'; // Default citation style
    this.insertBibliographyHeading = true; // Whether to add a bibliography heading
    this.bibliographyHeading = '## Bibliography'; // The heading text
  }
}

module.exports = CitationFormatterSettings;
