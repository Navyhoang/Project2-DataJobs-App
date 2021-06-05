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

# Function definition
def total_job_count(title):
    # Get total counts of specific job
    job_data = session.query(maintable.job_id, country.country_name, location.state) \
                            .join(job, maintable.job_title_id == job.job_title_id) \
                            .join(country, maintable.country_id == country.country_id) \
                            .join(location, maintable.location_id == location.location_id)\
                            .filter(job.job_title == title)
    return job_data

engine= create_engine("postgres://irxrnnfx:8E4uvAlptBYdblhx20hS5t_elOsRbOxm@suleiman.db.elephantsql.com:5432/irxrnnfx")

Base = automap_base()
Base.prepare(engine, reflect=True)

# Set Tables to parameters
maintable = Base.classes.maintable
country = Base.classes.country
location = Base.classes.location
job = Base.classes.job
instituition = Base.classes.instituition
mentalhealth = Base.classes.mentalhealth

# Create session (link) from Python to the DB
session = Session(engine)

# SET UP FLASK
app = Flask(__name__)

# FRONT_END ROUTE
@app.route("/")
def main():
    return (

        render_template("index.html")

    )

# Dashboard ROUTE
@app.route("/dashboard")
def dashboard():
    return (

        render_template("dashboard.html")

    )

# Maps ROUTE
@app.route("/maps")
def maps():
    return (

        render_template("maps.html")

    )

# Word Cloud ROUTE
@app.route("/wordcloud")
def wordcloud():
    return (

        render_template("wordcloud.html")

    )

# Raw Data ROUTE
@app.route("/rawdata")
def rawdata():
    return (

        render_template("rawdata.html")

    )

# About ROUTE
@app.route("/about")
def about():
    return (

        render_template("about.html")

    )

# SERVICE ROUTES

#---------------------------------------------------------------------------------------
# HEAT MAP - JOB POSTINGS and UNIVERSITY MARKERS
#---------------------------------------------------------------------------------------
@app.route("/api/jobs")
def heatmap(): 

    # Dataa for job postings
    job_data = session.query(maintable.job_id, job.job_title, country.country_name, location.city, location.state, location.lat, location.lng) \
                            .join(job, maintable.job_title_id == job.job_title_id) \
                            .join(country, maintable.country_id == country.country_id) \
                            .join(location, maintable.location_id == location.location_id)\
                            .all()

    # Appeding each job entry from job_data to a list
    dataset = [item for item in job_data]

    # Convert the query results to a dictionary 
    output= {"jobs" : [dataset]}

    return jsonify(output)

@app.route("/api/instituitions")
def instituitions():

    # Data for job postings
    instituition_data = session.query(instituition.institution, country.country_name)\
                        .join(country, instituition.country_id == country.country_id).all()

    # Appeding each instituition entry from instituition_data to a list
    dataset = [item for item in instituition_data]

    # Convert the query results to a dictionary 
    output= {"instituitions" : [dataset]}

    return jsonify(output)

#---------------------------------------------------------------------------------------
# GAUGE INDICATORS: BENEFITS AND WELLNESS
#---------------------------------------------------------------------------------------
@app.route("/api/benefits")
def benefits():

    # Set end_date and start_date
    benefits_data = session.query(mentalhealth.benefits, mentalhealth.state, country.country_name)\
                            .join(country, mentalhealth.country_id == country.country_id)\
                            .all()

    # Appeding each benefit entry to a list
    benefits_dataset = [item for item in benefits_data]

    # Convert the query results to a dictionary 
    output= {"Benefits" : benefits_dataset}

    return jsonify(output)

@app.route("/api/wellness_programs")
def wellness_programs():

    # Set end_date and start_date
    wellness_program = session.query(mentalhealth.wellness_program, mentalhealth.state, country.country_name)\
                                .join(country, mentalhealth.country_id == country.country_id)\
                                .all()

    # Appeding each wellness entry to a list
    wellness_dataset = [item for item in wellness_program]

    # Convert the query results to a dictionary 
    output= {"Wellness Program" : wellness_dataset}

    return jsonify(output)

#---------------------------------------------------------------------------------------
# BUBBLE CHART : EASE OF TAKING LEAVE
#---------------------------------------------------------------------------------------
@app.route("/api/leave")
def leave():

    # Set end_date and start_date
    leave_Data = session.query(mentalhealth.leave, mentalhealth.state, country.country_name)\
                                .join(country, mentalhealth.country_id == country.country_id)\
                                .all()

    # Appeding each leave entry to a list
    leave_dataset = [item for item in leave_Data]

    # Convert the query results to a dictionary 
    output= {"leave" : [leave_dataset]}

    return jsonify(output)

#---------------------------------------------------------------------------------------
# STACKED BAR CHART
#---------------------------------------------------------------------------------------
# Use jobs route from heatmap session

#---------------------------------------------------------------------------------------
# SUMMARY TABLE
# Selection by User:______
# Number of Data Analyst Jobs:______
# Number of Data Scientist Jobs:_____
# Number of Data Engineer Jobs:_____
# Number of ML Jobs:_______
#---------------------------------------------------------------------------------------
@app.route("/api/summary")
def summary():

    # Get selection from user?


    # Get total counts of Data Analyst jobs
    # analyst_data = total_job_count("Data Analyst")
                       
    # # Get total counts of Data Scientist jobs
    # scientist_data = total_job_count("Data Scientist")

    # # Get total counts of Data Engineer jobs
    # engineer_data = total_job_count("Data Engineer")

    # # Get total counts of ML jobs
    # ml_data = total_job_count("Machine Learning")

    # Get total counts of each Data job
    # Put all job positings in a list
    analyst = [item for item in total_job_count("Data Analyst")]

    scientist = [item for item in total_job_count("Data Scientist")]

    engineer = [item for item in total_job_count("Data Engineer")]

    ml = [item for item in total_job_count("Machine Learning")]  
    
    # Convert the query results to a dictionary 
    output= {"Data Analyst" : [analyst],
            "Data Scientist": [scientist],
            "Data Engineer": [engineer],
            "Machine Learning": [ml]
            }

    return jsonify(output)

@app.route("/api/keywords")
def title_keywords():

    # A list for all jobs
    jobs_dict = {"Data Analyst" : 1,
            "Data Scientist": 2,
            "Data Engineer": 3,
            "Machine Learning": 4}

    # A function to count each job title keywords in the job name, return the list of frequencies
    def get_keywords_count(job_title_name):
        # Getting values from database queries with job titles
        query_titles = session.query(maintable.job_title)\
                            .filter(maintable.job_title_id == jobs_dict[job_title_name]).all()

        # Crete an empty list and a dict for frequency count
        list_title = []
        dict_output = {}

        # Create a table (remove not desired charaters) for the translate later
        table = str.maketrans(dict.fromkeys('0123456789()[].,-/&!@#$+:–\\'))

        # For each title (lowercased) in the query result, 
        # remove characters and append each keyword to the empty list
        for title in query_titles:
            new_title = title[0].lower().translate(table)
            list_title += (new_title.split(" "))


        # Count the frequency of each keyword in the list from above
        for item in list_title:
            if item != "":
                dict_output[item] = dict_output.get(item, 0) + 1
        
        return dict_output
    
    # Create an empty dict, iterate the title in jobs_dict to create a dict of results
    # output_titles = {}
    # for kw in jobs_dict:
    #     # Assign function returned value to a new key
    #     output_titles[kw] = get_keywords_count(kw)
    
    # Using dict generator expression to create a frequency dictionary
    output_titles = dict((kw, get_keywords_count(kw)) for kw in jobs_dict)

    return jsonify(output_titles)

if __name__ == "__main__":
    app.run(debug = True)