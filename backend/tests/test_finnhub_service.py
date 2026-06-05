import unittest
from unittest.mock import patch, Mock
from django.test import TestCase
from django.conf import settings
from apps.market_data.finnhub_service import FinnhubService


class TestFinnhubService(TestCase):
    
    def setUp(self):
        self.api_key = 'd46ci01r01qgc9es6aggd46ci01r01qgc9es6ah0'
        self.service = FinnhubService(api_key=self.api_key)
    
    def test_init_with_api_key(self):
        """Test initialization with API key"""
        service = FinnhubService(api_key='test_key')
        self.assertEqual(service.api_key, 'test_key')
    
    def test_init_without_api_key_raises_error(self):
        """Test initialization without API key raises ValueError"""
        with patch.object(settings, 'FINNHUB_API_KEY', None):
            with self.assertRaises(ValueError):
                FinnhubService()
    
    @patch('apps.market_data.finnhub_service.requests.get')
    @patch('apps.market_data.finnhub_service.cache.get')
    @patch('apps.market_data.finnhub_service.cache.set')
    def test_get_quote_success(self, mock_cache_set, mock_cache_get, mock_requests):
        """Test successful quote retrieval"""
        # import pdb; pdb.set_trace()  # Uncomment for debugging
        mock_cache_get.return_value = None
        mock_response = Mock()
        mock_response.json.return_value = {
            'c': 150.0,
            'd': 2.5,
            'dp': 1.69,
            'h': 152.0,
            'l': 148.0,
            'o': 149.0,
            'pc': 147.5,
            't': 1609459200
        }
        mock_response.raise_for_status.return_value = None
        mock_requests.return_value = mock_response
        
        result = self.service.get_quote('AAPL')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['c'], 150.0)
        mock_requests.assert_called_once()
        mock_cache_set.assert_called_once()
    
    @patch('apps.market_data.finnhub_service.cache.get')
    def test_get_quote_from_cache(self, mock_cache_get):
        """Test quote retrieval from cache"""
        cached_data = {'c': 150.0, 'd': 2.5}
        mock_cache_get.return_value = cached_data
        
        result = self.service.get_quote('AAPL')
        
        self.assertEqual(result, cached_data)
    
    @patch('apps.market_data.finnhub_service.requests.get')
    @patch('apps.market_data.finnhub_service.cache.get')
    def test_get_quote_request_failure(self, mock_cache_get, mock_requests):
        """Test quote retrieval request failure"""
        mock_cache_get.return_value = None
        mock_requests.side_effect = Exception('API Error')
        
        result = self.service.get_quote('AAPL')
        
        self.assertIsNone(result)
    
    @patch('apps.market_data.finnhub_service.requests.get')
    @patch('apps.market_data.finnhub_service.cache.get')
    @patch('apps.market_data.finnhub_service.cache.set')
    def test_get_company_profile_success(self, mock_cache_set, mock_cache_get, mock_requests):
        """Test successful company profile retrieval"""
        mock_cache_get.return_value = None
        mock_response = Mock()
        mock_response.json.return_value = {
            'name': 'Apple Inc',
            'exchange': 'NASDAQ',
            'finnhubIndustry': 'Technology',
            'marketCapitalization': 2500000,
            'country': 'US',
            'currency': 'USD',
            'weburl': 'https://apple.com',
            'logo': 'https://logo.url'
        }
        mock_response.raise_for_status.return_value = None
        mock_requests.return_value = mock_response
        
        result = self.service.get_company_profile('AAPL')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['name'], 'Apple Inc')
        mock_requests.assert_called_once()
        mock_cache_set.assert_called_once()
    
    @patch('apps.market_data.finnhub_service.requests.get')
    @patch('apps.market_data.finnhub_service.cache.get')
    def test_get_company_profile_failure(self, mock_cache_get, mock_requests):
        """Test company profile retrieval failure"""
        mock_cache_get.return_value = None
        mock_requests.side_effect = Exception('API Error')
        
        result = self.service.get_company_profile('AAPL')
        
        self.assertIsNone(result)
    
    @patch('apps.market_data.finnhub_service.requests.get')
    def test_get_options_data_success(self, mock_requests):
        """Test successful options data retrieval"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'data': [
                {'strike': 150, 'type': 'call', 'premium': 5.0}
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_requests.return_value = mock_response
        
        result = self.service.get_options_data('AAPL')
        
        self.assertIsNotNone(result)
        self.assertIn('data', result)
    
    @patch('apps.market_data.finnhub_service.requests.get')
    def test_get_options_data_failure(self, mock_requests):
        """Test options data retrieval failure"""
        mock_requests.side_effect = Exception('API Error')
        
        result = self.service.get_options_data('AAPL')
        
        self.assertIsNone(result)
    
    def test_api_key_from_settings(self):
        """Test API key retrieval from settings"""
        with patch.object(settings, 'FINNHUB_API_KEY', 'settings_key'):
            service = FinnhubService()
            self.assertEqual(service.api_key, 'settings_key')


if __name__ == '__main__':
    unittest.main()