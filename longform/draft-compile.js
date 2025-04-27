let CompileStepKind;
(function (CompileStepKind) {
  CompileStepKind['Scene'] = 'Scene';
  CompileStepKind['Join'] = 'Join';
  CompileStepKind['Manuscript'] = 'Manuscript';
})(CompileStepKind || (CompileStepKind = {}));

let CompileStepOptionType;
(function (CompileStepOptionType) {
  CompileStepOptionType['Boolean'] = 'Boolean';
  CompileStepOptionType['Text'] = 'Text';
  CompileStepOptionType['MultilineText'] = 'MultilineText';
})(CompileStepOptionType || (CompileStepOptionType = {}));

module.exports = {
  description: {
    name: 'Save as Drafted Output',
    description: 'Saves your manuscript as a note in your vault.',
    availableKinds: [CompileStepKind.Manuscript],
    options: [
      {
        id: 'target',
        name: 'Output path',
        description: '$1 -> title, $d -> drafted title',
        type: CompileStepOptionType.Text,
        default: '$1-$d.md',
      },
      {
        id: 'open-after',
        name: 'Open Compiled Manuscript',
        description: 'If checked, open the compiled manuscript in a new pane.',
        type: CompileStepOptionType.Boolean,
        default: true,
      },
    ],
  },
  /**
   * @param {{ contents: string; }} input
   * @param {{ app: { metadataCache: { getFirstLinkpathDest: (arg0: any, arg1: any) => { (): any; new (): any; path: any; }; }; }; projectPath: any; }} context
   */
  compile: async function _compile(input, context) {
    const isodate = getCurrentDate();

    if (context.kind !== CompileStepKind.Manuscript) {
      throw new Error('Cannot write non-manuscript as note.');
    } else {
      let target = context.optionValues['target'];
      target = target.replace('$1', context.draft.title);
      target = target.replace('$d', context.draft.draftTitle || '');
      target = target.replace('$D', isodate);
      const openAfter = context.optionValues['open-after'];
      if (!target || target.length == 0) {
        throw new Error('Invalid path for Save as Note.');
      }

      let filePath = resolvePath(context.projectPath, target, {
        normalizePath: context.utilities.normalizePath,
      });

      const projectTfile = context.app.metadataCache.getFirstLinkpathDest(
        context.draft.title
      );
      if (
        projectTfile.extension === 'md' &&
        projectTfile.parent.hasOwnProperty('children')
      ) {
        // if the file is a drafted file, we need to remove the drafted folder from the path]
        const projectRootPath = projectTfile.parent.path;
        const projectOutputPath = resolvePath(projectRootPath, target, {
          normalizePath: context.utilities.normalizePath,
        });
        filePath = projectOutputPath;
      }
      // children and extension.
      // path basename

      await writeToFile(context.app, filePath, input.contents, {
        ensureContainingFolderExists,
      });

      if (openAfter) {
        console.log('[Longform] Attempting to open:', filePath);

        context.app.workspace.openLinkText(filePath, '/', true).catch((err) => {
          console.error('[Longform] Could not open', filePath, err);
        });
      }

      return input;
    }
  },
};

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T').first() || '';
}
function resolvePath(projectPath, filePath, { normalizePath }) {
  const filename = filePath.split('/').last();
  if (!filename.contains('.')) {
    filePath = filePath + '.md';
  }

  if (!filePath.startsWith('.')) {
    if (filePath.startsWith('/')) {
      // handle file path like: /filename.md
      return normalizePath(`${projectPath}${filePath}`);
    }
    return normalizePath(`${projectPath}/${filePath}`);
  }

  /*
  Possible paths:
    filename.md
    ./filename.md
    ../filename.md
    ../../../filename.md

    obsidian won't let you open these file, but we can write to them.  Should give a warning.
    ./.filename.md
    ../.filename.md
    ...md
    ../../...md
    .blah.md

    illegal paths (this will be caught when an attempt to write to these sorts of files is made)
    .../filename.md
    ./.../filename.md
    .md -> impossible due to blank check in WriteToNoteStep
  */

  return resolveRelativeFilePath(
    projectPath.split('/'),
    filePath.split('/'),
    true,
    { normalizePath }
  );
}

function resolveRelativeFilePath(
  projectPathComponents,
  filePathComponents,
  atStartOfFilePath,
  { normalizePath }
) {
  // should never be empty due to blank check in WriteToNoteStep
  // and String.split() will return an array of at least one element
  const filePathComponent = filePathComponents.first();
  switch (filePathComponent) {
    case '..': {
      // move up one folder
      if (projectPathComponents.length === 0) {
        // we moved up too many folders and ran out.
        throw new Error('[Longform] Invalid path for Save as Note.');
      }
      // remove the lowest-level folder from the project path to move up,
      // and take this first component off the top of the filePathComponents
      return resolveRelativeFilePath(
        projectPathComponents.slice(0, -1),
        filePathComponents.slice(1),
        false,
        { normalizePath }
      );
    }
    case '.': {
      // relative to current folder
      if (!atStartOfFilePath) {
        // illegal path like: ././filename.md
        throw new Error('[Longform] Invalid path for Save as Note.');
      }
      // stay here, but remove the first filepath component
      return resolveRelativeFilePath(
        projectPathComponents,
        filePathComponents.slice(1),
        false,
        { normalizePath }
      );
    }
    default: {
      const filename = filePathComponents.last();
      if (filename.startsWith('.')) {
        new Notice(
          'Obsidian cannot open files that begin with a dot. Consider a different name.'
        );
      }
      // assume there are no more ".." in the rest of the filePathComponents
      return normalizePath(
        projectPathComponents.concat(filePathComponents).join('/')
      );
    }
  }
}

async function writeToFile(
  app,
  filePath,
  contents,
  { ensureContainingFolderExists }
) {
  await ensureContainingFolderExists(app, filePath);

  console.log('[Longform] Writing to:', filePath);

  await app.vault.adapter.write(filePath, contents);
}

async function ensureContainingFolderExists(app, filePath) {
  const containingFolderParts = filePath.split('/');
  const containingFolderPath = containingFolderParts.slice(0, -1).join('/');

  try {
    await app.vault.createFolder(containingFolderPath);
  } catch (e) {
    // do nothing, folder already existed
  }
}
