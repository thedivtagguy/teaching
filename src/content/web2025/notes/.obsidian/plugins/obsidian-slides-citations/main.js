const { Plugin } = require('obsidian');
const CitationFormatter = require('./citationFormatter');

class CitationFormatterPlugin extends Plugin {
  async onload() {
    console.log('Loading Citation Formatter Plugin');
    
    // Initialize the citation formatter
    this.formatter = new CitationFormatter();
    
    // Add a ribbon icon
    this.addRibbonIcon('quote-glyph', 'Format Citations', async () => {
      const activeLeaf = this.app.workspace.getActiveViewOfType('markdown');
      if (activeLeaf) {
        const editor = activeLeaf.editor;
        await this.formatter.processCitations(editor, this.app);
        new Notice('Citations processed successfully');
      } else {
        new Notice('No active Markdown editor');
      }
    });
    
    // Add a command that can be triggered anywhere
    this.addCommand({
      id: 'format-citations',
      name: 'Format Citations and Create Bibliography',
      editorCallback: async (editor) => {
        await this.formatter.processCitations(editor, this.app);
        new Notice('Citations processed successfully');
      }
    });

    // Add a settings tab to configure the path to the BetterBibTeX JSON file
    this.addSettingTab(new CitationFormatterSettingTab(this.app, this));
  }

  onunload() {
    console.log('Unloading Citation Formatter Plugin');
  }
}

class CitationFormatterSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Citation Formatter Settings' });

    new Setting(containerEl)
      .setName('BetterBibTeX JSON File Path')
      .setDesc('Path to your BetterBibTeX JSON export file')
      .addText(text => text
        .setPlaceholder('path/to/your/bibliography.json')
        .setValue(this.plugin.settings?.bibFilePath || '')
        .onChange(async (value) => {
          if (!this.plugin.settings) this.plugin.settings = {};
          this.plugin.settings.bibFilePath = value;
          await this.plugin.saveSettings();
        }));
  }
}

module.exports = CitationFormatterPlugin;
