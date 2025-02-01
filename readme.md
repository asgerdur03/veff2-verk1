
data:

- index.json: upplýsingar fyrir index page, með link á undirsíður
    - invalid.js: gild vísun í skrá sem er ekki til
    - foo: óglid vísun

title: heiti spurningaflokks
file: vísun í .json skrá með spurningum


- corrupt.json: gölluð gögn í skrá, en hefur vísun í index.js


- css, html, js: legit, inniheldur titil, lista af spurningur og svörunum við þeim

title: heiti spurningaflokks
questions: fylki af spurningurm, hver spurning samanstendur af:
    question: spurningatexti
    answers: fylki af svarmöguleikum
        answer: svarmöguleiki
        correct: true ef svar er rétt



