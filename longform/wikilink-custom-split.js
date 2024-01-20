// author: @mariomui
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
  description: {
    name: 'Strip Special',
    description: 'ᛞ--path|alias -> path',
    availableKinds: ['Manuscript', 'Scene'],
    options: [],
  },

  /**
   * @param {{ contents: string; }} input
   * @param {{ app: { metadataCache: { getFirstLinkpathDest: (arg0: any, arg1: any) => { (): any; new (): any; path: any; }; }; }; projectPath: any; }} context
   */
  compile(input, context) {
    return input.map((i) => {
      const imageWikiLinkRegex = /\!{0,1}\[\[(.*?)(?:\|(.+))?\]\]/g; // https://regex101.com/r/8Qzbod/1
      const contents = i.contents?.replace(
        imageWikiLinkRegex,
        function (_fullmatch, ...args) {
          const alias = args.at(1);
          const target = args.at(0).split('#').first();
          if (target.includes('--')) {
            return target.split('--').at(1);
          }
          return target;
        }
      );
      return { ...i, contents };
    });
  },
};
