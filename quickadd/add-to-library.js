const search_terms = ['vocabulary', '-words'];
const settings = {
  // unnecessary
  name: 'File picker',
  options: {
    folderName: {
      type: 'text',
      defaultValue: '',
      placeholder: 'Folder name',
    },
  },
};

module.exports = async (internals) => {
  const { obsidian } = internals;

  try {
    await entry.call(this, internals);
  } catch (err) {
    new obsidian.Notice(err);
    return null;
  }
  return internals;
};

async function entry(internals) {
  {
    const { obsidian } = internals;

    const files = await internals.app.vault.getMarkdownFiles();
    const { suggester } = internals.quickAddApi;

    const filteredFiles = files.filter(filterByPath);

    const pickedFile = await suggester(suggestByBaseName, filteredFiles);

    if (pickedFile) {
      internals.variables.pickedFileName = pickedFile.basename;
      internals.variables.pickedFilePath = pickedFile.path;
    }
  }

  function filterByPath({ path }) {
    return search_terms.some((search_term) => path.includes(search_term));
  }

  function suggestByBaseName({ basename }) {
    return basename;
  }
}
