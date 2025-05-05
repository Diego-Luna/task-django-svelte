import re
import logging
from django.http import HttpResponseForbidden

logger = logging.getLogger('django.security')

class SecurityMiddleware:
    """Custom security middleware to protect against common attacks"""
    
    def __init__(self, get_response):
        self.get_response = get_response
        # SQL injection patterns in URLs
        self.sql_patterns = re.compile(
            r'((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))', 
            re.IGNORECASE
        )
        # XSS patterns in URLs
        self.xss_patterns = re.compile(
            r'<(script|iframe|embed|object|img|style|applet|body|html|form|input)',
            re.IGNORECASE
        )
    
    def __call__(self, request):
        # Log client IP address for security monitoring
        client_ip = self.get_client_ip(request)
        logger.info(f"Request from IP: {client_ip}, Path: {request.path}")
        
        # Check URL parameters for potential attacks
        query_string = request.META.get('QUERY_STRING', '')
        url_path = request.path_info
        
        # Check for SQL injection in URL
        if self.sql_patterns.search(url_path) or self.sql_patterns.search(query_string):
            logger.warning(f"SQL Injection attempt detected from {client_ip}: {url_path}?{query_string}")
            return HttpResponseForbidden("Forbidden: Security violation detected")
            
        # Check for XSS in URL
        if self.xss_patterns.search(url_path) or self.xss_patterns.search(query_string):
            logger.warning(f"XSS attempt detected from {client_ip}: {url_path}?{query_string}")
            return HttpResponseForbidden("Forbidden: Security violation detected")
            
        # Process the request normally
        response = self.get_response(request)
        
        # Add additional security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['X-Frame-Options'] = 'DENY'
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        
        return response
    
    def get_client_ip(self, request):
        """Extract the client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip