import requests
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class FinnhubService:
    BASE_URL = "https://finnhub.io/api/v1"
    
    def __init__(self, api_key=None):
        self.api_key = api_key or getattr(settings, 'FINNHUB_API_KEY', None)
        if not self.api_key:
            raise ValueError("Finnhub API key is required")
    
    def _get_headers(self):
        """Get headers with API key"""
        return {'X-Finnhub-Token': self.api_key}
    
    def get_quote(self, symbol):
        """Get real-time stock quote"""
        cache_key = f"finnhub_quote_{symbol}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data

           
        url = f"{self.BASE_URL}/quote"
        params = {"symbol": symbol}
        
        try:
            response = requests.get(url, params=params, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Cache for 30 seconds
            cache.set(cache_key, data, 30)
            return data
            
        except Exception as e:
            logger.error(f"Error fetching quote for {symbol}: {e}")
            return None
    
    def get_company_profile(self, symbol):
        """Get company profile"""
        cache_key = f"finnhub_profile_{symbol}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
            
        url = f"{self.BASE_URL}/stock/profile2"
        params = {"symbol": symbol}
        
        try:
            response = requests.get(url, params=params, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Cache for 1 hour
            cache.set(cache_key, data, 3600)
            return data
            
        except Exception as e:
            logger.error(f"Error fetching profile for {symbol}: {e}")
            return None
    
    def get_options_data(self, symbol):
        """Get options data (premium feature)"""
        url = f"{self.BASE_URL}/stock/option-chain"
        params = {"symbol": symbol}
        
        try:
            response = requests.get(url, params=params, headers=self._get_headers(), timeout=10)
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"Error fetching options for {symbol}: {e}")
            return None