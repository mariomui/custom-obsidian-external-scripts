// author: @mariomui
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
  description: {
    name: 'Proofing comment',
    description: '<span color...>',
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
      const targetRegex = /\[{1}(.*)\]{1}/g; // https://regex101.com/r/8Qzbod/1

      const contents = i.contents?.replace(
        targetRegex,
        function (_fullmatch, ...args) {
          const first = args.first();
          if (first.match(targetRegex)) {
            return first;
          }
          const scraped_text = first;
          const template = `<span style="color:red">\[ ${scraped_text} \]</span>`;
          return template;
        }
      );
      return { ...i, contents };
    });
  },
};
