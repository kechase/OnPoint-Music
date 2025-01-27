# OnPoint-Music: A package for online experiments in auditory-motor mapping

The goal of the github repository is to help you host your auditory-motor mapping
experiment online. For a detailed step-by-step breakdown, please visit the
[OnPoint-Music: Manual for Hosting Online Experiments in Auditory Motor-Mapping]
(https://docs.google.com/document/d/1QTiHfO1I2paq13dnur4GfYfo-IfTUwdt1AQebZ6CTWo/edit?tab=t.0)
The experiment is in essence a website coded in Javascript/HTML/CSS and hosted
on the [Firebase server](https://firebase.google.com/). Participants can be
recruited using
[Amazon Mechanical Turk Requester](https://requester.mturk.com/),
[Prolific](https://www.prolific.co/), or any other crowdsourcing platform.

[Try out one of our experiments here.](https://onpoint-music.web.app/)

<img src="public/images/sampleOut.gif" width="720" height="404" />

## To run the experiment local host

Once you're logged into Firebase you can do 'Firebase serve' to see the 
local version of the website before you push it live (or change the live version). 

## Dependencies

1. [Python3](https://www.python.org/downloads/)
2. [Firebase](https://firebase.google.com/docs/cli): functions needed to host
   your online experiment on Google's Firebase server.
3. [Amazon Mechanical Turk Requester](https://requester.mturk.com/) &
   [Prolific](https://www.prolific.co/): Crowdsourcing websites used to recruit
   participants.

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

## Need help?

If you are stuck, please make a comment on the
[Manual] (https://docs.google.com/document/d/1QTiHfO1I2paq13dnur4GfYfo-IfTUwdt1AQebZ6CTWo/edit?tab=t.0)
or use the original code base at 
[github's issue tab](https://github.com/alan-s-lee/Reaching_Exp_Online/issues)!

## Acknowledgements

J.S.T was funded by a 2018 Florence P. Kendall Scholarship from the Foundation
for Physical Therapy Research. This work was supported by grant NS092079 from
the National Institutes of Health.

## How to cite this?

Tsay, J. S., Ivry, R. B., Lee, A., & Avraham, G. (2021). Moving outside the lab:
The viability of conducting sensorimotor learning studies online. Neurons,
Behavior, Data Analysis, and Theory. https://doi.org/10.51628/001c.26985

## Other Research using OnPoint

Tsay, J.S., Asmerian, H., Germine, L.T. et al. Large-scale citizen science
reveals predictors of sensorimotor adaptation. Nat Hum Behav 8, 510–525 (2024).
https://doi.org/10.1038/s41562-023-01798-0

Wang, T., Avraham, G., Tsay, J. S., Thummala, T., & Ivry, R. B. (2024). Advanced
feedback enhances sensorimotor adaptation. Current Biology: CB.
https://doi.org/10.1016/j.cub.2024.01.073

Tsay, J. S., Kim, H. E., Saxena, A., Parvin, D. E., Verstynen, T., & Ivry, R. B.
(2022). Dissociable use-dependent processes for volitional goal-directed
reaching. Proceedings. Biological Sciences, 289(1973), 20220415. [supplementary
experiment]

Tsay, J. S., Haith, A. M., Ivry, R. B., & Kim, H. E. (2022). Interactions
between sensory prediction error and task error during implicit motor learning.
PLoS Computational Biology, 18(3), e1010005.

Avraham, G., Ryan Morehead, J., Kim, H. E., & Ivry, R. B. (2021). Reexposure to
a sensorimotor perturbation produces opposite effects on explicit and implicit
learning processes. PLoS Biology, 19(3), e3001147. (See supplemental figure, S2)

Shyr, M. C., & Joshi, S. S. (2021). Validation of the Bayesian sensory
uncertainty model of motor adaptation with a remote experimental paradigm. 2021
IEEE 2nd International Conference on Human-Machine Systems (ICHMS),
