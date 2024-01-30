// author: @mariomui
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
  description: {
    name: 'Proofing highlight',
    description: '<span background...>',
    availableKinds: ['Manuscript', 'Scene'],
    options: [],
  },

  /**
   * @param {{ contents: string; }} input
   * @param {{ app: { metadataCache: { getFirstLinkpathDest: (arg0: any, arg1: any) => { (): any; new (): any; path: any; }; }; }; projectPath: any; }} context
   */
  compile(input, context) {
    if (context.kind.toLowerCase() !== 'scene') {
      return input;
    }
    return input.map((i) => {
      const targetRegex = /\={2}(.*)\={2}/g; // https://regex101.com/r/8Qzbod/1

      const contents = i.contents?.replace(
        targetRegex,
        function (_fullmatch, ...args) {
          const first = args.first();
          const scraped_text = first;
          const template = `<span style="background:yellow">${scraped_text}</span>`;
          return template;
        }
      );
      return { ...i, contents };
    });
  },
};
