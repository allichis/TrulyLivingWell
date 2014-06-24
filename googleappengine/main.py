import os
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import jinja2
import webapp2


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)
    
    
class MainPage(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/index.html')
        self.response.write(template.render())
        
class AdminPage(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/admin/adminindex.html')
        self.response.write(template.render())
        
class VolunteerSignIn(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/volunteersignin.html')
        self.response.write(template.render())
                
class VolunteerSignOut(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/volunteersignout.html')
        self.response.write(template.render())
        
class NewVolunteer(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/newvolunteer.html')
        self.response.write(template.render())
        
class VisitorSignIn(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/visitorsignin.html')
        self.response.write(template.render())

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/volunteer/signin', VolunteerSignIn),
    ('/volunteer/signout', VolunteerSignOut),
    ('/volunteer/new', NewVolunteer),
    ('/visitorsignin', VisitorSignIn),
    ('/admin', AdminPage),
], debug=True)
