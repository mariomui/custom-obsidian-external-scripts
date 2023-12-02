---
Aliases: ["__README__js", js]
tag: _noteshippo/structural-note
---
# -

This [[folder-page,vis-Noteshippo,]] list the folders and its files recursively in flattened form. This is needed because files with extensions that are not `.md` are not displayed. 

> [!warning] There is some work here with the dataviewjs code holding a prototype version of a basic rendering recursion api 

- [ ] #_todo/long-term/to-refactor/on-note/regarding-duplicated-dataviewjs-code Replace the duplicated code with a single transclusion line.
* [ ] Prefix defintion notes with `the` 
  * Document capitalization convention
  * I want to know that a particular note is a defintion note but I also want to know if the content has been touched. Normally, i would leave note titles lower capitlized, and have that indicate that the note is a work in progress.
  * I think i like having it lowercased as it removes the wip_ status prefix , simplifying the system but without that, i still require differentiation between Definition notes and non definition notes.
  * 🔍 Candidates for [[Definition-spec,vis-Noteshippo-taxonomy,]] vs [[Structural-note-supertaxon]] vs wip_ notes ⬇️
    * 🎲Prefixing Style:
      * 💁 Prefix with a dot...
        * `interim_.external-guide-note-taxon` -> .external-guide-note-taxon -> External-guide-note-taxon
          * Cons
            * Retroactive renaming of all taxons based off [[Definition-spec,vis-Noteshippo-taxonomy,]], R * X * ( N + (M extend N) + (O extend N) ...) work.
      * 💁 🤔 Prefix using `the` 
        * Pros and cons, [[,aka-ibidem]]
        * Unignorable con: 
          * a strong prefix using indefinite or definite articles requires outside systems to use it in a singular way. (rigidity) 🧪🈴 
            * 🔎  `the-board` vs `board`
              * I am completing the `board`
              * I am completing the `the-board`
              * I am completing the `board`s
              * I am completing `the-board`s 
                * if i change my mind on the prefix, the mutation requires me to prescriptively reach outside the note title (increasing work by a ton)
      * 💁 Prefix using `(def.)`
        * 
    * 🎲 [[Domain-specific-language,]] Style:
      * 💁 Encode in existing taxon...
        * `interim_internal-guide-note-taxon` -> external-guide-note-taxon -> External-guide-note-taxon
          * Automatically assume that external guide notes are definition notes?
          * Pros:
            * No change to internal system.
          * Cons: 
            * Increase in note taking cognitive load at an N x M (note x link) degree. 
  * :summary: 
   * The candidate solutions are pretty bad. 
   * I will remove the feature and keep capitization for note taxons extending the definition taxon.


# = 
* [ ] #_todo/to-process/on-a-codelet/regarding-dataviewjs/regarding-replacement-for-dataview-list  #_todo/priority-high/to-extract/on-a-dataviewjs-codelet Lift and refactor the code below into its own view file.
  * 🤔 If you the folder name by active file, the retrigger somtimes gets the activeFile! the dv refreshes while your cursor is on another page. This really means that this thing Really requires parameterization a


```dataviewjs
const {vault, plugins, workspace, fileManager, metadataCache} = this.app;
const {default: obs} = plugins.plugins['templater-obsidian'].templater.current_functions_object.obsidian

const current_file_path = dv.currentFilePath

workspace.onLayoutReady(main.bind(this))

function main() {
  //knobs
  // const vf = workspace.getActiveFile()
  // const folder_path = vf?.parent?.path
  const folder_path = vault
  .getAbstractFileByPath(current_file_path).parent?.path;
  if (!folder_path) return;

  //workhorse
  (async function(ctx, genRenderVfs) {
    // start scope 
    { var _files = [],
          recursedVfs = []; 
      
      try {
        var recursedVfs = await getRecursiveList(folder_path)

        const {files} = await genListByFolderPath(
          folder_path
        );
        console.log({files})
        var _files = _files.concat(files)
      } catch(err) {
        console.error(err);
        return err;
      }
      await genRenderVfs(recursedVfs)
    } // end scope
    
    return;
  })(
    this, 
    genRenderVfs.bind(this),
  );
}


async function genRenderVfs(vfs) {

  for (const vf of vfs) {

    if (vf.hasOwnProperty("children")) {
      const {files} = await genListByFolderPath(vf.path)

      await genListAsDomV2.call(this, vf.name, files)
    }
  }
  return;
}

async function genListAsDomV2(header,datums) {
  await customRenderFiles.call(this,[header,datums])
}

/**
@param val{string|Array}
@param 
@return void
**/
async function customRenderFiles(file_paths) {
  const $frag = document.createDocumentFragment();
  await genRenderValue.call(this,
    file_paths, 
    $frag,
    true,
    "list",
    0,
    new obs.Component()
  )
  return this.container.append($frag)
}
function renderFiles(file_paths) {
 
  const links = file_paths
    .map((file_path) => {
      const vf = vault.getAbstractFileByPath(
        file_path
      );
      /* return metadataCache.fileToLinktext(
        vf, ""
      );
      */ // dumb api that generates the shortname from a vfile
      return fileManager.generateMarkdownLink(vf, "")
    })

  dv.list(links);
}
async function genListByFolderPath(folder_path) {
    const list = await vault.adapter
      .list(obs.normalizePath(folder_path))
    return list
}
async function getRecursiveList(path) {
  const vfs = []
  const tfolder = vault.getAbstractFileByPath(path)
  const reclist = await obs.Vault.recurseChildren(tfolder, cb)
  return vfs;
  
  function cb(vf) {
    vfs.push(vf);
  }
}

function getFileNameFromPath(file_path) {
  const {name} = vault.adapter.path.parse(filepath)
  return name;
}



function isArray(candidate) {
  return Object.prototype.toString.call(candidate) === '[object Array]';
}


/**
        child, //value 
        li,  // container
        isExpandList, // alwways expand list really
        "list", // context
         depth + 1 // escape hatch
         
@desc recursive renderer of lists.
**/
async function genRenderValue(
  val,
  container,
  isExpandList, 
  context, 
  depth,
  component
) {
  if (depth > 2) return;
  if (typeof val === "string") {
    await genRenderCompactMarkdown(
      val,
      container,
      "",
      component
    )
    return; 
  }
  
  if (isArray(val)) {
  
    const clss = context === "list" ?
      "dataview-result-list-ul" : 
      "dataview-result-list-root-ul";
    const cls = {
      cls: [
        "dataview",
        "dataview-ul",
        clss
      ]
    }
    let list = container.createEl(
      "ul", 
      {cls}
    );
    for (let child of val) {
      let li = list.createEl("li", manuLiCss());
      await genRenderValue(
        child, //value 
        li,  // container
        isExpandList, // is rest of list
        "list", // context
        depth + 1, // escape hatch
        component
      );
    }
  }
}
/**
@desc LIterally attaches a span literal to the subcontainer right away.
**/
async function genRenderCompactMarkdown(
    markdown, // string,
    container, // HTMLElement,
    sourcePath, // string,
    component // Component
) {
  let subcontainer = container.createSpan();
  await obs.MarkdownRenderer.renderMarkdown(
    markdown, subcontainer, sourcePath, component
  );
  
}

function manuLiCss() {
 return { cls: "dataview-result-list-li" }
}
```
