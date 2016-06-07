Erdesigner
===
###A tool to design database tables

###Introduction

This is a project i made, because i was bored at school. The theacher was annoying me with excersises about *"designing a database"*... and that's how erdesigner was born.
This is so simple that even a baby can use it.

###How to use

You can use the designer in two modes

1. Running on server (with autosave feature and teamsharing option)
2. Working offline

#####Basic interaction
**Create Table**
Press on the *"+"* button on the toolbar or press and hold on the canvas to create a new table.
New tables will be generated with an «id» attribute set as primary key.

**Create Attribute**
Pressing on the *"+"* button on the top right corner of the table, will add an attribute.

**Drop Table**
To drop a table press on the *"cog"* button on the top left corner of the chosen table. This will show the option row. After that click the «drop» button.

**Drop Attribute**
Click on the *"arrow left"* button on the right of the attribute. In the option bar that appears, click on «Delete». This will remove all connections from and to this attribute automatically.

**Set «Primary Key»**
To mark an attribute as a primary key, just press on the *"arrow left"* and than on the *"key"* icon. This button toggles the primary key option.

**Set «Foreign Key»**
Click on the *"arrow left"* button, than press on «Connect» and click the attribute you want to connect. 
__Notice:__ You can't connect two attributes from the same table. 
__Notice:__ There is a shorthand for this action, without opening the optionrow, simply drag and drop a line from the source attribute to the destination attribute.

**Remove connection**
Click on *"arrow left"*. If the attribute is connected to an other attribute, the «Connect» button will be replaced with a «Disconnect» button. This action will remove all connections to and from this attribute.

**Rename table**
To rename a table you can click on the *"cog"* button on the top left corner of the table and than click the *"edit block button"*.
__Shorthand:__ Double click the table title.

**Rename attribute**
To rename an attribute press on the *"arrow left"* button inside of the attribute row and than click on «rename»
__Shorthand:__ Doubleclick the attribute name.


###Features
- Helpwindow (trust me, is usefull)
- Keyboard shortcuts
- Contextmenu support
- ✩ Teamsharing
- ✩ Save as JSON, MySQL comamnds, SQLite commands
- No images (everything you see is SVG and Fontawesome)
- Localserver Mode and Offline mode
- ✩✩ Autosave (uses localStorage)
- Drag & Drop support
- Made with love and a beautiful design
- Uses SSE

*✩ More on this one*
*✩✩ Only on server*

#####Teamsharing *(Beta)* *(Only on server)*
Teamsharing creates a sessionvariable and a sharelink, that you can share with your friends (in local network). Both sides will be able to edit the file you are working at. Trought SSE the views will be kept in sync.
**Keep in mind: **I am not using a RealTime component (PHP isn't the best tool for this kind of job), but it was a challenge. The server checks every X seconds if the File-Modified-Time has changed, if so, the SSE will send the new data.

#####Save and export *(Beta)* *(Serverless fallback)*
You can save files as json, or export the tables you deisgned as .sql files.
If you are running the webapp on a server with php, you will be able to download the files.
If you opened just the index.html, you can still get the file content, since it will be shown in a div.

###MIT License
