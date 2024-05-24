from .instituteController import institute_bp
from .roleController import role_bp
from .categoryController import category_bp
from .visitorController import visitor_bp
from .placeController import place_bp
from .userController import user_bp
from .apiController import api_bp

__all__ = ['institute_bp', 'role_bp', 'category_bp', 'visitor_bp', 'place_bp', 'user_bp', 'api_bp']
