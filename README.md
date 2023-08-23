# -

This note is an [[interim_external-guide-note-taxon]] that is generated to provide the [[github]] public with an idea of what this folder does.

The [[js]],aka [[js|__README__js]] is the more up to date version but far less readable.

Externally lifecycle loaded scripts injected by plugins to enhance obsidianmd quality of life

This repository/folder houses scripts designed to augment the plugins used in the [[ObsidianMD-app]], provided that those plugins expose their api.

# =

* Exaptively
  * For quickadd, you can intercept the quickadd execution and interject your own logic. Typical capture would hard code the note file to insert a temporary thoughtnote---but the ideal circumstances would have a suggester modal

# ---Transient

suggesting/and allowing us to choose which note to insert a thought into. A generic capture helps shorten the note-working, allows us to directly categorize notes on creation. 
Further interception would allow you to filter the notes by key words, allowing the user to insert thoughts into specifically prefixed notes such as "inbox-notes...", notes predefined categorically.
