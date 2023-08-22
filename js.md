---
Aliases: ["__README__js", js]
tag: _nts-v1/structural-note
---
# -

This [[folder-page]] list the folders and its files recursively in flattened form. This is needed because files with extensions that are not `.md` are not displayed. 

> [!warning] There is some work here with the dataviewjs code holding a prototype version of a basic rendering recursion api 

- [ ] #_todo/long-term/to-refactor/on-notes/regarding-duplicated-dataviewjs-code Replace the duplicated code with a single transclusion line.


# = 
* [ ] #_todo/to-process/on-a-dataviewjs-codelet/regarding-replacement-for-dataview-list  #_todo/priority-high/to-extract/on-a-dataviewjs-codelet Lift and refactor the code below into its own view file.
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


///////

/**
        child, //value 
        li,  // container
        isExpandList, // alwways expand list really
        "list", // context
         depth + 1 // escape hatch
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

function manuLiCss() {
 return { cls: "dataview-result-list-li" }
}

// i hate this fucntion.
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
```
