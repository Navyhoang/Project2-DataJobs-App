import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

engine= create_engine("postgres://irxrnnfx:8E4uvAlptBYdblhx20hS5t_elOsRbOxm@suleiman.db.elephantsql.com:5432/irxrnnfx")

Base = automap_base()
Base.prepare(engine, reflect=True)

# Set Tables to parameters
maintable = Base.classes.maintable

# Create session (link) from Python to the DB
session = Session(engine)

# Set up Flask
app = Flask(__name__)

# Define static routes
@app.route("/")
def welcome():
    return (
        f"Homepage:<br/>"
        # f"Available Routes:<br/>"
        # f"/api/v1.0/precipitation<br/>"
        # f"/api/v1.0/stations<br/>"
        # f"/api/v1.0/tobs<br/>"
        # f"/api/v1.0/<start><br/>"
        # f"/api/v1.0/<start>/<end>"

    )

# Convert the query results to a dictionary using date as the key and prcp as the value
@app.route("/api/v1.0/heatmap")
def heatmap():

    # Set end_date and start_date
    job_id = session.query(maintable.job_id).all()

    dataset = []
    for item in job_id: 
        dataset.append(item)

    output= {"output" : [dataset]}

    return jsonify(output)
    # # Convert query results to dictionary                    
    # job_dict = dict(job_id)

    # # Show result as json file
    # return jsonify(job_dict)

# #################################################
# # Flask Setup
# #################################################
# app = Flask(__name__)

# #################################################
# # Database Setup
# #################################################
# from flask_sqlalchemy import SQLAlchemy
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://irxrnnfx:8E4uvAlptBYdblhx20hS5t_elOsRbOxm@suleiman.db.elephantsql.com:5432/irxrnnfx"
# db = SQLAlchemy(app)

# Data = db.maintable

# # class Data(db.maintable):
# #     __tablename__ = 'main'

# #     job_id = db.Column(db.job, primary_key=True)
# #     # job_title_id = db.Column(db.String(64))


#     # lat = db.Column(db.Float)
#     # lon = db.Column(db.Float)

#     # def __repr__(self):
#     #     return (job_id)
#         # return '<Pet %r>' % (self.name)

# # create route that renders index.html template
# @app.route("/")
# def home():
#     return render_template("index.html")

# # Query the database and send the jsonified results
# # @app.route("/send", methods=["GET", "POST"])
# # def send():
# #     if request.method == "POST":
# #         name = request.form["petName"]
# #         lat = request.form["petLat"]
# #         lon = request.form["petLon"]

# #         pet = Pet(name=name, lat=lat, lon=lon)
# #         db.session.add(pet)
# #         db.session.commit()
# #         return redirect("/", code=302)

# #     return render_template("form.html")


# # HeapMap data
# @app.route("/api/heatmap")
# def heatmap():
#     results = db.session.query(Data.job).all()

#     # hover_text = [result[0] for result in results]
#     # lat = [result[1] for result in results]
#     # lon = [result[2] for result in results]

#     job_data = [{
#         "job_id": results.job_id,
#         # "locationmode": "USA-states",
#         # "lat": lat,
#         # "lon": lon,
#         # "text": hover_text,
#         # "hoverinfo": "text",
#         # "marker": {
#         #     "size": 50,
#         #     "line": {
#         #         "color": "rgb(8,8,8)",
#         #         "width": 1
#         #     },
#         }
#     ]

#     return jsonify(job_data)


if __name__ == "__main__":
    app.run(debug = True)