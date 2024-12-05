# text-summarizer
A text summarization web API project for CSE 350 at the University of Louisville.__
Contributors: Malak Alesachra, Landon Blair, Logan Daugherty, Jalen (Max) Hatcher

# Installation 
## Prerequisites
1. Make sure **npm** is downloaded on your local machine. This is necessary for the project dependencies. 
2. **For _Windows_ Users**: Add the HF_HUB_DISABLE_SYMLINKS_WARNING environment variable in the control panel and set it's value to 1. So far, this project depends on the transformers package (language model chosen for summarization) and this environment variable will allow warning/errors to be disabled.

## Running the Project
1. After forking the repository, run **npm install** (this will automatically install all project dependencies).
2. Run **npm run dev**, this will launch the server.
3. Check your terminal! Below the green [nodemon] message there will be a string that looks like this: Server is running on http://localhost:[PORT]. Usually the PORT number wil be 3000, but in any case navigate to this link in a browser and you will see the front-end interface.
4. Upload your local file for testing using the browse... button. So far, this project only supports .txt and .csv files but the front-end interface handles invalid extensions.

Note: Some improvements may be made to speed up the application. Right now it is using a web-based BART CNN language model that takes dozens of seconds to generate tokens. Don't be alarmed if the application seems to stall, it's just waiting on a response from the model.

# Housekeeping
Keep in mind that all file uploads will be stored in disk on your local machine in the **uploads/** directory. Make sure to periodically clean this directory to save space!