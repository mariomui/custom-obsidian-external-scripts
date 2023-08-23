# -

This note is an [[interim_external-guide-note-taxon]] that 
Externally lifecycle loaded scripts injected by plugins to enhance obsidianmd quality of life
* [ ] Prefix defintion notes with `the` 
  * Document capitalization convention
  * I want to know that a particular note is a defintion note but I also want to know if the content has been touched. Normally, i would leave note titles lower capitlized, and have that indicate that the note is a work in progress.
  * I think i like having it lowercased as it removes the wip_ status prefix , simplifying the system but without that, i still require differentiation between Definition notes and non definition notes.
  * 🔍 Candidates for [[Definition-note-taxon]] vs [[Structural-note-supertaxon]] vs wip_ notes ⬇️
    * `interim_.external-guide-note-taxon` -> .external-guide-note-taxon -> External-guide-note-taxon
      * Cons
        * Retroactive renaming of all taxons based off [[Definition-note-taxon]], R * X * ( N + (M extend N) + (O extend N) ...) work.
    * `interim_internal-guide-note-taxon` -> external-guide-note-taxon -> External-guide-note-taxon
      * Automatically assume that external guide notes are definition notes?
      * Pros:
        * No change to internal system.
      * Cons: 
        * Increase in note taking cognitive load at an N x M (note x link) degree. 
  * :summary: 
   * The candidate solutions are pretty bad. 
   * I will remove the feature and keep capitization for note taxons extending the definition taxon.
This folder houses loadup scripts. 

# =

* Exaptively
  * For quickadd, you can intercept the quickadd execution and interject your own logic. Typical capture would hard code the note file to insert a temporary thoughtnote---but the ideal circumstances would have a suggester modal
suggesting/and allowing us to choose which note to insert a thought into. A generic capture helps shorten the note-working, allows us to directly categorize notes on creation. 
Further interception would allow you to filter the notes by key words, allowing the user to insert thoughts into specifically prefixed notes such as "inbox-notes...", notes predefined categorically.
