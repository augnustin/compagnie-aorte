import webapp2

class MainHandler(webapp2.RequestHandler):
    def get(self):
    	self.response.headers['Content-Type'] = 'text/html; charset=utf-8'
    	self.response.out.write(open('src/index.html', 'r').read())

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
