from flask import Blueprint

# Blueprint is a way to organize a group of related views and other code.
# Instead of registering views and other code directly with an application,
# they are registered with a blueprint. Then, the blueprint is registered
# with the application when it is available in a factory function.
api = Blueprint('api', __name__)

# This is the same route we had in run.py, but now it's part of the 'api' blueprint.
@api.route('/')
def index():
    """
    This function handles requests to the root URL ('/') for the API blueprint.
    It returns a simple string to confirm the API is accessible.
    """
    return "API is Running!"