const { vault } = this.app;
const { moment } = window;

const getFolder = () => 'A_fleeting_notes';
const rolloverMarkCharacter = '❗';
async function rollover(
  folder = getFolder(),
  format = 'YYYY-MM-DD',
  tasksHeader = '- [ ] ==TASKS==',
  rolloverMarkCharacter = rolloverMarkCharacter
) {
  const todos = await getAllUnfinishedTodos(
    getLastDailyNote(folder, format),
    tasksHeader
  );
  const note_content = todos.join(`${rolloverMarkCharacter}\n`);
  return note_content;
}

async function getAllUnfinishedTodos(abstractFile, tasksHeader) {
  const contents = await vault.read(abstractFile);
  // const contentsForDailyTasks = contents.split(tasksHeader).first() || contents;
  const regex = /==TASKS==\s*-+\s*\n([\s\S]*)/g;
  const matchedContents = regex.exec(contents);
  const _matchedContents = matchedContents.at(0);
  console.log({ matchedContents });
  if (!_matchedContents) return [];
  const unfinishedTodos = Array.from(
    _matchedContents.matchAll(/\t*- \[ \].*/g)
  );

  return unfinishedTodos;
}

function getLastDailyNote(folder, format) {
  // get all notes in directory that aren't null
  const dailyNoteFiles = vault
    .getAllLoadedFiles()
    .filter((file) => file.path.startsWith(folder))
    .filter((file) => file.basename != null);

  // remove notes that are from the future
  const todayMoment = moment();
  let dailyNotesTodayOrEarlier = [];
  dailyNoteFiles.forEach((file) => {
    if (moment(file.basename, format).isSameOrBefore(todayMoment, 'day')) {
      dailyNotesTodayOrEarlier.push(file);
    }
  });

  // sort by date
  const sorted = dailyNotesTodayOrEarlier.sort(
    (a, b) =>
      moment(b.basename, format).valueOf() -
      moment(a.basename, format).valueOf()
  );
  return sorted[1];
}

module.exports = rollover;
