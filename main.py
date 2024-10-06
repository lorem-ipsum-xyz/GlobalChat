# START: October 6, 2024
from flask import jsonify, Flask, render_template, session, request, redirect, url_for
from flask_socketio import SocketIO

app = Flask(__name__)
app.secret_key = "I love You"
io = SocketIO(app)

chat = {"users": {},"online": 0}

@app.route("/")
def index():
  name = session.get('username')
  if name:
    return render_template('index.html', name=name),200
  return render_template('login.html', error=None),200
  
@app.route('/login', methods=['GET', 'POST'])
def login():
  error = None
  if request.method == 'POST':
    username = request.form['username'].strip().lower()
    profile = request.form.get("profile")
    if username not in chat['users']:
      session['username'] = username
      session['profile'] = profile
      io.emit('conn', {"name":username, "pfp": profile})
      return redirect(url_for('index'))
    error = "Username already taken"
  return render_template('login.html', error=error), 200

@io.on("connected")
def connectedss(d):
  rss = request.sid
  chat['users'][rss] = {
    "name": d["name"],
    "profile": d["profile"],
    "id": str(rss)
  }
  chat["online"] += 1
  data = {
    "online": chat["online"],
    "name": d['name'],
    "connected": True
  }
  print("User connected: ", d['name'])
  io.emit('chat', data)


@io.on('text')
def new_message(message):
  data = {
    "name": session.get('username'),
    "profile": session.get("profile"),
    "message": message
  }
  io.emit('message', data)

@io.on("disconnect")
def user_disconnected():
  #print(data)
  sid = request.sid
  if str(sid) in chat['users']:
    username = chat['users'][sid]['name']
    chat['online'] -= 1
    del chat['users'][sid]
    data = {
      "name": username,
      "online": chat['online'],
      "connected": False
    }
    #print(f"\033[93m{data}\033[0m")
    io.emit('chat', data)
  
if __name__ == '__main__':
  io.run(app)
# END: October 7, 2024
