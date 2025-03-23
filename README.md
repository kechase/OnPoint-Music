# OnPoint-Music: A package for online experiments in auditory-motor mapping

The goal of the github repository is to help you host an auditory-motor mapping
experiment online with a website coded in Javascript/HTML/CSS and hosted on the [Firebase server](https://firebase.google.com/). Participants can be
recruited using [Amazon Mechanical Turk Requester](https://requester.mturk.com/),
[Prolific](https://www.prolific.co/), or any other crowdsourcing platform.

[Try the experiment here.](https://onpoint-music.web.app/)

<img src="public/images/demo-auditory-motor-mapping_trimmed.mov" width="720" height="404" />

## To run the experiment local host

Once you're logged into Firebase you can run 'Firebase serve' via terminal or your command line 
to see the local version of the website before you push it live (or change the live version). 

## Dependencies

1. [Python3](https://www.python.org/downloads/)
2. [Firebase](https://firebase.google.com/docs/cli): functions needed to host
   your online experiment on Google's Firebase server.

## Important files

1. Javascript code to make your experiment dynamic (e.g., appearance of a
   target): `public/index.js`
2. HTML files to create the content (e.g., experiment instructions):
   `public/index.html`
3. CSS files to style your content (e.g., color): `public/static/`.
4. JSON target files (e.g., experiment design, with one row corresponding to one
   trial): `public/tgt_files/`.
5. Downloading data from the Firebase server to your local computer:
   `python_scripts/db_csv.py`.
6. Generate JSON target files: `public/tgt_files/generate_test_rot.py`.
7. Convert CSV target files into JSON files: `python_scripts/csv_json.py`.
8. Example JSON target file: `public/tgt_files/demo_file`

## Current manual

For a detailed step-by-step breakdown, please visit
[OnPoint-Music: Manual for Hosting Online Experiments in Auditory Motor-Mapping]
(https://docs.google.com/document/d/1QTiHfO1I2paq13dnur4GfYfo-IfTUwdt1AQebZ6CTWo/edit?tab=t.0)

## Origin of this experiment

The original code base is  
[github's issue tab](https://github.com/alan-s-lee/Reaching_Exp_Online/)!

## Acknowledgements

J.S.Tsay was funded by a 2018 Florence P. Kendall Scholarship from the Foundation
for Physical Therapy Research. This work was supported by grant NS092079 from
the National Institutes of Health.