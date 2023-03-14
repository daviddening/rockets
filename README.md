# ROCKETS

#### Video Demo:  https://youtu.be/Y2VhaMvIM1Q

#### Description:
Since Dave and Ben worked through CS50 as partners, they decided to conquer the FINAL PROJECT as a team. Multiple ideas were suggested and the final decision was made to write a web application that utilizes and expands upon a number of the skills learned in CS50.

The appliction would be a game in which a player is presented with a grid, on which a number of unlit rockets are placed. At minimum scope, the rockets would point either up, down, left, or right. If time allowed, other rocket types would be added: double direction, ones that would not light, ones a flying rocket would fly through and more. In the end, we added bi-directional rockets to the original 4 directional ones.

The goal of the game is set off a chain reaction that clears the board by lighting (clicking on) as few rocket as possible. The lit rocket will either fly off the board or hit another unlit rocket. If a collision occurs, the moving rocket explodes and lights the unlit one, sending it (hopefully) on a collision course with another rocket. Each time a collision occurs, the score is increased. The game is over when all rockets are cleared from the board.

The player  registers for an account with nickname, username and password. They then log in to play the game. This is handled by Python and Sqlite3.

The application's structure and who did what:

We discussed using Django as a framework for this application. Experience with Django is in demand professionally and this seemed like an opportunity to gain some skills. After discussing, we decided that learning a new framework would add unnecessary complexity and time to this project and we already had enough challenges ahead of us. We chose, instead to use a similar setup as we used in CS50 Finance: Flask with Python server side and javascript client side.

We decided to write the game to run mostly server side. Since neither Dave or Ben had worked with <canvas> and animating with javascript, we decided this would be a fun approach that would allow us to learn new skills.

We collaborated, using Git and Github (also a new skill for Ben) and decided that staying on CS50's VSCode would simplify things since Flask, Sqlite3 and Python are already installed and updated. We tracked our progress with a Google spreadsheet.

Ben set up the initial Flask application, database, log in and out functionality, canvas, game board and rockets design and animation.

Dave wrote the rocket logic (no small feat). He also set up the main Git repository and project management spreadsheet.

Dave and Ben worked together very well. The acomplished most of their inital as well as next-level goals.
CS50 Project

A collaboration of Ben McGroaty and David Dening

## Rockets Dev Workflow

### Github
https://github.com/daviddening/rockets

### Workflow
[Git and Workflow](WORKFLOW.md)

## Local Setup
- Clone git repo, per the workflow above
- `flask run`