
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Print API key (first few characters only for security)
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    print(f'API key found: {api_key[:5]}...')
else:
    print('No API key found!')

# Test OpenAI with new client
try:
    client = OpenAI(api_key=api_key)
    models = client.models.list()
    print('OpenAI connection successful!')
    print(f'Available models: {len(models.data)}')
except Exception as e:
    print(f'OpenAI error: {str(e)}')

