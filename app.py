from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from datetime import datetime
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///rockets.db")

# I don't understand if this is needed. Copying from /finance
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
@login_required
def index():
    return render_template("index.html", nickname=session['nickname'])

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached rout via POST (tried to log in via the form)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            # Info on 403: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
            return apology("must provide username", 401)

        elif not request.form.get("password"):
            return apology("must provide password", 401)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 401)

        # Remeber what user logged in
        session["user_id"] = rows[0]["user_id"]

        # Remember user nickname
        session["nickname"] = rows[0]["nickname"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (clicked a link or redirected)
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # ENSURE USERNAME WAS SUBMITTED
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Ensure username does not exist already
        username = request.form.get("username")
        if db.execute("SELECT username FROM users WHERE username=(?)", username):
            return apology("username already exists", 400)


        # Ensure password is entered
        if not request.form.get("password"):
            return apology("must provide a password", 400)


        # Ensure confirmation exists
        if not request.form.get("confirmation"):
            return apology("must provide a confirmation", 400)


        # Ensure password and cinfirmation match
        if request.form.get("password") != request.form.get("confirmation"):
            return apology("Passwords do not match!", 400)


        # Register user if they passed previous tests
        password = request.form.get("password")
        nickname = request.form.get("nickname")

        db.execute("INSERT INTO users(username, hash, nickname) VALUES(?, ?, ?)", username, generate_password_hash(password), nickname)
        return redirect("/")

    else:
        return render_template("register.html")

