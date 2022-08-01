## Instructions for setting up the environment variables for the project

In order to connect to the SQL database, you must have make two .env files in your project directory.

To make this easier for you the code you need is in quotation marks.

Simply highlight the code between the quotation marks and copy-paste the following in to the correct file.

Step 1: In the project directory folder, create a new file and call it:

".env.development"

Step 2:
Open the .env.development file
in a text editor or a program like vscode and paste the following code:

"PGDATABASE=nc_news"

Step 3:
In the same project directory folder, create a new file and call it:

".env.test"

Step 4:
In the .env.test file paste the following:

"PGDATABASE=nc_news_test"

Step 5:
**IMPORTANT:** You must add the .env file to your
".gitignore" file.
You can do this by opening your .gitignore file in a text editor like you did earlier and adding the following line:

".env.\*"

Step 6:

In order for PGDATABASE to be recognized, you must install the pg module.

The installation part is very simple as the package.json file already has the pg module typed up you just need to run the following command in the terminal:

"npm install"
